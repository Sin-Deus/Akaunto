import angular from 'angular';

import baseConstants from './constants/base';

import httpConfiguration from './configuration/http';

import saltService from './services/salt';
import userService from './services/user';
import wsseService from './services/wsse';
import wsseInterceptor from './services/wsse-interceptor';

const app = angular.module('akaunto', []);

app.constant('baseConstants', baseConstants);
app.config(httpConfiguration);
app.factory('saltService', saltService);
app.factory('userService', userService);
app.factory('wsseService', wsseService);
app.factory('wsseInterceptor', wsseInterceptor);

export default app;
