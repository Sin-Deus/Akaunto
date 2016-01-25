'use strict';

import wsse from 'wsse';
import SHA512 from 'crypto-js/sha512';
import ENC_BASE64 from 'crypto-js/enc-base64';
import ENC_UTF8 from 'crypto-js/enc-utf8';

export default function () {
    return {

        /**
         * Returns the WSSE header relative to the specified user name and password.
         * @method
         * @static
         * @param {string} userName The user name.
         * @param {string} password The password.
         * @returns {string} The HTTP header.
         */
        'getWSSEHeader': function (userName, password) {
            var token = wsse({ 'username': userName, 'password': password });
            return token.getWSSEHeader({ nonceBase64: true });
        },

        /**
         * Encrypt the given password with the user salt.
         * @method
         * @static
         * @param {string} password The user password.
         * @param {string} salt The user salt.
         * @returns {string} The encrypted user password.
         */
        'cipher': function (password, salt) {
            var salted = password + '{' + salt + '}';
            var digest = SHA512(salted); // jshint ignore:line
            for (var i = 1; i < 5000; i++) {
                digest = SHA512(digest.concat(ENC_UTF8.parse(salted))); // jshint ignore:line
            }

            return digest.toString(ENC_BASE64); // jshint ignore:line
        }
    }
};
