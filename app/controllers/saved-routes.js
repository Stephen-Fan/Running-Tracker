import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SavedRoutesController extends Controller {
  @service firebase;
  @service router;

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
