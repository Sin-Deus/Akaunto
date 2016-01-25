'use strict';

function userService(wsseService, $http, baseConstants) {

    var USER_NAME = 'username',
        PASSWORD = 'password';

    return {

        /**
         * @class User
         * @property {number} id
         * @property {string} username
         * @property {string} email
         */

        /**
         * Returns the logged user credentials.
         * @method
         * @static
         * @returns {{name, password}}
         */
        'getUserCredentials': function () {
            return {
                'name': sessionStorage.getItem(USER_NAME),
                'password': sessionStorage.getItem(PASSWORD)
            };
        },

        /**
         * Stores the user credentials in the session storage.
         * @method
         * @static
         * @param {string} userName The user name.
         * @param {string} password The user password.
         * @param {string} salt The user salt.
         */
        'storeUserCredentials': function (userName, password, salt) {
            sessionStorage.setItem(USER_NAME, userName);
            sessionStorage.setItem(PASSWORD, wsseService.cipher(password, salt));
        },

        /**
         * Returns the currently logged user.
         * @method
         * @static
         * @returns {User}
         */
        'getMe': function () {
            return $http({
                'method': 'GET',
                'url': `${ baseConstants.apiBaseURL }users/me`
            })
        }
    }
}

userService.$inject = ['wsseService', '$http', 'baseConstants'];

export default userService;
