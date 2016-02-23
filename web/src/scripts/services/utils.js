/**
 * Service for various utility functions.
 * @param {object} bsLoadingOverlayService The overlay service.
 * @return {{startLoading: function, stopLoading: function}}
 */
function utilsService(bsLoadingOverlayService) {
    const DEFAULT_REFERENCE_ID = 'root';

    return {

        /**
         * Shows that the application is loading, by displaying an overlay.
         * @param {string} [referenceId='root'] The ID of the loading element; if none specified: the whole application.
         */
        startLoading(referenceId = DEFAULT_REFERENCE_ID) {
            bsLoadingOverlayService.start({
                referenceId
            });
        },

        /**
         * Ends the loading, by removing overlays.
         * @param {string} [referenceId='root'] The ID of the loading element; if none specified: the whole application.
         */
        stopLoading(referenceId = DEFAULT_REFERENCE_ID) {
            bsLoadingOverlayService.stop({
                referenceId
            });
        }
    };
}

utilsService.$inject = ['bsLoadingOverlayService'];

export default utilsService;
