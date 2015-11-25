'use strict';

import angular from 'angular';
import app from './akaunto';

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name]);
});
