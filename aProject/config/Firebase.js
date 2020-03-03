import firebase from 'firebase'
import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    MESSAGE_SENDER_ID,
    APP_ID
} from 'react-native-dotenv'
import 'firebase/firestore'
import {YellowBox} from 'react-native';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: '',
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
}

// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig)

// ... before export default statemen
export const db = firebase.firestore()

// avoid deprecated warnings, now defaults to true, so should not be called. timestampsnapchot will be removed in the future
// db.settings({
//     timestampsInSnapshots: true
// })
YellowBox.ignoreWarnings(['Setting a timer']);

export default Firebase