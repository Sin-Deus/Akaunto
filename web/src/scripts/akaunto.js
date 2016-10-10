import angular from 'angular';
import 'angular-ui-router';
import 'angular-material';
import 'angular-messages';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'angular-cookies';
import 'angular-loading-overlay';
import 'angular-validation-match';
import 'moment';
import 'moment/locale/fr';
import 'angular-moment';

import baseConstants from './constants/base';

import httpConfiguration from './configuration/http';
import momentConfiguration from './configuration/moment';
import overlayConfiguration from './configuration/overlay';
import stateConfiguration from './configuration/state';
import stateTransitionConfiguration from './configuration/state-transition';
import translateConfiguration from './configuration/translate';

import responseObserver from './services/response-observer';
import authenticationService from './services/authentication';
import toastService from './services/toast';
import userService from './services/user';
import accountService from './services/account';
import utilsService from './services/utils';
import jwtInterceptor from './services/jwt-interceptor';
import lodashWrapper from './services/lodash';

import LoginController from './controllers/login';
import HomeController from './controllers/home';
import UserController from './controllers/user';

import AkHeaderComponent from './components/ak-header';

const app = angular.module('akaunto', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate',
    'ngCookies',
    'bsLoadingOverlay',
    'validation.match',
    'angularMoment'
]);

app.constant('baseConstants', baseConstants);
app.config(httpConfiguration);
app.config(stateConfiguration);
app.config(translateConfiguration);
app.run(momentConfiguration);
app.run(overlayConfiguration);
app.run(stateTransitionConfiguration);
app.factory('accountService', accountService);
app.factory('responseObserver', responseObserver);
app.factory('toastService', toastService);
app.factory('userService', userService);
app.factory('utilsService', utilsService);
app.factory('authenticationService', authenticationService);
app.factory('jwtInterceptor', jwtInterceptor);
app.factory('_', lodashWrapper);
app.controller('LoginController', LoginController);
app.controller('HomeController', HomeController);
app.controller('UserController', UserController);
app.component('akHeader', AkHeaderComponent);

export default app;
