/**
 * Configuration for the router transitions.
 * @param {object} $rootScope
 * @param {object} utilsService
 * @param {object} $state
 */
function stateTransitionConfiguration($rootScope, utilsService, $state) {
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        if (fromState.name) { // Prevents a null pointer in the Overlay library.
            utilsService.startLoading();
        }
    });
    $rootScope.$on('$stateChangeSuccess', () => utilsService.stopLoading());
    $rootScope.$on('$stateChangeError', () => utilsService.stopLoading());
}

stateTransitionConfiguration.$inject = ['$rootScope', 'utilsService', '$state'];

export default stateTransitionConfiguration;
