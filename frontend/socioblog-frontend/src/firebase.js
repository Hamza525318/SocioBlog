import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDHcWyJITcbDLnOAbTaU5SDqiSDYkW23qY",
    authDomain: "socioblog-chat.firebaseapp.com",
    projectId: "socioblog-chat",
    storageBucket: "socioblog-chat.appspot.com",
    messagingSenderId: "509728909138",
    appId: "1:509728909138:web:a7c0129a149d02d6b13c8b",
    measurementId: "G-D1W2QVZCVP"
};

const app = initializeApp(firebaseConfig);
const db =  getFirestore(app);

export default db;