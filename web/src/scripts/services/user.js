/**
 * Service for user.
 * @param {object} wsseService
 * @param {function} $http
 * @param {object} baseConstants
 * @return {{getUserCredentials: function, storeUserCredentials: function, getMe: function}}
 */
function userService(wsseService, $http, baseConstants) {
    const USER_NAME = 'username';
    const PASSWORD = 'password';

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
         * @return {{name, password}}
         */
        getUserCredentials() {
            return {
                name: sessionStorage.getItem(USER_NAME),
                password: sessionStorage.getItem(PASSWORD)
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
        storeUserCredentials(userName, password, salt) {
            sessionStorage.setItem(USER_NAME, userName);
            sessionStorage.setItem(PASSWORD, wsseService.cipher(password, salt));
        },

        /**
         * Returns the currently logged user.
         * @method
         * @static
         * @return {User}
         */
        getMe() {
            return $http({
                method: 'GET',
                url: `${ baseConstants.apiBaseURL }users/me`
            });
        }
    };
}

userService.$inject = ['wsseService', '$http', 'baseConstants'];

export default userService;
