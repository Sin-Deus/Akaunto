/**
 * Controller for the account form section.
 */
class AccountFormController {

    /**
     * @constructor
     * @param {Account} accountResolve The account object resolved by the router.
     * @param {object} accountService
     * @param {object} toastService
     * @param {object} utilsService
     * @param {object} $state
     * @param {object} baseConstants
     */
    constructor(accountResolve, accountService, toastService, utilsService, $state, baseConstants) {
        this.account = accountResolve;
        this.isCreation = !this.account._id;
        this.accountService = accountService;
        this.toastService = toastService;
        this.utilsService = utilsService;
        this.$state = $state;
        this.currencies = baseConstants.currencies;
    }

    /**
     * Updates or creates the account remotely.
     * @method
     */
    update() {
        this.utilsService.startLoading();

        const promise = this.account._id ?
            this.accountService.updateAccount(this.account)
            : this.accountService.createAccount(this.account);

        promise
            .then(
                () => this._onSuccess(),
                () => this._onError()
            );
    }

    /**
     * Displays a toast and navigates back to the home page.
     * @method
     * @private
     */
    _onSuccess() {
        this.toastService.success('account.success');
        this.$state.go('home');
    }

    /**
     * Displays a toast, warning the user.
     * @method
     * @private
     */
    _onError() {
        this.toastService.error('toasts.error.standardError');
        this.utilsService.stopLoading();
    }
}

AccountFormController.$inject = [
    'accountResolve',
    'accountService',
    'toastService',
    'utilsService',
    '$state',
    'baseConstants'
];

export default AccountFormController;
