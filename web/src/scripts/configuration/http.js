/**
 * Configuration for the $http service.
 * @param {object} $httpProvider
 */
function httpConfiguration($httpProvider) {
    $httpProvider.interceptors.push('wsseInterceptor');
    $httpProvider.interceptors.push('responseObserver');
}

httpConfiguration.$inject = ['$httpProvider'];

export default httpConfiguration;
