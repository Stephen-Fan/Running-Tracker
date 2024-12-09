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
    return new Promise((resolve, reject) => {
      // Check if Geolocation API is available
      if (!navigator.geolocation) {
        alert(
          'Geolocation is not supported by your browser. Default location will be used.',
        );
        resolve({
          lat: 37.733795,
          lng: -122.446747,
          zoom: 12, // Default zoom level
        });
        return;
      }

      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Resolve with the user's current location
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 12, // Default zoom level
          });
        },
        (error) => {
          // Handle geolocation errors
          console.error('Error fetching location:', error);

          // Inform the user and resolve with a default location
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              'Location sharing is required to fully use the map functionality. Default location will be used.',
            );
          } else {
            alert('Unable to fetch location. Default location will be used.');
          }

          resolve({
            lat: 37.733795,
            lng: -122.446747,
            zoom: 12, // Default zoom level
          });
        },
      );
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.lat = model.lat;
    controller.lng = model.lng;
    controller.zoom = model.zoom;
  }
}
