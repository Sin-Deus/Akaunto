/**
 * Configuration for the translation service.
 * @param {object} $translateProvider
 */
function translateConfiguration($translateProvider) {
    $translateProvider.preferredLanguage('en');

    $translateProvider.useStaticFilesLoader({
        prefix: '../locales/locale-',
        suffix: '.json'
    });

    $translateProvider.useSanitizeValueStrategy('escape');
}

translateConfiguration.$inject = ['$translateProvider'];

export default translateConfiguration;
