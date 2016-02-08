import wsse from 'wsse';
import sha512 from 'crypto-js/sha512';
import encBase64 from 'crypto-js/enc-base64';
import encUTF8 from 'crypto-js/enc-utf8';

/**
 * Service for WSSE token handling.
 * @return {{getWSSEHeader: function, cipher: function}}
 */
export default function () {
    const MAX_INCREMENT = 5000;

    return {

        /**
         * Returns the WSSE header relative to the specified user name and password.
         * @method
         * @static
         * @param {string} username The user name.
         * @param {string} password The password.
         * @return {string} The HTTP header.
         */
        getWSSEHeader(username, password) {
            const token = wsse({ username, password });
            return token.getWSSEHeader({ nonceBase64: true });
        },

        /**
         * Encrypt the given password with the user salt.
         * @method
         * @static
         * @param {string} password The user password.
         * @param {string} salt The user salt.
         * @return {string} The encrypted user password.
         */
        cipher(password, salt) {
            const salted = `${ password } {${ salt }}`;
            let digest = sha512(salted);
            for (let increment = 1; increment < MAX_INCREMENT; increment++) {
                digest = sha512(digest.concat(encUTF8.parse(salted)));
            }

            return digest.toString(encBase64);
        }
    };
}
