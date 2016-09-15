/**
 * Interceptor on $http service for injecting the JWT.
 * @param {object} $injector
 * @return {{request: function}}
 */
function jwtInterceptor($injector) {
    const JWT_HEADER = 'x-access-token';

    return {
        request(config) {
            const authenticationService = $injector.get('authenticationService');
            config.headers[JWT_HEADER] = authenticationService.getToken();
            return config;
        }
    };
}

jwtInterceptor.$inject = ['$injector'];

export default jwtInterceptor;
