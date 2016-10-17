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
     * @param {object} userService
     * @param {object} $mdDialog
     * @param {object} $translate
     */
    /* eslint-disable max-statements */
    constructor(_, userResolve, accountsResolve, toastService, utilsService, accountService, userService, $mdDialog, $translate) {
        this._ = _;
        this.user = userResolve;
        this.toastService = toastService;
        this.utilsService = utilsService;
        this.accountService = accountService;
        this.userService = userService;
        this.$mdDialog = $mdDialog;
        this.$translate = $translate;

        const filteredAccounts = this._filterAccounts(accountsResolve);
        this.ownAccounts = filteredAccounts.ownAccounts;
        this.otherAccounts = filteredAccounts.otherAccounts;
    }

    /**
     *
     * @param {Account[]} accounts
     * @return {{ownAccounts: Account[], otherAccounts: Account[]}}
     * @method
     * @private
     */
    _filterAccounts(accounts) {
        return {
            ownAccounts: this._.filter(accounts, this._.bind(this.isUserCreatorOfAccount, this)),
            otherAccounts: this._.filter(accounts, this._.bind(this.isUserNotCreatorOfAccount, this))
        };
    }

    /**
     * Checks if the current user is the creator of the account.
     * @param {Account} account
     * @return {boolean} True if the user is the creator, false otherwise.
     * @method
     */
    isUserCreatorOfAccount(account) {
        return this.accountService.isUserCreatorOfAccount(this.user, account);
    }

    /**
     * Checks if the current user is the creator of the account.
     * @param {Account} account
     * @return {boolean} False if the user is the creator, true otherwise.
     * @method
     */
    isUserNotCreatorOfAccount(account) {
        return !this.isUserCreatorOfAccount(account);
    }

    /**
     * Updates the user preferences.
     * @method
     */
    onSwitch() {
        this.userService.updateMe(this.user);
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
        this.accountService.deleteAccount(account._id)
            .then(
                () => this._onDeleteSuccess(account),
                () => this.toastService.error('toasts.error.standardError')
            );
    }

    /**
     * Removes the deleted account from the collection.
     * @param {Account} accountToDelete
     * @method
     * @private
     */
    _onDeleteSuccess(accountToDelete) {
        this.toastService.success('home.account.delete.success');
        this._.each([this.ownAccounts, this.otherAccounts], accounts =>
            this._.remove(accounts, account => account._id === accountToDelete._id)
        );
    }
}

HomeController.$inject = [
    '_',
    'userResolve',
    'accountsResolve',
    'toastService',
    'utilsService',
    'accountService',
    'userService',
    '$mdDialog',
    '$translate'
];

export default HomeController;
