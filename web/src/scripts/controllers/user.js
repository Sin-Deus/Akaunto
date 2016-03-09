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
     */
    constructor(userResolve, userService, toastService, utilsService) {
        this.user = userResolve;
        this.userService = userService;
        this.toastService = toastService;
        this.utilsService = utilsService;
    }

    /**
     * Updates the user.
     * @method
     */
    update() {
        this.utilsService.startLoading();
        this.userService.updateMe(this.user)
            .then(
                () => this.toastService.error('user.success'),
                () => this.toastService.error('toasts.error.standardError')
            )
            .finally(this.utilsService.stopLoading);
    }
}

UserController.$inject = ['userResolve', 'userService', 'toastService', 'utilsService'];

export default UserController;
