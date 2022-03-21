import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABe8Lj2iXavrUyWdyLy35vHh943iyqIaY',
  authDomain: 'tinnitus-e18b6.firebaseapp.com',
  projectId: 'tinnitus-e18b6',
  storageBucket: 'tinnitus-e18b6.appspot.com',
  messagingSenderId: '804755813576',
  appId: '1:804755813576:web:66745a3ceb016941ec61fd',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
