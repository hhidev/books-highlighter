import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/auth';
import { firebaseConfig } from './config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const storage = firebaseApp.storage();
export const functions = firebaseApp.functions();
export const auth = firebaseApp.auth();
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
