function wsseInterceptor(wsseService, userService) {
    return {
        'request': function (config) {
            let name, password;
            ({ name, password } = userService.getUserCredentials());
            config.headers['x-wsse'] = wsseService.getWSSEHeader(name, password);
            return config;
        }
    }
}

wsseInterceptor.$inject = ['wsseService', 'userService'];

export default wsseInterceptor;
