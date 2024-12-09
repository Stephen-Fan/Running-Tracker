import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PlansController extends Controller {
  @service firebase;
  @service router;
  @tracked editingPlan = null;

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
