import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CreateNewPlanController extends Controller {
  @service firebase;
  @service router;

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }

  @action
  goToPage() {
    this.router.transitionTo('calendar');
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const planName = formData.get('planName'); // what we store into db

    const newTime = formData.get('dateTime');
    const dateObject = new Date(newTime);
    const startTime = dateObject.getTime(); // what we store into db

    let distance = null; // what we store into db
    let duration = null; // what we store into db
    let planCat = null;

    if (formData.has('goalDistanceCheck')) {
      distance = formData.get('newDistance');
    }

    if (formData.has('planCat')) {
      planCat = formData.get('planCat');
    }
    distance = formData.get('newDistance');
    duration = formData.get('newTime');
    // if (formData.has('goalDistanceCheck')) {
    //   distance = formData.get('newDistance');
    // }
    // if (formData.has('goalTimeCheck')) {
    //   duration = formData.get('newTime');
    // }
    // if (!(formData.has('goalDistanceCheck') || formData.has('goalTimeCheck'))) {
    //   alert('Invalid Form. Please check at least one box.');
    //   return null;
    // }

    // let uid = (this.firebase.getCurrentUser()).uid
    // console.log(uid)
    this.firebase.addPlan(planName, startTime, distance, duration, planCat);
    this.goToPage();
    // alert('New plan added successfully!');
    // window.location.reload();
  }
}
