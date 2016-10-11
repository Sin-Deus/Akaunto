/**
 * Controller for the home section.
 */
class HomeController {

    /**
     * @constructor
     * @param {object} _
     * @param {User} userResolve The current user, resolved by the router.
     * @param {Account[]} accountsResolve The accounts of the user, resolved by the router.
     * @param {object} toastService
     * @param {object} utilsService
     * @param {object} accountService
     * @param {object} $mdDialog
     * @param {object} $translate
     */
    constructor(_, userResolve, accountsResolve, toastService, utilsService, accountService, $mdDialog, $translate) {
        this._ = _;
        this.user = userResolve;
        this.accounts = accountsResolve;
        this.toastService = toastService;
        this.utilsService = utilsService;
        this.accountService = accountService;
        this.$mdDialog = $mdDialog;
        this.$translate = $translate;
    }

    /**
     * Displays a confirmation modal prior to an account deletion.
     * @param {Account} account
     * @param {Event} $event
     * @method
     */
    confirmDeleteAccount(account, $event) {
        this.$translate([
            'home.account.delete.confirm.title',
            'home.account.delete.confirm.content',
            'home.account.delete.confirm.confirm',
            'home.account.delete.confirm.cancel'
        ], { name: account.name }).then(translations => this._showConfirm(translations, account, $event));
    }

    /**
     * Displays a confirmation modal prior to an account deletion.
     * @param {array} translations
     * @param {Account} account
     * @param {Event} $event
     * @private
     */
    _showConfirm(translations, account, $event) {
        const confirm = this.$mdDialog.confirm()
            .title(translations['home.account.delete.confirm.title'])
            .textContent(translations['home.account.delete.confirm.content'])
            .targetEvent($event)
            .ok(translations['home.account.delete.confirm.confirm'])
            .cancel(translations['home.account.delete.confirm.cancel']);

        this.$mdDialog.show(confirm).then(() => this._deleteAccount(account));
    }

    /**
     * Deletes the specified account.
     * @param {Account} account
     * @method
     * @private
     */
    _deleteAccount(account) {
        // this.utilsService.startLoading();
        this.accountService.deleteAccount(account._id)
            .then(
                () => this._onDeleteSuccess(account),
                () => this.toastService.error('toasts.error.standardError')
            );
            // .finally(this.utilsService.stopLoading);
    }

    /**
     * Removes the deleted account from the collection.
     * @param {Account} accountToDelete
     * @method
     * @private
     */
    _onDeleteSuccess(accountToDelete) {
        this.toastService.success('home.account.delete.success');
        this._.remove(this.accounts, account => account._id === accountToDelete._id);
    }
}

HomeController.$inject = [
    '_',
    'userResolve',
    'accountsResolve',
    'toastService',
    'utilsService',
    'accountService',
    '$mdDialog',
    '$translate'
];

export default HomeController;
