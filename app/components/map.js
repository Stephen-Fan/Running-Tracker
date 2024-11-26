import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MapComponent extends Component {
  map = null; // Google Maps instance
  markers = []; // Array to keep track of markers

  @action
  setupMap(element) {
    // Initialize the map
    this.map = new google.maps.Map(element, {
      center: { lat: this.args.lat, lng: this.args.lng },
      zoom: this.args.zoom,
    });

    // Get the input element for the search box
    const input = document.getElementById('searchBox');
    if (!input) {
      console.error('SearchBox input element not found.');
      return;
    }

    // Ensure the Places library is loaded
    if (!google.maps.places || !google.maps.places.SearchBox) {
      console.error('Google Places library is not loaded.');
      return;
    }

    // Create the SearchBox object
    const searchBox = new google.maps.places.SearchBox(input);

    // Link the SearchBox to the map's bounds
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    // Listen for the 'places_changed' event
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) {
        console.error('No places found.');
        return;
      }

      // Clear old markers
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      // Add new markers and adjust the viewport
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.error('Place has no geometry.');
          return;
        }

        const marker = new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
          title: place.name,
          // icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });

        this.markers.push(marker);

        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(15);
        }
      });
    });

    // Add a marker when the user clicks on the map
    this.map.addListener('click', (event) => {
      if (event.placeId) {
        console.log('Clicked on a map feature or existing marker. No new marker added.');
        return; // Do not create a new marker
      }
      const marker = new google.maps.Marker({
        position: event.latLng, // Get the clicked LatLng
        map: this.map,
      });

      this.markers.push(marker); // Add marker to the markers array
      console.log('Marker added:', marker.getPosition().toString());
    });

    // Add a button to clear all markers
    const clearMarkersButton = document.getElementById('clearMarkersButton');
    if (clearMarkersButton) {
      clearMarkersButton.addEventListener('click', () => {
        this.clearAllMarkers();
      });
    }
  }

  @action
  clearAllMarkers() {
    this.markers.forEach((marker) => marker.setMap(null)); // Remove all markers
    this.markers = []; // Clear the markers array
    console.log('All markers cleared.');
  }

}
