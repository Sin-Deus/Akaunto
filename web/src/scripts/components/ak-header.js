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
     * @param {object} $translate The Angular translate service.
     * @param {object} moment The Moment JS library.
     */
    constructor(userService, authenticationService, $state, $rootScope, $translate, moment) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
        this.moment = moment;

        this._fetchUser();
        this._listenToUserUpdate();
    }

    /**
     * Fetches the current user.
     * @method
     * @private
     */
    _fetchUser() {
        this.userService.getMe().then(user => {
            this.user = user;
            this.$translate.use(this.user.locale);
            this.moment.changeLocale(this.user.locale);
        });
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
}

AkHeaderController.$inject = ['userService', 'authenticationService', '$state', '$rootScope', '$translate', 'amMoment'];

export default {
    templateUrl: 'views/components/ak-header.html',
    controller: AkHeaderController
};
