/**
 * Service for account.
 * @param {function} $http
 * @param {object} baseConstants
 * @return {{getAccounts: function, getAccount: function, createAccount: function, updateAccount: function, deleteAccount: function}}
 */
function accountService($http, baseConstants) {
    return {

        /**
         * @class Account
         * @property {number} id
         * @property {string} name
         * @property {number} currentBalance
         * @property {Date} lastReconciliation
         * @property {Date} update
         * @property {number} creator
         * @property {boolean} isSavings
         */

        /**
         * Returns the accounts of the currently logged user.
         * @method
         * @static
         * @return {Promise<Account[]>}
         */
        getAccounts() {
            return $http({
                method: 'GET',
                url: `${ baseConstants.apiBaseURL }accounts/`
            }).then(response => response.data);
        },

        /**
         * Returns the specified account.
         * @param {number} accountId The account id.
         * @method
         * @static
         * @return {Promise<Account>}
         */
        getAccount(accountId) {
            return $http({
                method: 'GET',
                url: `${ baseConstants.apiBaseURL }accounts/${ accountId }`
            }).then(response => response.data);
        },

        /**
         * Creates a new account.
         * @param {Account} account The account to create.
         * @method
         * @static
         * @return {Promise<Account>}
         */
        createAccount(account) {
            return $http({
                method: 'POST',
                url: `${ baseConstants.apiBaseURL }accounts/`,
                data: account
            }).then(response => response.data);
        },

        /**
         * Updates the specified account.
         * @param {Account} account The account to update.
         * @method
         * @static
         * @return {Promise<Account>}
         */
        updateAccount(account) {
            return $http({
                method: 'PUT',
                url: `${ baseConstants.apiBaseURL }accounts/${ account.id }`,
                data: account
            }).then(response => response.data);
        },

        /**
         * Deletes the specified account.
         * @param {number} accountId The account id to delete.
         * @method
         * @static
         * @return {Promise}
         */
        deleteAccount(accountId) {
            return $http({
                method: 'DELETE',
                url: `${ baseConstants.apiBaseURL }accounts/${ accountId }`
            });
        }
    };
}

accountService.$inject = ['$http', 'baseConstants'];

export default accountService;
