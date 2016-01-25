'use strict';

function wsseInterceptor($injector) {
    return {
        'request': function (config) {
            let wsseService = $injector.get('wsseService');
            let userService = $injector.get('userService');
            let name, password;
            ({ name, password } = userService.getUserCredentials());
            config.headers['x-wsse'] = wsseService.getWSSEHeader(name, password);
            return config;
        }
    }
}

wsseInterceptor.$inject = ['$injector'];

export default wsseInterceptor;
