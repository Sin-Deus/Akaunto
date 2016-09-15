/**
 * Service for user.
 * @param {function} $http
 * @param {object} baseConstants
 * @return {{getMe: function}}
 */
function userService($http, baseConstants) {

    return {

        /**
         * @class User
         * @property {number} id
         * @property {string} username
         * @property {string} email
         */

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
            }).then(response => response.data);
        }
    };
}

userService.$inject = ['$http', 'baseConstants'];

export default userService;
