/**
 * Service for toast management.
 * @param {object} $mdToast The Angular Material toast service.
 * @param {function} $translate The Angular Translate service.
 * @param {object} $q The Angular Q service.
 * @return {{error: function}}
 */
function toastService($mdToast, $translate, $q) {
    const SUCCESS_DELAY = 2000;

    return {

        /**
         * Shows an error toast.
         * @param {string} messageKey The Angular Translate message key.
         * @method
         * @static
         */
        error(messageKey) {
            $q.all([
                $translate(messageKey),
                $translate('toasts.error.action')
            ]).then(messages => {
                $mdToast.show($mdToast.simple()
                    .textContent(messages[0])
                    .action(messages[1])
                    .highlightAction(true)
                    .position('top right')
                    .hideDelay(0)
                    .parent('.ak-mainContent'));
            });
        },

        /**
         * Shows a success toast.
         * @param {string} messageKey The Angular Translate message key.
         * @method
         * @static
         */
        success(messageKey) {
            $q.all([
                $translate(messageKey)
            ]).then(messages => {
                $mdToast.show($mdToast.simple()
                    .textContent(messages[0])
                    .position('top right')
                    .hideDelay(SUCCESS_DELAY)
                    .parent('.ak-mainContent'));
            });
        }
    };
}

toastService.$inject = ['$mdToast', '$translate', '$q'];

export default toastService;
