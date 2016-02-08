import angular from 'angular';
import app from './akaunto';

angular.element(document).ready(() => angular.bootstrap(document, [app.name]));
