import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAu7DxF5dhvKHhhvnN6MwBsaCUtRuATxQg",
  authDomain: "meucfsd.firebaseapp.com",
  projectId: "meucfsd",
  storageBucket: "meucfsd.appspot.com",
  messagingSenderId: "603243637588",
  appId: "1:603243637588:web:e84c950e01ca7b572776c1",
  measurementId: "G-50JWB5FZL8"
};

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage};