import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { updateDoc } from 'firebase/firestore';

export default class EditController extends Controller {
  @service router;
  @service firebase;

  @action
  goToPage() {
    this.router.transitionTo('plans');
  }

  @action
  async saveChanges(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Validation for Distance
    if (formData.get('goalDistanceCheck') && !formData.get('newDistance')) {
      alert('Please enter a valid distance.');
      return;
    }

    // Validation for Duration
    if (formData.get('goalTimeCheck') && !formData.get('newTime')) {
      alert('Please enter a valid duration.');
      return;
    }

    // Extract values from the form
    const updatedPlan = {
      planName: formData.get('planName'),
      startTime: new Date(formData.get('dateTime')).getTime(),
      distance: formData.get('newDistance'),
      duration: formData.get('newTime'),
    };

    const user = this.firebase.getCurrentUser();

    // const confirmation = window.confirm('Ready to save this plan?');
    // if (!confirmation) {
    //   return; // Exit if the user cancels
    // }

    if (user) {
      try {
        const db = this.firebase.db;
        const planDocRef = this.firebase.getPlanDocRef(user.uid, this.model.id);

        // Update the plan in Firestore
        await updateDoc(planDocRef, updatedPlan);
        this.goToPage();
        console.log('Plan updated successfully:', updatedPlan);
        this.router.transitionTo('plans'); // Redirect back to the plans page
      } catch (error) {
        console.error('Error updating plan:', error);
      }
    }
  }
}
