/**
 * Interceptor on $http service for observing the responses.
 * @param {object} $q
 * @param {object} $injector
 * @return {{responseError: function}}
 */
function responseObserver($q, $injector) {
    const HTTP_FORBIDDEN = 403;

    return {
        responseError(errorResponse) {
            if (errorResponse.status === HTTP_FORBIDDEN) {
                const userService = $injector.get('userService');
                const $state = $injector.get('$state');
                userService.clearUserCredentials();
                $state.go('login');
            }
            return $q.reject(errorResponse);
        }
    };
}

responseObserver.$inject = ['$q', '$injector'];

export default responseObserver;
