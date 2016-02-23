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

import baseConstants from './constants/base';

import httpConfiguration from './configuration/http';
import overlayConfiguration from './configuration/overlay';
import stateConfiguration from './configuration/state';
import stateTransitionConfiguration from './configuration/state-transition';
import translateConfiguration from './configuration/translate';

import responseObserver from './services/response-observer';
import saltService from './services/salt';
import toastService from './services/toast';
import userService from './services/user';
import utilsService from './services/utils';
import wsseService from './services/wsse';
import wsseInterceptor from './services/wsse-interceptor';

import LoginController from './controllers/login';

import LocaleChangerComponent from './components/locale-changer';

const app = angular.module('akaunto', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate',
    'ngCookies',
    'bsLoadingOverlay'
]);

app.constant('baseConstants', baseConstants);
app.config(httpConfiguration);
app.config(stateConfiguration);
app.config(translateConfiguration);
app.run(overlayConfiguration);
app.run(stateTransitionConfiguration);
app.factory('responseObserver', responseObserver);
app.factory('saltService', saltService);
app.factory('toastService', toastService);
app.factory('userService', userService);
app.factory('utilsService', utilsService);
app.factory('wsseService', wsseService);
app.factory('wsseInterceptor', wsseInterceptor);
app.controller('LoginController', LoginController);
app.component('localeChanger', LocaleChangerComponent);

export default app;
