// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCtXgLZ5HLqIZA8McLR27IVLl_ScBItp2g',
  authDomain: 'cftrade-94480.firebaseapp.com',
  databaseURL: 'https://cftrade-94480.firebaseio.com',
  projectId: 'cftrade-94480',
  storageBucket: 'cftrade-94480.appspot.com',
  messagingSenderId: '586100957061',
  appId: '1:586100957061:web:8a874f4019858e8768aeec',
  measurementId: 'G-DR6HQD5SM3'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export const thisFire = firebase.analytics()
