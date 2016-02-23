/**
 * Configuration for the router transitions.
 * @param {object} $rootScope
 * @param {object} utilsService
 */
function stateTransitionConfiguration($rootScope, utilsService) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        if (fromState.name) { // Prevents a null pointer in the Overlay library.
            utilsService.startLoading();
        }
    });
    $rootScope.$on('$stateChangeSuccess', () => utilsService.stopLoading());
    $rootScope.$on('$stateChangeError', () => utilsService.stopLoading());
}

stateTransitionConfiguration.$inject = ['$rootScope', 'utilsService'];

export default stateTransitionConfiguration;
