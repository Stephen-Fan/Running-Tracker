import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default class PlansController extends Controller {
  @service firebase;
  @service router;
  @tracked autoCheckInterval = null;

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }

  @action
  editPlan(planId) {
    this.router.transitionTo('edit', planId);
  }

  @action
  async deletePlan(planId) {
    const user = this.firebase.getCurrentUser();

    const confirmation = window.confirm(
      'Are you sure you want to delete this plan?',
    );
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
  async completePlan(planId) {
    const user = this.firebase.getCurrentUser();
  
    if (user) {
      try {
        const db = this.firebase.db;
  
        // Reference the specific plan document
        const planDocRef = doc(db, `users/${user.uid}/plans`, planId);
  
        // Update the plan's planCat to "completed"
        await updateDoc(planDocRef, { planCat: "Completed" });
  
        console.log(`Plan ${planId} marked as completed.`);
        this.refreshModel(); // Refresh the model to update the UI
      } catch (error) {
        console.error(`Error marking plan ${planId} as completed:`, error);
      }
    }
  }  

  @action
  async refreshModel() {
    const plans = await this.firebase.fetchAllPlans();
    this.set('model', plans); // Update the model with the latest data
  }

  @action
  startAutoCheck() {
    if (this.autoCheckInterval) {
      return; // Auto-check is already running
    }

    this.autoCheckInterval = setInterval(async () => {
      const user = this.firebase.getCurrentUser();
      if (!user) {
        return;
      }

      const currentTime = new Date();

      // Iterate through all plans
      for (const plan of this.model) {
        if (plan.planCat === 'Scheduled') {
          const endTime = new Date(plan.startTime.seconds * 1000);
          if (plan.duration) {
            endTime.setMinutes(endTime.getMinutes() + plan.duration); // Add duration to startTime
          }

          if (currentTime > endTime) {
            try {
              const db = this.firebase.db;
              const planDocRef = doc(db, `users/${user.uid}/plans`, plan.id);

              // Mark the plan as absent
              await updateDoc(planDocRef, { planCat: 'Absent' });
              console.log(`Plan ${plan.id} marked as absent due to expired time.`);
              this.refreshModel(); // Refresh the model to update the UI
            } catch (error) {
              console.error(`Error marking plan ${plan.id} as absent:`, error);
            }
          }
        }
      }
    }, 60000); // Check every minute
  }

  @action
  stopAutoCheck() {
    if (this.autoCheckInterval) {
      clearInterval(this.autoCheckInterval);
      this.autoCheckInterval = null;
      console.log('Auto-check stopped.');
    }
  }

}
