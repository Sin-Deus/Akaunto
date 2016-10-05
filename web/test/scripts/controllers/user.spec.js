import { module, inject } from 'angular-mocks';

describe('UserController', () => {
    let controller;
    let $scope;
    let baseConstants;
    let $httpBackend;

    beforeEach(module('akaunto'));

    beforeEach(inject(function ($controller, $rootScope, _baseConstants_, _$httpBackend_) {
        $scope = $rootScope.$new();
        controller = $controller('UserController', {
            '$scope': $scope,
            'userResolve': { firstName: 'James', lastName: 'Bond' }
        });
        baseConstants = _baseConstants_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('../locales/locale-en.json').respond({});
        $httpBackend.whenGET('../locales/locale-fr.json').respond({});
    }));

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(controller.user).toBeDefined();
        expect(controller.user).toEqual({ firstName: 'James', lastName: 'Bond' });
    });

    it('call the API to update the user', () => {
        const form = { $setPristine: function () {} };
        const user = { firstName: 'Test', lastName: 'McTest', locale: 'fr' };
        
        $httpBackend.expectPUT(baseConstants.apiBaseURL + 'users/me', { firstName: 'James', lastName: 'Bond' }).respond(user);
        
        spyOn(controller, '_onSuccess').and.callThrough();
        spyOn(form, '$setPristine');
        spyOn(controller.$translate, 'use');
        spyOn(controller.moment, 'changeLocale');
        
        controller.passwordMatch = 'password';

        controller.update(form);

        $httpBackend.flush();

        expect(controller._onSuccess).toHaveBeenCalled();
        expect(controller.$translate.use).toHaveBeenCalledWith('fr');
        expect(controller.moment.changeLocale).toHaveBeenCalledWith('fr');
        expect(form.$setPristine).toHaveBeenCalled();
        expect(controller.passwordMatch).toBeUndefined();
    });
});
