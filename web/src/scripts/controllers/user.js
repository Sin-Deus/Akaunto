/**
 * Controller for the user section.
 */
class UserController {

    /**
     * @constructor
     * @param {object} userResolve The user object resolved by the router.
     * @param {object} userService
     * @param {object} toastService
     * @param {object} utilsService
     * @param {object} $rootScope
     */
    constructor(userResolve, userService, toastService, utilsService, $rootScope) {
        this.user = userResolve;
        this.userService = userService;
        this.toastService = toastService;
        this.utilsService = utilsService;
        this.$rootScope = $rootScope;
    }

    /**
     * Updates the user remotely.
     * @param {Object} userForm
     * @method
     */
    update(userForm) {
        this.utilsService.startLoading();
        this.userService.updateMe(this.user)
            .then(
                user => this._onSuccess(user, userForm),
                () => this.toastService.error('toasts.error.standardError')
            )
            .finally(this.utilsService.stopLoading);
    }

    /**
     * Updates the user client-side.
     * @param {User} user
     * @param {Object} userForm
     * @private
     */
    _onSuccess(user, userForm) {
        this.user = user;
        this.$rootScope.$emit('user:update', this.user);
        this.toastService.success('user.success');
        Reflect.deleteProperty(this, 'passwordMatch');
        userForm.$setPristine();
    }
}

UserController.$inject = [
    'userResolve',
    'userService',
    'toastService',
    'utilsService',
    '$rootScope'
];

export default UserController;
