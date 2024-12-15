import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PlansRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel() {
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }
  }

  async model() {
    // Fetch all plans from Firestore
    return await this.firebase.fetchAllPlans();
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.startAutoCheck();
  }
  
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.stopAutoCheck(); // Stop auto-check when leaving the page
    }
  }  
}
