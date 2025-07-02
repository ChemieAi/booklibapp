// firebase.js
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBiRZ1m5vjoOfdNrT2xwh5afcnvRpNwg0U",
  authDomain: "booklibapp.firebaseapp.com",
  projectId: "booklibapp",
  storageBucket: "booklibapp.appspot.com",
  messagingSenderId: "54186310472",
  appId: "1:54186310472:android:a0e378a14209ba7dd7517d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
