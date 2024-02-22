require('dotenv').config();

// HTTP PROTOCOL HANDLE //

// Import Skrip 
const express = require('express')
const db = require("./connection")
const cors = require('cors')
const path = require('path')

const oauthRoutes = require('./routes/oauthRoutes')
const devicesRoutes = require('./routes/devicesRoutes')
const usersRoutes = require('./routes/usersRoutes')

// mendefiniskan fungsi ekspress pada variabel App
const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// menampilkan setiap request yang diterima
app.use((req, res, next) => {
     console.log(req.path, req.method)
     next()
})

//mengatur Jalur request (Entry Point)
// Terdapat Routes dan Controller 
// Routes berisi rute request
// Controler berisi setiap fungsi untuk menangani request
app.use('/v1/oauth', oauthRoutes) // untuk menangani request autentifikasi seperti sign in dan sign up
app.use('/v1/users', usersRoutes) // untuk menangani request yang berkaitan dengan user 
app.use('/v1/devices', devicesRoutes) // untuk menangani requeset yang berkaitan dengan device

// menangani request pada path '/'
app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '/index.html')); // mengirim response berupa file statik HTML
})

// menangani setiap request yang tidak didefinisikan
app.get('*', function (req, res) {
     res.status(404).redirect('/') // redirect ke path '/'
});

//mendefinisikan berjalannya server
app.listen(process.env.PORT, () => {
     console.log(`Server is running on port ${process.env.PORT}`)
})

// TIMER CODE FOR INTERVAL RECORDS //

//variabel untuk process records data dalam interval tertentu
var startRecord = false;
const timerStartDurationSeconds = 5 * 60; //process record berjalan setiap 5 menit 5 * 60 detik
const timerEndDurationSeconds = 1 * 60; //process record berlangsung selama 1 menit 1 * 60 detik
let timerStart = new Date().getTime(); // mendefinisikan waktu sekarang
let timerEnd = timerEndDurationSeconds // mendefinisikan timer berhenti

//variabel untuk proses Notifikasi Telegram pada jam tertentu apabila data tidak tersimpan atau terkirim
var timeMatching = new Date(Date.now()).toLocaleTimeString("id-ID").split('.') //memisahkan string waktu menjadi array [ jam , menit ,detik]
const checkTime = [9, 12, 15] //mendefinisikan array waktu program peringatan dijalankan [ 9 Pagi, 12 Siang , 15 Sore]
var checkIndex = initialIndeks();
var time //mendefinisikan waktu untuk process matching dengan checking time

function initialIndeks() {
     const hour = timeMatching[0];
     if (hour < 9 || hour >= 15) {
          return 0;
     } else if (hour >= 9 && hour < 12) {
          return 1;
     } else {
          return 2;
     }
}

//Fungsi yang berjalan setiap beberapa waktu tertentu untuk memulai prosess record data
setInterval(() => {
     startRecord = true //memulai proses record
     timerEnd = timerEndDurationSeconds / 10;
     timerStart = new Date().getTime();
}, timerStartDurationSeconds * 1000); //program berjalan menurut interval tertentu


//Fungsi yang berjalan setiap 10 detik
//untuk process timer record dan penentuan berjalannya program Notifikasi Telegram
setInterval(() => {
     // FUNGSI MEMULAI RECORD START
     time = new Date(Date.now()).toLocaleTimeString("id-ID").split('.')
     if (startRecord) {
          if (timerEnd <= 0) {
               startRecord = false
          } else {
               timerEnd--
          }
     }
     // FUNGSI MEMULAI RECORD END

     //FUNGSI MEMULAI NOTIFIKASI / PERINGATAN VIA TELEGRAM START
     //Program akan berjalan menurut waktu yang ditentukan +7 menit [8:07 ,12:07:15:07]
     //ambil list DEVICE dan END POINT (hanya device yang memiliki endpoint)
     if (time[0] == checkTime[checkIndex] && time[1] > 7) {
          var deviceData = [] //variabel penyimpan data device
          var endpoints = [] //variabel penyimpan data endpoint
          selectAllDevice = `SELECT devices.device_name, endpoints.bot_token, endpoints.chat_identifier 
          FROM devices INNER JOIN endpoints WHERE devices.device_name = endpoints.device_name`
          db.query(selectAllDevice, (err, fields) => {
               if (err) throw err
               fields.map(d => {
                    deviceData.push(d.device_name)
                    endpoints.push({
                         bot_token: d.bot_token,
                         chat_identifier: d.chat_identifier
                    })
               })
          })

          //AMBIL RECORD DATA ANTARA PUKUL 9:00 , 12:00, 15:00 hingga +7 menit (Hanya 1 record per device)
          selectRecordData = `SELECT DISTINCT device_name from records WHERE created_at > ${Date.now() - 480000}`
          db.query(selectRecordData, (err, fields) => {
               if (err) throw err
               // PENCOCOKAN DATA
               // mencocokan data record dengan data device
               // apabila data device tidak ada pada record maka akan mengirimkan notifikasi telegram
               deviceData.map(d => {
                    fields.includes(d) ? null :
                         sendNotificationBot(endpoints[deviceData.indexOf(d)].bot_token, endpoints[deviceData.indexOf(d)].chat_identifier, `ENMOS device did not record data at ${checkTime[checkIndex]} o'clock`)
                    checkIndex == 2 ? checkIndex = 0 : checkIndex++
               })
          })
     }
     //FUNGSI MEMULAI NOTIFIKASI / PERINGATAN VIA TELEGRAM START
}, 10000);


// MQTT PROTOCOL HANDLE START
const mqtt = require("mqtt");
const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`,
     {
          clean: true,
          connectTimeout: 5000,
          username: `${process.env.MQTT_USERNAME}`,
          password: `${process.env.MQTT_PASSWORD}`,
          reconnectPeriod: 1000,
     });
//CONNECT ke BROKER
client.on("connect", () => {
     client.subscribe("ENMOSV2/#", (err) => {
          if (!err) {
               client.publish("presence", "Hello mqtt");
          }
     });
});

// TOPIC HANDLER 
client.on("message", (topic, message) => {
     switch (topic) {
          case 'ENMOSV2/records': //menangani process RECORD
               if (startRecord) {
                    try {
                         var data = message.toString().split('#')
                         const sqlAdd = `
                         INSERT INTO records(${`device_name`},${`frequency`},${`humidity`},${`temperature`},${`voltage`}, ${`created_at`}) 
                         VALUES ('${data[0]}','${data[3]}','${data[4]}','${data[1]}','${data[2]}','${Date.now()}')
                         `
                         db.query(sqlAdd, (err) => {
                              if (err) throw err;
                         })
                    } catch (err) {
                         console.log(err)
                    }
               }
               break;
          case 'ENMOSV2/Warning': //menangani process WARNING via telegram apabila terjadi overload atau masalah 
               const mssg = message.toString().split('#')
               const getInfo = `SELECT * FROM endpoints WHERE device_name='${mssg[0]}'`
               try {
                    db.query(getInfo, (err, fields) => {
                         if (err) throw err
                         fields.length == 0 ? null :
                              sendNotificationBot(fields[0].bot_token, fields[0].chat_identifier, mssg[1])
                    })
               } catch (err) {
                    console.log(err)
               }
               break
     }
});

// MQTT PROTOCOL HANDLE END

//FUNGSI untuk mengirimkan notifikasi via telegram
const sendNotificationBot = async (botID, identifier, mssg) => {
     try {
          const response = await fetch(`https://api.telegram.org/bot${botID}/sendMessage?chat_id=${identifier}&text=${mssg}`)
     } catch (err) {
          console.log(err)
     }
}
