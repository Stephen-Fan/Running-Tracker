import Service, { service } from '@ember/service';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  writeBatch,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export default class FirebaseService extends Service {
  @service firebase;

  constructor() {
    super(...arguments);

    const firebaseConfig = {
      apiKey: 'AIzaSyBA5j9IlyfRSDzNMqOkR6Jh-Cu1ezPurkA',
      authDomain: 'project2-f4147.firebaseapp.com',
      projectId: 'project2-f4147',
      storageBucket: 'project2-f4147.firebasestorage.app',
      messagingSenderId: '1009472379533',
      appId: '1:1009472379533:web:7d80946a40e937612e20c4',
    };

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);

    this.authReady = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        resolve(user);
      });
    });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async isAuthenticated() {
    await this.authReady;
    return this.auth.currentUser !== null;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.currentUser = result.user;
      await this.checkForCurrentUserDocument();
      return result.user;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  }

  async checkForCurrentUserDocument() {
    const user = this.getCurrentUser();

    if (user) {
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date(),
        });
        console.log(`User document created for: ${user.uid}`);
      }
    } else {
      throw new Error('No authenticated user found');
    }
  }

  async logout() {
    return signOut(this.auth);
  }
}
