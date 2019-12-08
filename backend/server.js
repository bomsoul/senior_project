require("firebase/firestore");
require('firebase/storage');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
port = process.env.PORT || 4000;
var firebase = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyCKZ9nuvXsFzKVxjqC4MtxVcn3WNIRI3LQ",
    authDomain: "project-5dc4f.firebaseapp.com",
    databaseURL: "https://project-5dc4f.firebaseio.com",
    projectId: "project-5dc4f",
    storageBucket: "project-5dc4f.appspot.com",
    messagingSenderId: "843401202342",
    appId: "1:843401202342:web:9fd6b361bae46e42"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000/photo')
//   res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
//   return next()
// })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.get('/fetch', function (req, res) {
    var data = "{"
    db.collection('student').get().then((snapshot)=>{
        snapshot.forEach(doc => {
            data += '"'+doc.id + '":{\n' +
            '"name" :"' + doc.data().name +'",\n'+
            '"descriptors" : [['+doc.data().descriptors+ ']],\n' + 
            '"imageURL" :"' + doc.data().imageURL + '"\n},'
        });
        data = data.substring(0,data.length-1);
        data += "}";
        res.send(JSON.parse(data));
    });
});

app.post('/add' ,function(req,res){
    console.log(req.body);
    const {image} = req.body;
    const uploadTask = storage.ref('profile/'+image.name).put(image);
    uploadTask.on('state_changed',
    (snapshot) =>{

    },
    (error) => {
        console.log(error);
    },
    () => {
        storage.ref('profile').child(image.name).getDownloadURL().then(url =>{
            console.log("TEST")
            console.log(url);
            console.log(req.fullDesc);
            var urllink = url.toString();
            var data ={
                imageURL: urllink,
                name: req.name,
                stdId: req.stdId,
                descriptors: Array.from(req.fullDesc)
            }
            db.collection("student").doc().set(data).then(function() {
              console.log("Document successfully written!");
            //   alert("Add data Successful")
            //   this.props.history.push('/');
          });
        })
    });
})
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
