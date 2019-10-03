import Firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCbnnHyX4Jgca81LLBSM9EHavDbqYgWPW4",
    authDomain: "gtudevops.firebaseapp.com",
    databaseURL: "https://gtudevops.firebaseio.com",
    projectId: "gtudevops",
    storageBucket: "gtudevops.appspot.com",
    messagingSenderId: "105031711106"
  };

Firebase.initializeApp(config);
Firebase.auth().languageCode = 'tr_TR';

export default Firebase;

export const Firestore = Firebase.firestore();