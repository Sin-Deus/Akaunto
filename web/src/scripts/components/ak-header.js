/**
 * Controller for the Akaunto header component.
 */
class AkHeaderController {

    /**
     * @constructor
     * @param {object} userService The user service.
     * @param {object} authenticationService The authentication service.
     * @param {object} $state The Angular UI router service.
     * @param {object} $rootScope The Angular root scope.
     */
    constructor(userService, authenticationService, $state, $rootScope) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.$state = $state;
        this.$rootScope = $rootScope;

        this._fetchUser();
        this._listenToUserUpdate();
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
     * Sets up an event listener on the root scope, listening to a change of the current user.
     * @method
     * @private
     */
    _listenToUserUpdate() {
        this.$rootScope.$on('user:update', (event, user) => this.user = user);
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
     * Navigates to the user edition page.
     * @method
     */
    edit() {
        this.$state.go('user');
    }

    /**
     * Navigates to the home page.
     * @method
     */
    goHome() {
        this.$state.go('home');
    }
}

AkHeaderController.$inject = ['userService', 'authenticationService', '$state', '$rootScope'];

export default {
    templateUrl: 'views/components/ak-header.html',
    controller: AkHeaderController
};
