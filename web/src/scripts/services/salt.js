/**
 * Service for salt.
 * @param {Object} baseConstants
 * @param {Function} $http
 * @return {{getSalt: function}}
 */
function saltService(baseConstants, $http) {
    return {

        /**
         * Returns the salt of the specified user.
         * @method
         * @static
         * @param {string} userName The user name.
         * @return {Promise}
         */
        getSalt(userName) {
            return $http({
                method: 'GET',
                url: `${ baseConstants.baseURL }wsse/${ userName }/salt`
            }).then(response => response.data);
        }
    };
}

saltService.$inject = ['baseConstants', '$http'];

export default saltService;
