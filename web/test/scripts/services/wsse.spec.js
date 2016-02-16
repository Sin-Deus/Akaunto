import WsseService from 'src/scripts/services/wsse';

describe('WsseService', () => {
    let wsseService;
    const username = 'Test McMuffin';
    const password = 'P@ssw0rd';
    const salt = 'QxLUF1bgIAdeQX';

    beforeEach(() => {
        wsseService = new WsseService();
    });

    describe('getWSSEHeader', () => {
        it('should be defined', () => {
            expect(wsseService.getWSSEHeader).toBeDefined();
        });

        it('should generate the WSSE token header', () => {
            let wsseHeaderRegEx = /UsernameToken Username="Test McMuffin", PasswordDigest="[^"]+", Nonce="[^"]{28}", Created="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"/g;
            expect(wsseHeaderRegEx.test(wsseService.getWSSEHeader(username, password))).toBeTruthy();
        });
    });

    describe('cipher', () => {
        it('should be defined', () => {
            expect(wsseService.cipher).toBeDefined();
        });

        it('should cipher the password and salt altogether', () => {
            expect(wsseService.cipher(password, salt)).toBe('Rtd6jvvzSyk7Paj4EeXka4LCfNnBQdoBzugt+GxK0XqvOUUmdUNOHGiDQ0eHoHpczVKRPgdKGTRIJgKmxLNfRw==');
        });
    });
});
