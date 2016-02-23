/**
 * Controller for the login section.
 */
class LoginController {

    /**
     * @constructor
     * @param {object} saltService
     * @param {object} userService
     * @param {object} $state
     * @param {object} toastService
     * @param {object} utilsService
     */
    constructor(saltService, userService, $state, toastService, utilsService) {
        this.saltService = saltService;
        this.userService = userService;
        this.$state = $state;
        this.toastService = toastService;
        this.utilsService = utilsService;
    }

    /**
     * Logs the user in the application, with the specified credentials.
     * @param {string} username The user name.
     * @param {string} password The user password.
     * @method
     */
    login(username, password) {
        this.utilsService.startLoading();
        this.saltService.getSalt(username)
            .then(
                salt => this._storeCredentialsAndRedirect(username, password, salt),
                () => {
                    this.toastService.error('login.error');
                    this.utilsService.stopLoading();
                });
    }

    /**
     * Stores the user credentials in the session storage, and redirects to the home page.
     * @param {string} username The user name.
     * @param {string} password The user password.
     * @param {string} salt The user salt.
     * @method
     * @private
     */
    _storeCredentialsAndRedirect(username, password, salt) {
        this.userService.storeUserCredentials(username, password, salt);
        this.$state.go('home');
    }
}

LoginController.$inject = ['saltService', 'userService', '$state', 'toastService', 'utilsService'];

export default LoginController;
