import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default class MapComponent extends Component {
  @service firebase;
  @tracked map = null; // Google Maps instance
  @tracked markers = []; // Array to keep track of markers
  @tracked plans = [];
  @tracked selectedMarker = null; // Currently selected marker
  @tracked selectedPlanId = null; // ID of the selected plan
  @tracked showPlanWindow = false; // Control the visibility of the plan selection window
  @tracked selectedPlanName = null; // Name of the associated plan
  @tracked selectedLocationName = 'Unnamed Location';

  // Fetch plans from Firestore on initialization
  constructor() {
    super(...arguments);
    this.fetchPlans();
  }

  get isConfirmDisabled() {
    return !this.selectedPlanId; // Disable button if no plan is selected
  }

  @action
  selectPlan(event) {
    this.selectedPlanId = event.target.value;
  }

  @action
  async fetchPlans() {
    try {
      // Fetch plans from Firebase service
      const fetchedPlans = await this.firebase.fetchAllPlans();
      this.plans = fetchedPlans;
    } catch (error) {
      console.error('Error fetching plans in component:', error);
    }
  }

  @action
  setupMap(element) {
    // Initialize the map
    this.map = new google.maps.Map(element, {
      center: { lat: this.args.lat, lng: this.args.lng },
      zoom: this.args.zoom,
    });

    const input = document.getElementById('searchBox'); // Ensure this matches your template
    if (!input) {
      console.error('SearchBox input element not found.');
      return;
    }

    const searchBox = new google.maps.places.SearchBox(input);
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the search box to map bounds
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    // Handle search results
    searchBox.addListener('places_changed', async () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) {
        console.error('No places found.');
        return;
      }

      // Clear old markers
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      const user = this.firebase.getCurrentUser();
      const db = getFirestore();

      // Add a marker for each place and save to Firestore
      for (const place of places) {
        if (!place.geometry || !place.geometry.location) {
          console.error('Place has no geometry.');
          continue;
        }

        const marker = new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
          title: place.name,
        });

        this.markers.push(marker);
        this.attachMarkerClickListener(marker);

        // Save the marker to Firestore
        if (user) {
          try {
            const markersCollection = collection(
              db,
              `users/${user.uid}/markers`,
            );
            await addDoc(markersCollection, {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              title: place.name,
            });
            console.log('Marker saved to Firestore:', place.name);
          } catch (error) {
            console.error('Error saving marker to Firestore:', error);
          }
        }
      }

      // Adjust map view to fit search results
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });

    this.loadMarkers();

    // Add a marker when the user clicks on the map
    this.map.addListener('click', async (event) => {
      const marker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        title: 'Selected Location',
      });

      // Save the marker to Firestore
      const user = this.firebase.getCurrentUser();
      if (user) {
        try {
          const db = getFirestore();
          const markersCollection = collection(db, `users/${user.uid}/markers`);
          await addDoc(markersCollection, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            title: 'Selected Location',
          });
          console.log('Marker saved to Firestore:', marker);
        } catch (error) {
          console.error('Error saving marker to Firestore:', error);
        }
      }

      // Add marker to the local array and attach a click listener
      this.markers.push(marker);
      this.attachMarkerClickListener(marker);
    });

    const clearMarkersButton = document.getElementById('clearMarkersButton');
    if (clearMarkersButton) {
      clearMarkersButton.addEventListener('click', () => {
        this.clearAllMarkers();
      });
    }
  }

  @action
  async loadMarkers() {
    const db = getFirestore();
    const user = this.firebase.getCurrentUser();

    if (user) {
      try {
        const markersCollection = collection(db, `users/${user.uid}/markers`);
        const snapshot = await getDocs(markersCollection);

        // Render each marker on the map
        snapshot.docs.forEach((doc) => {
          const markerData = doc.data();
          const marker = new google.maps.Marker({
            map: this.map,
            position: { lat: markerData.lat, lng: markerData.lng },
            title: markerData.title || 'No Title',
          });

          // Add marker to the local array and attach a click listener
          this.markers.push(marker);
          this.attachMarkerClickListener(marker);
        });

        console.log('Markers loaded from Firestore:', this.markers);
      } catch (error) {
        console.error('Error loading markers from Firestore:', error);
      }
    }
  }

  @action
  async attachMarkerClickListener(marker) {
    marker.addListener('click', async () => {
      console.log('Clicked on marker:', marker);
      this.selectedMarker = marker;

      // Update the location name dynamically
      this.selectedLocationName = marker.getTitle() || 'Unnamed Location';

      // Attempt to find the associated plan
      this.selectedPlanId = await this.getAssociatedPlanId(marker);
      console.log('Associated Plan ID:', this.selectedPlanId);

      // Show the plan selection window
      this.showPlanWindow = true;
    });
  }

  @action
  async deleteMarker() {
    if (!this.selectedMarker) {
      console.error('No marker selected for deletion.');
      return;
    }

    const user = this.firebase.getCurrentUser();

    if (user) {
      try {
        const db = getFirestore();
        const markersCollection = collection(db, `users/${user.uid}/markers`);

        // Find the Firestore document for this marker by matching lat/lng
        const snapshot = await getDocs(markersCollection);
        const markerDoc = snapshot.docs.find((doc) => {
          const data = doc.data();
          return (
            data.lat === this.selectedMarker.getPosition().lat() &&
            data.lng === this.selectedMarker.getPosition().lng()
          );
        });

        if (markerDoc) {
          // Delete the marker document from Firestore
          await deleteDoc(doc(db, `users/${user.uid}/markers`, markerDoc.id));
          console.log('Marker deleted from Firestore:', markerDoc.id);
        }

        if (this.selectedPlanId) {
          await this.firebase.resetPlanLocation(user.uid, this.selectedPlanId);
          console.log(`Plan ${this.selectedPlanId} location reset.`);
        }

        // Remove the marker from the map and local state
        this.selectedMarker.setMap(null);
        this.markers = this.markers.filter(
          (marker) => marker !== this.selectedMarker,
        );

        this.selectedMarker = null;
        this.selectedPlanId = null;
        this.showPlanWindow = false;

        console.log('Marker deleted successfully.');
      } catch (error) {
        console.error('Error deleting marker:', error);
      }
    }
  }

  @action
  async getAssociatedPlanId(marker) {
    const user = this.firebase.getCurrentUser();
    const db = getFirestore();
    if (user) {
      try {
        const plansCollection = collection(db, `users/${user.uid}/plans`);
        const snapshot = await getDocs(plansCollection);

        // Iterate through all plans to find a matching marker
        for (const doc of snapshot.docs) {
          const plan = doc.data();
          if (
            plan.location &&
            plan.location.lat === marker.getPosition().lat() &&
            plan.location.lng === marker.getPosition().lng()
          ) {
            this.selectedPlanName = plan.planName;
            return doc.id; // Return the ID of the matching plan
          }
        }

        this.selectedPlanName = null;
        return null; // No associated plan found
      } catch (error) {
        console.error('Error finding associated plan:', error);
        throw error; // Re-throw the error for the caller to handle
      }
    }
  }

  @action
  async clearAllMarkers() {
    const user = this.firebase.getCurrentUser();

    if (user) {
      try {
        // Reset all plan locations
        await this.firebase.resetAllPlanLocations(user.uid);

        // Remove all markers from the map
        this.markers.forEach((marker) => marker.setMap(null));
        this.markers = []; // Clear the markers array
        console.log('All markers cleared and plan locations reset.');
      } catch (error) {
        console.error('Error resetting plan locations:', error);
      }
    } else {
      console.error('User not authenticated. Cannot clear markers.');
    }
  }

  @action
  async confirmPlanSelection() {
    // console.log('Selected Marker:', this.selectedMarker);
    // console.log('Selected Plan ID:', this.selectedPlanId);
    if (!this.selectedMarker || !this.selectedPlanId) {
      console.error('Marker or selected plan is missing.');
      return;
    }

    const location = {
      lat: this.selectedMarker.getPosition().lat(),
      lng: this.selectedMarker.getPosition().lng(),
      name: this.selectedMarker.getTitle() || 'Unnamed Location',
    };

    try {
      // Call the Firebase service to update the plan location
      await this.firebase.updatePlanLocation(this.selectedPlanId, location);

      // Update the local state of plans to reflect the new association
      this.plans = this.plans.map((plan) => {
        if (plan.id === this.selectedPlanId) {
          return { ...plan, location }; // Update the associated plan's location
        }
        return plan;
      });

      // this.plans = updatedPlans;

      // Reset selection and close the window
      this.selectedMarker = null;
      this.selectedPlanId = null;
      this.showPlanWindow = false;
    } catch (error) {
      console.error('Error updating plan location:', error);
    }
  }

  @action
  closePlanWindow() {
    this.showPlanWindow = false;
    this.selectedMarker = null;
    this.selectedPlanId = null;
    this.selectedPlanName = null;
    this.selectedLocationName = 'Unamed Location';
  }
}
