/**
 * Controller for the Akaunto header component.
 */
class AkHeaderController {

    /**
     * @constructor
     * @param {object} userService The user service.
     * @param {object} $state The Angular UI router service.
     */
    constructor(userService, $state) {
        this.userService = userService;
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
        this.userService.clearUserCredentials();
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

AkHeaderController.$inject = ['userService', '$state'];

export default {
    templateUrl: 'views/components/ak-header.html',
    controller: AkHeaderController
};
