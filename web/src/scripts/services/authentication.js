/**
 * Service for authentication.
 * @param {Object} baseConstants
 * @param {Function} $http
 * @return {{authenticate: function, getToken: function, storeToken: function, clearToken: function}}
 */
function authenticationService(baseConstants, $http) {
    const TOKEN = 'token';

    return {

        /**
         * Authenticate the user, and will provide a JWT.
         * @method
         * @static
         * @param {string} email The user name.
         * @param {string} password The user password.
         * @return {Promise}
         */
        authenticate(email, password) {
            return $http({
                method: 'POST',
                data: { email: email, password: password },
                url: `${ baseConstants.baseURL }authenticate`
            }).then(response => response.data && response.data.token);
        },

        /**
         * Returns the JWT.
         * @method
         * @static
         * @return {string}
         */
        getToken() {
            return sessionStorage.getItem(TOKEN);
        },

        /**
         * Stores the JWT in the session storage.
         * @method
         * @static
         * @param {string} token The JWT.
         */
        storeToken(token) {
            sessionStorage.setItem(TOKEN, token);
        },

        /**
         * Clears the JWT from the session storage.
         * @method
         * @static
         */
        clearToken() {
            sessionStorage.removeItem(TOKEN);
        }
    };
}

authenticationService.$inject = ['baseConstants', '$http'];

export default authenticationService;
