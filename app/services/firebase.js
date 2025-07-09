import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
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
import { start } from 'qunit';

export default class FirebaseService extends Service {
  // @tracked currentUser = null;

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

  async fetchAllPlans() {
    const user = this.getCurrentUser();

    try {
      const plansCollection = collection(this.db, `users/${user.uid}/plans`);
      const snapshot = await getDocs(plansCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  }

  async fetchAllPlansComplete() {
    await this.authReady;
    const user = this.getCurrentUser();
    if (!user) {
      console.error('User not authenticated. Cannot fetch plans.');
      return [];
    }
  
    try {
      const plansCollection = collection(this.db, `users/${user.uid}/plans`);
      const snapshot = await getDocs(plansCollection);
      const current = Date.now();
  
      const planArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const validPlan = planArray.filter((plan) => {
        const startTime = plan.startTime;
        const duration = plan.duration || 0;

        const startTimeMillis =
          typeof startTime === 'object' && startTime.toMillis
            ? startTime.toMillis()
            : startTime;

        const endTime = startTimeMillis + duration * 60000;
        return endTime > current && plan.planCat === 'Completed';
      });
      return validPlan;

    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  }

  async addPlan(planName, startTime, distance, duration, planCat) {
    const user = this.getCurrentUser();

    if (user) {
      try {
        const currentTime = new Date();
        const planStartTime = new Date(startTime); // Ensure startTime is a Date object
        const calculatedPlanCat = planStartTime < currentTime ? 'Absent' : 'Scheduled';
        
        const docRef = await addDoc(
          collection(this.db, `users/${user.uid}/plans`),
          {
            planName: planName,
            startTime: startTime,
            distance: distance,
            duration: duration,
            location: null,
            planCat: calculatedPlanCat,
          },
        );
        console.log('Document written with ID: ', docRef.id);
        window.location.reload();
        return docRef.id;
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else {
      throw new Error('No authenticated user found');
    }
  }

  async updatePlanLocation(planId, location) {
    const user = this.getCurrentUser();

    if (user) {
      try {
        // Reference the specific plan document
        const planDocRef = doc(this.db, `users/${user.uid}/plans`, planId);

        // Update the location field
        await updateDoc(planDocRef, { location });

        console.log('Plan location updated successfully:', location);
      } catch (error) {
        console.error('Error updating plan location:', error);
        throw error; // Re-throw the error to handle it in the caller
      }
    }
  }

  async resetAllPlanLocations(userId) {
    const user = this.getCurrentUser();

    if (user) {
      try {
        // Reference the plans collection
        const plansCollection = collection(this.db, `users/${userId}/plans`);
        const snapshot = await getDocs(plansCollection);

        // Iterate through all plans and reset their location attribute
        const resetPromises = snapshot.docs.map((planDoc) => {
          const planRef = doc(this.db, `users/${userId}/plans`, planDoc.id);
          return updateDoc(planRef, { location: null });
        });

        await Promise.all(resetPromises); // Wait for all updates to complete

        const markersCollection = collection(
          this.db,
          `users/${userId}/markers`,
        );
        const markersSnapshot = await getDocs(markersCollection);
        const deletePromises = markersSnapshot.docs.map((markerDoc) => {
          const markerRef = doc(
            this.db,
            `users/${userId}/markers`,
            markerDoc.id,
          );
          return deleteDoc(markerRef);
        });
        await Promise.all(deletePromises);

        console.log('All plan locations reset.');
      } catch (error) {
        console.error('Error resetting all plan locations:', error);
        throw error; // Re-throw the error to handle it in the caller
      }
    }
  }

  async resetPlanLocation(userId, planId) {
    const user = this.getCurrentUser();

    if (user) {
      try {
        const planDocRef = doc(this.db, `users/${userId}/plans`, planId); // Adjust the path if plans are stored under a user-specific path

        // Update the location field to reset its values
        await updateDoc(planDocRef, {
          location: null,
        });

        console.log(`Plan ${planId} location reset.`);
      } catch (error) {
        console.error(`Error resetting location for plan ${planId}:`, error);
        throw error; // Re-throw the error for the caller to handle
      }
    }
  }

  getPlanDocRef(userId, planId) {
    return doc(this.db, `users/${userId}/plans`, planId);
  }
}
