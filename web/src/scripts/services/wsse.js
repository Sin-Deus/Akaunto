'use strict';

import wsse from 'wsse';

export default function () {
    return {

        /**
         * Returns the WSSE header relative to the specified user name and password.
         * @param {string} userName The user name.
         * @param {string} password The password.
         * @returns {string} The HTTP header.
         */
        'getWSSEHeader': function (userName, password) {
            var token = wsse({ 'username': userName, 'password': password });
            return token.getWSSEHeader();
        }
    }
};
