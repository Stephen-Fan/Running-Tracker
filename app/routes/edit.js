import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getDoc } from 'firebase/firestore';

export default class EditRoute extends Route {
  @service firebase;

  async model(params) {
    const user = this.firebase.getCurrentUser();
    if (user) {
      try {
        const planDocRef = this.firebase.getPlanDocRef(
          user.uid,
          params.plan_id,
        );
        const planSnapshot = await getDoc(planDocRef);

        if (planSnapshot.exists()) {
          const data = planSnapshot.data();

          // Ensure startTime exists and is valid
          return {
            id: params.plan_id,
            planName: data.planName || 'Unnamed Plan',
            startTime: data.startTime || null, // Handle missing startTime
            distance: data.distance || 0,
            duration: data.duration || 0,
            location: data.location || null,
          };
        } else {
          console.error('Plan not found.');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
      }
    }
    return null;
  }
}
