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
        },

        /**
         * Updates the currently logged user.
         * @param {User} user The new user.
         * @method
         * @static
         * @returns {User}
         */
        updateMe(user) {
            return $http({
                method: 'PUT',
                url: `${ baseConstants.apiBaseURL }users/me`,
                data: user
            }).then(response => response.data);
        }
    };
}

userService.$inject = ['$http', 'baseConstants'];

export default userService;
