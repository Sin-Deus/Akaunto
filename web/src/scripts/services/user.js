/**
 * Service for user.
 * @param {function} $http
 * @param {object} baseConstants
 * @return {{getMe: function, updateMe: function}}
 */
function userService($http, baseConstants) {
    return {

        /**
         * @class User
         * @property {number} id
         * @property {string} firstName
         * @property {string} lastName
         * @property {string} email
         * @property {string} locale
         * @property {boolean} isAdmin
         */

        /**
         * Returns the currently logged user.
         * @method
         * @static
         * @return {Promise<User>}
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
         * @return {Promise<User>}
         */
        updateMe(user) {
            return $http({
                method: 'PUT',
                url: `${ baseConstants.apiBaseURL }users/me`,
                data: user
            }).then(response => response.data);
        },

        /**
         * Returns the list of all registered users.
         * @param {string} [filter] The optional text to filter the users with.
         * @method
         * @static
         * @return {Promise<User[]>}
         */
        getUsers(filter) {
            return $http({
                method: 'GET',
                url: `${ baseConstants.apiBaseURL }users/`,
                params: { filter }
            }).then(response => response.data);
        }
    };
}

userService.$inject = ['$http', 'baseConstants'];

export default userService;
