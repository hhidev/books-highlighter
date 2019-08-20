import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { firebaseConfig } from './config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const storage = firebaseApp.storage();
