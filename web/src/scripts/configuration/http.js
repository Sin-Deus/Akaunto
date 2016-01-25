'use strict';

function httpConfiguration($httpProvider) {
    $httpProvider.interceptors.push('wsseInterceptor');
}

httpConfiguration.$inject = ['$httpProvider'];

export default httpConfiguration;
