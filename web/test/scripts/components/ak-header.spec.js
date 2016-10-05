import { module, inject } from 'angular-mocks';

describe('akHeaderComponent', () => {
    let baseConstants;
    let $httpBackend;
    let $componentController;
    let $translate;
    let moment;
    let $state;

    beforeEach(module('akaunto'));

    beforeEach(inject(function (_$componentController_, $rootScope, _baseConstants_, _$httpBackend_, _$translate_, _moment_, _$state_) {
        baseConstants = _baseConstants_;
        $httpBackend = _$httpBackend_;
        $componentController = _$componentController_;
        $translate = _$translate_;
        moment = _moment_;
        $state = _$state_;

        $httpBackend.whenGET('../locales/locale-en.json').respond({});
        $httpBackend.whenGET('../locales/locale-fr.json').respond({});
    }));

    it('should have loaded the user', function () {
        const user = { firstName: 'Test', lastName: 'McTest' };
        $httpBackend.expectGET(`${ baseConstants.apiBaseURL }users/me`).respond(user);
        const controller = $componentController('akHeader', { $scope: {} });
        $httpBackend.flush();

        expect(controller.user).toEqual(user);
    });

    it('should adapt the locale according to the user preference', function () {
        expect(moment.locale()).toEqual('en');

        $httpBackend.expectGET(`${ baseConstants.apiBaseURL }users/me`).respond({ locale: 'fr' });
        $componentController('akHeader', { $scope: {} });
        $httpBackend.flush();

        expect($translate.use()).toEqual('fr');
        expect(moment.locale()).toEqual('fr');
    });

    it('should navigate to the home page', function () {
        spyOn($state, 'go');

        const controller = $componentController('akHeader', { $scope: {} });
        controller.goHome();

        expect($state.go).toHaveBeenCalledWith('home');
    });
});
