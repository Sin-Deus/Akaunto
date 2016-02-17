import angular from 'angular';
import 'angular-ui-router';
import 'angular-material';
import 'angular-messages';
import 'angular-translate';
import 'angular-translate-loader-static-files';

import baseConstants from './constants/base';

import translateConfiguration from './configuration/translate';
import httpConfiguration from './configuration/http';
import stateConfiguration from './configuration/state';

import saltService from './services/salt';
import userService from './services/user';
import wsseService from './services/wsse';
import wsseInterceptor from './services/wsse-interceptor';
import responseObserver from './services/response-observer';

import loginController from './controllers/login';

const app = angular.module('akaunto', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate'
]);

app.constant('baseConstants', baseConstants);
app.config(translateConfiguration);
app.config(httpConfiguration);
app.config(stateConfiguration);
app.factory('saltService', saltService);
app.factory('userService', userService);
app.factory('wsseService', wsseService);
app.factory('wsseInterceptor', wsseInterceptor);
app.factory('responseObserver', responseObserver);
app.controller('LoginController', loginController);

export default app;
