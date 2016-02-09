import angular from 'angular';
import 'angular-ui-router';

import baseConstants from './constants/base';

import httpConfiguration from './configuration/http';
import stateConfiguration from './configuration/state';

import saltService from './services/salt';
import userService from './services/user';
import wsseService from './services/wsse';
import wsseInterceptor from './services/wsse-interceptor';
import responseObserver from './services/response-observer';

import loginController from './controllers/login';

const app = angular.module('akaunto', ['ui.router']);

app.constant('baseConstants', baseConstants);
app.config(httpConfiguration);
app.config(stateConfiguration);
app.factory('saltService', saltService);
app.factory('userService', userService);
app.factory('wsseService', wsseService);
app.factory('wsseInterceptor', wsseInterceptor);
app.factory('responseObserver', responseObserver);
app.controller('LoginController', loginController);

export default app;
