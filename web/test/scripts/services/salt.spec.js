import { module, inject } from 'angular-mocks';

describe('SaltService', () => {
    let saltService;
    let $httpBackend;
    let baseConstants;
    const username = 'Test';

    beforeEach(module('akaunto'));

    beforeEach(inject(function (_$httpBackend_, _baseConstants_, _saltService_) {
        $httpBackend = _$httpBackend_;
        baseConstants = _baseConstants_;
        saltService = _saltService_;
    }));

    describe('getSalt', () => {
        it('should be defined', () => {
            expect(saltService.getSalt).toBeDefined();
        });

        itAsync('should call the correct URL', () => {
            $httpBackend.expectGET(baseConstants.baseURL + 'wsse/Test/salt').respond('mysalt');
            let promise = saltService.getSalt(username);
            $httpBackend.flush();

            return promise.then(salt => expect(salt).toBe('mysalt'));
        });
    });
});
