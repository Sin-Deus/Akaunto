/**
 * Interceptor on $http service for observing the responses.
 * @param {object} $q
 * @param {object} $injector
 * @param {object} httpStatusCodes
 * @return {{responseError: function}}
 */
function responseObserver($q, $injector, httpStatusCodes) {
    return {
        responseError(errorResponse) {
            if (errorResponse.status === httpStatusCodes.UNAUTHORIZED) {
                const authenticationService = $injector.get('authenticationService');
                const utilsService = $injector.get('utilsService');
                const $state = $injector.get('$state');
                authenticationService.clearToken();
                $state.go('login');
                utilsService.stopLoading();
            }
            return $q.reject(errorResponse);
        }
    };
}

responseObserver.$inject = ['$q', '$injector', 'httpStatusCodes'];

export default responseObserver;
