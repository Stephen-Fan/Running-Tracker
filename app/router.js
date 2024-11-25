import EmberRouter from '@ember/routing/router';
import config from 'project-2-20245117/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('specific-date-stats');
  this.route('create-new-plan');
  this.route('plans');
  this.route('map');
  this.route('saved-routes');
  this.route('weekly-monthly-stats');
});
