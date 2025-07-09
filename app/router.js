import EmberRouter from '@ember/routing/router';
import config from 'project-2-20245117/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('specific-date-stats', { path: '/stats-on-date' });
  this.route('create-new-plan');
  this.route('plans');
  this.route('map');
  this.route('weekly-monthly-stats');
  this.route('calendar');
  this.route('edit', { path: '/plans/edit/:plan_id' });
});
