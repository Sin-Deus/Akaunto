/**
 * Controller for the login section.
 */
class LoginController {

    /**
     * @constructor
     * @param {object} saltService
     * @param {object} userService
     * @param {object} $state
     */
    constructor(saltService, userService, $state) {
        this.saltService = saltService;
        this.userService = userService;
        this.$state = $state;
    }

    /**
     * Logs the user in the application, with the specified credentials.
     * @param {string} username The user name.
     * @param {string} password The user password.
     * @method
     */
    login(username, password) {
        this.saltService.getSalt(username)
            .then(salt => this._storeCredentialsAndRedirect(username, password, salt));
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

LoginController.$inject = ['saltService', 'userService', '$state'];

export default LoginController;
