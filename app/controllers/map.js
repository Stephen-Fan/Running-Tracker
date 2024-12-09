import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MapController extends Controller {
  @service firebase;
  @service router;
  @tracked lat = 37.733795;
  @tracked lng = -122.446747;
  @tracked zoom = 12; // Default zoom level

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
