/**
 * Controller for the Akaunto header component.
 */
class AkHeaderController {

    /**
     * @constructor
     * @param {object} userService The user service.
     * @param {object} authenticationService The authentication service.
     * @param {object} $state The Angular UI router service.
     */
    constructor(userService, authenticationService, $state) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.$state = $state;

        this._fetchUser();
    }

    /**
     * Fetches the current user.
     * @method
     * @private
     */
    _fetchUser() {
        this.userService.getMe().then(user => this.user = user);
    }

    /**
     * Logs the user out.
     * @method
     */
    logout() {
        this.authenticationService.clearToken();
        this.$state.go('login');
    }

    /**
     * Navigates to the home page.
     * @method
     */
    goHome() {
        this.$state.go('home');
    }
}

AkHeaderController.$inject = ['userService', 'authenticationService', '$state'];

export default {
    templateUrl: 'views/components/ak-header.html',
    controller: AkHeaderController
};
