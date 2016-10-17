import { module, inject } from 'angular-mocks';

describe('HomeController', () => {
    let controller;
    let $scope;
    let baseConstants;
    let $httpBackend;

    beforeEach(module('akaunto'));

    beforeEach(inject(function ($controller, $rootScope, _baseConstants_, _$httpBackend_) {
        $scope = $rootScope.$new();
        controller = $controller('HomeController', {
            '$scope': $scope,
            'userResolve': { firstName: 'James', lastName: 'Bond', _id: 42 },
            'accountsResolve': [
                { name: 'Account 1', _id: 1, creator: 42 },
                { name: 'Account 2', _id: 2, creator: 42 },
                { name: 'Account 3', _id: 3, creator: 3 },
                { name: 'Account 4', _id: 4, creator: 42 },
                { name: 'Account 5', _id: 5, creator: 3 }
            ]
        });
        baseConstants = _baseConstants_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('../locales/locale-en.json').respond({});
        $httpBackend.whenGET('../locales/locale-fr.json').respond({});
    }));

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(controller.user).toBeDefined();
        expect(controller.user).toEqual({ firstName: 'James', lastName: 'Bond', _id: 42 });
        expect(controller.ownAccounts).toBeDefined();
        expect(controller.ownAccounts).toEqual([
            { name: 'Account 1', _id: 1, creator: 42 },
            { name: 'Account 2', _id: 2, creator: 42 },
            { name: 'Account 4', _id: 4, creator: 42 }
        ]);
        expect(controller.otherAccounts).toBeDefined();
        expect(controller.otherAccounts).toEqual([
            { name: 'Account 3', _id: 3, creator: 3 },
            { name: 'Account 5', _id: 5, creator: 3 }
        ]);
    });

    it('should update the user whenever an account switch is changed', () => {
        $httpBackend.expectPUT(`${ baseConstants.apiBaseURL }users/me`, { firstName: 'James', lastName: 'Bond', _id: 42 }).respond({});
        controller.onSwitch();
        $httpBackend.flush();
    });

    it('should correctly delete an account', () => {
        $httpBackend.expectDELETE(`${ baseConstants.apiBaseURL }accounts/2`).respond({});
        controller._deleteAccount({ name: 'Account 2', _id: 2, creator: 42 });

        $httpBackend.flush();

        expect(controller.ownAccounts).toEqual([
            { name: 'Account 1', _id: 1, creator: 42 },
            { name: 'Account 4', _id: 4, creator: 42 }
        ]);
        expect(controller.otherAccounts).toEqual([
            { name: 'Account 3', _id: 3, creator: 3 },
            { name: 'Account 5', _id: 5, creator: 3 }
        ]);

        $httpBackend.expectDELETE(`${ baseConstants.apiBaseURL }accounts/5`).respond({});
        controller._deleteAccount({ name: 'Account 5', _id: 5, creator: 3 });

        $httpBackend.flush();

        expect(controller.ownAccounts).toEqual([
            { name: 'Account 1', _id: 1, creator: 42 },
            { name: 'Account 4', _id: 4, creator: 42 }
        ]);
        expect(controller.otherAccounts).toEqual([
            { name: 'Account 3', _id: 3, creator: 3 }
        ]);
    });
});
