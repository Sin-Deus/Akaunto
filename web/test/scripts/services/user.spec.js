import { module, inject } from 'angular-mocks';

describe('UserService', () => {
    let userService;
    let $httpBackend;
    let baseConstants;

    beforeEach(module('akaunto'));

    beforeEach(inject(function (_$httpBackend_, _baseConstants_, _userService_) {
        $httpBackend = _$httpBackend_;
        baseConstants = _baseConstants_;
        userService = _userService_;

        $httpBackend.whenGET('../locales/locale-en.json').respond({});
        $httpBackend.whenGET('../locales/locale-fr.json').respond({});
    }));

    describe('getMe', () => {
        it('should be defined', () => {
            expect(userService.getMe).toBeDefined();
        });

        itAsync('should call the correct URL', () => {
            $httpBackend.expectGET(baseConstants.apiBaseURL + 'users/me').respond({ username: 'Test McMuffin' });
            let promise = userService.getMe();
            $httpBackend.flush();

            return promise.then(user => expect(user).toEqual({ username: 'Test McMuffin' }));
        });
    });
});
