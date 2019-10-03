const express = require('express');
const path = require('path');

const firebase = require('firebase');
require('firebase/firestore')
const config = {
    apiKey: "AIzaSyCbnnHyX4Jgca81LLBSM9EHavDbqYgWPW4",
    authDomain: "gtudevops.firebaseapp.com",
    databaseURL: "https://gtudevops.firebaseio.com",
    projectId: "gtudevops",
    storageBucket: "gtudevops.appspot.com",
    messagingSenderId: "105031711106"
  };
  firebase.initializeApp(config);
const db = firebase.firestore();

const React = require('react');
const ReactDOMServer = require('react-dom/server');

/**
 * Github API Area
 */
const github = require('octonode');
const client = github.client('7479333355a1b7012a1a3a0a4ae9e07f2b2f4efd');
const gitOrg = client.org('Denesene');

client.get('/user', {}, function (err, status, body, headers) {
  //console.log(body); //json object
});

function callback (err, status, body, headers) {
  console.log(err); //json object
  console.log(status); //json object
  console.table(body); //json object
  console.log(headers); //json object
};
 
/**
 * Express Server Area
 */
const PORT = 3000;
const app = express();


/**
 * API for cards
 */
app.put('/projects/:project/:listDestination/:card', function(request, response) {
    console.log(request.params);

    const project   = request.params.project;
    const card      = request.params.card;

    /**
     *  Hedef ve kaynak listelerini seçiyoruz.
     */
    const listDestination = request.params.listDestination;
    let listSource;

    /**
     * Kaynak listeyi belirleyeceğiz.
     */
    if (listDestination == "test") {
        listSource = "build";
    } else if (listDestination == "deploy") {
        listSource = "test";
    } else if (listDestination == "done") {
        listSource = "deploy";
    }
    
    let result = moveCard(project, listSource, listDestination, card);
    response.send(result);
    
});

app.delete('/projects/:project/:listSource/:card', function(request, response) {
    console.log(request.params);

    const project   = request.params.project;
    const card      = request.params.card;

    /**
     *  Hedef ve kaynak listelerini seçiyoruz.
     */
    const listSource = request.params.listSource;
    const listDestination = "doing";
    
    let result = moveCard(project, listSource, listDestination, card);
    response.send(result);
});


/**
 * Static files
 */
app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(express.static(path.join(__dirname, "build")));

app.listen(PORT, function() {
    console.log("http//localhost:" + PORT);
})

/**
 * Function move card
 */

 function moveCard(project, listSource, listDestination, card) {

     /**
     * Kartın verilerini alıyoruz.
     */
    const projectRef = db.collection("projects").doc(project);
    projectRef.collection(listSource).doc(card)
    .get()
    .then(doc => {

        /**
         * Database'de kayıtlı card varsa üzerinde işlem yapacağız.
         */
        if (doc.exists) {
            console.log("Document data:", doc.data());

            /**
             * Önce kartı siliyoruz
             */
            projectRef.collection(listSource).doc(card)
            .delete()
            .then(() => {

                /**
                 * Silinen kart yeni listesine ekleniyor.
                 */
                projectRef.collection(listDestination).doc(card)
                .set({ content: doc.data().content })
                .then(() => {

                    console.log("İşlem başarılı!");
                    return {success: true}

                })
                .catch(error => {

                    /**
                     * Sildiğimiz kart taşınma sırasında hata verirse eski yerine yerleştiriyoruz.
                     */
                    projectRef.collection(listSource).doc(card)
                    .set()
                    .then(() => {
                        console.log("Kart taşınamadığı için geri yüklendi!");
                        
                    })
                    .catch(error => {

                    });
                });
            })
            .catch(error => {
                
            })

        } else {
            console.log("No such document!");
            response.send({ success: false, error: "No such document!" });
        }
    }).catch(error => {
        console.log("Error getting document:", error);
        response.send({ success: false, error: error });
    });
 }
