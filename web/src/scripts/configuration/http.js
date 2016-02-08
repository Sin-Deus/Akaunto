/**
 * Configuration for the $http service.
 * @param {object} $httpProvider
 */
function httpConfiguration($httpProvider) {
    $httpProvider.interceptors.push('wsseInterceptor');
}

httpConfiguration.$inject = ['$httpProvider'];

export default httpConfiguration;
