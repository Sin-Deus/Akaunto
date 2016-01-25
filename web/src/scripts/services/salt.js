'use strict';

function saltService(baseConstants, $http) {
    return {

        /**
         * Returns the salt of the specified user.
         * @method
         * @static
         * @param {string} userName The user name.
         * @returns {Promise}
         */
        'getSalt': function (userName) {
            return $http({
                'method': 'GET',
                'url': `${ baseConstants.baseURL }wsse/${ userName }/salt`
            }).then(function (response) {
                return response.data;
            });
        }
    }
}

saltService.$inject = ['baseConstants', '$http'];

export default saltService;
