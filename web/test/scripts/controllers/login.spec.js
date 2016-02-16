import { module, inject } from 'angular-mocks';

describe('LoginController', () => {
    let controller;
    let $scope;
    let baseConstants;
    let $httpBackend;
    const username = 'Test';
    const password = 'password';

    beforeEach(module('akaunto'));

    beforeEach(inject(function ($controller, $rootScope, _baseConstants_, _$httpBackend_) {
        $scope = $rootScope.$new();
        controller = $controller('LoginController', {
            '$scope': $scope
        });
        baseConstants = _baseConstants_;
        $httpBackend = _$httpBackend_;
    }));

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('store the credentials and redirect to home', () => {
        spyOn(controller, '_storeCredentialsAndRedirect').and.callThrough();
        spyOn(controller.$state, 'go');

        $httpBackend.expectGET(baseConstants.baseURL + 'wsse/Test/salt').respond('mysalt');

        controller.login(username, password);

        $httpBackend.flush();

        expect(controller._storeCredentialsAndRedirect).toHaveBeenCalledWith('Test', 'password', 'mysalt');
        expect(controller.$state.go).toHaveBeenCalledWith('home');
    });
});
