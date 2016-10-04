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

        $httpBackend.whenGET('../locales/locale-en.json').respond({});
    }));

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('store the credentials and redirect to home', () => {
        spyOn(controller, '_storeTokenAndRedirect').and.callThrough();
        spyOn(controller.$state, 'go');

        $httpBackend.expectPOST(baseConstants.baseURL + 'authenticate').respond({ token: 'mytoken' });

        controller.login(username, password);

        $httpBackend.flush();

        expect(controller._storeTokenAndRedirect).toHaveBeenCalledWith('mytoken');
        expect(controller.$state.go).toHaveBeenCalledWith('home');
    });
});
