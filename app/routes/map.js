import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class MapRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel() {
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }
  }

  model() {
    // Provide initial map data
    return {
      lat: 44.9778, // Default latitude (Minneapolis)
      lng: -93.2650, // Default longitude
      zoom: 12, // Default zoom level
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.lat = model.lat;
    controller.lng = model.lng;
    controller.zoom = model.zoom;
  }
}
