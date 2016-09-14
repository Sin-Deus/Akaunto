/**
 * Controller for the login section.
 */
class LoginController {

    /**
     * @constructor
     * @param {object} authenticationService
     * @param {object} $state
     * @param {object} toastService
     * @param {object} utilsService
     */
    constructor(authenticationService, $state, toastService, utilsService) {
        this.authenticationService = authenticationService;
        this.$state = $state;
        this.toastService = toastService;
        this.utilsService = utilsService;
    }

    /**
     * Logs the user in the application, with the specified credentials.
     * @param {string} email The user email.
     * @param {string} password The user password.
     * @method
     */
    login(email, password) {
        this.utilsService.startLoading();
        this.authenticationService.authenticate(email, password)
            .then(
                token => this._storeTokenAndRedirect(token),
                () => {
                    this.toastService.error('login.error');
                    this.utilsService.stopLoading();
                });
    }

    /**
     * Stores the user credentials in the session storage, and redirects to the home page.
     * @param {string} token The JWT.
     * @method
     * @private
     */
    _storeTokenAndRedirect(token) {
        this.authenticationService.storeToken(token);
        this.$state.go('home');
    }
}

LoginController.$inject = ['authenticationService', '$state', 'toastService', 'utilsService'];

export default LoginController;
