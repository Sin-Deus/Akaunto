/**
 * Configuration for the overlay service.
 * @param {object} bsLoadingOverlayService
 */
function overlayConfiguration(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        delay: 0,
        templateUrl: 'views/components/overlay.html'
    });
}

overlayConfiguration.$inject = ['bsLoadingOverlayService'];

export default overlayConfiguration;
