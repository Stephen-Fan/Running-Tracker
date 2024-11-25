import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel() {
    const auth = this.firebase.auth;

    if (auth.currentUser) {
      this.router.transitionTo('calendar');
    }
  }
}
