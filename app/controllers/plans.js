import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default class PlansController extends Controller {
  @service firebase;
  @service router;
  // @tracked editingPlan = null;

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }

  @action
  async deletePlan(planId) {
    const user = this.firebase.getCurrentUser();

    const confirmation = window.confirm("Are you sure you want to delete this plan?");
    if (!confirmation) {
      return; // Exit if the user cancels
    }

    if (user) {
      try {
        // Reference the specific plan document
        const db = this.firebase.db;
        const planDocRef = doc(db, `users/${user.uid}/plans`, planId);

        // Delete the plan document
        await deleteDoc(planDocRef);

        // Update the UI by refreshing the model
        this.refreshModel(); // Custom method to reload the data
        console.log(`Plan ${planId} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting plan ${planId}:`, error);
      }
    }
  }

  @action
  async refreshModel() {
    const plans = await this.firebase.fetchAllPlans();
    this.set('model', plans); // Update the model with the latest data
  }


}
