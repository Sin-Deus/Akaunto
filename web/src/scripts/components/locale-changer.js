/**
 * Controller for the locale changer component.
 */
class LocaleChangerController {

    /**
     * @constructor
     * @param {object} $translate The angular translate service.
     */
    constructor($translate) {
        this.$translate = $translate;
    }

    /**
     * Switches the current locate to the specified one.
     * @param {string} locale
     * @method
     */
    switchToLocale(locale) {
        this.$translate.use(locale);
    }
}

LocaleChangerController.$inject = ['$translate'];

export default {
    templateUrl: 'views/components/locale-changer.html',
    controller: LocaleChangerController
};
