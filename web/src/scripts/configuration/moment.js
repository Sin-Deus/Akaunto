/**
 * Configuration for the moment service.
 * @param {object} moment
 */
function momentConfiguration(moment) {
    moment.locale('en');
}

momentConfiguration.$inject = ['moment'];

export default momentConfiguration;
