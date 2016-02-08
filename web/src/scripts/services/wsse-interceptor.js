/**
 * Interceptor on $http service for injecting the WSSE token.
 * @param {object} $injector
 * @return {{request: function}}
 */
function wsseInterceptor($injector) {
    return {
        request(config) {
            const wsseService = $injector.get('wsseService');
            const userService = $injector.get('userService');
            const { name, password } = userService.getUserCredentials();
            config.headers['x-wsse'] = wsseService.getWSSEHeader(name, password);
            return config;
        }
    };
}

wsseInterceptor.$inject = ['$injector'];

export default wsseInterceptor;
