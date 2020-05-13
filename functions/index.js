const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const app = express();
// app.set('views' , './views');
app.set('view engine' , 'ejs');

const firebaseApp = firebase.initializeApp(
     functions.config().firebase
);
const db = firebase.firestore();
app.get('/' , function(request , response){
     const {date, author , title, username} = request.query;
     var now = Date.now();
     if(now - date <=3*24*60*60*1000){
          
          var userDetails = {
               user : username,
               status : false
          }
          db.collection('books')
          .where("author" , "==" , author)
          .where("title" , "==" , title)
          .get()
          .then(res=>{
               var arr;
               res.docs.map(doc=>{
                    var docData = doc.data();
                    db.collection("books")
                    .doc(doc.id)
                    .update({
                         users : firebase.firestore.FieldValue.arrayRemove(userDetails)
                    });
                    arr = docData.users;
               })
               response.render('success' , {qs : request.query});
               // response.json(arr);
          }).catch(err=>{
               response.send(`<center>${err.toString()}</center>`);
          });
          
     }else{
          response.render('expired', {qs : request.query});
     }
     
});
exports.app = functions.https.onRequest(app);