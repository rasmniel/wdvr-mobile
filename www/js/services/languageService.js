var languageService = function($http) {
    var service = this;

    service.langs = [];
    service.text = {};
    service.lang = '';

    (function init() {
        loadData();
        service.lang = 'da_DK';
    })();

    /**
     * Sets language equal to picked language from language menu.
     */
    service.setLanguage = function(language) {
        service.lang = language.tag;
    };

    /**
     * Used in other classes to get appropriate text for titles and other strings, depending on selected language.
     */
    service.getText = function(name) {
        if (!service.text) {
            loadData();
            return '';
        }
        if (service.text[name] !== undefined) {
            return service.text[name][service.lang];
        }
        return ' ';
    };

    /**
     * Loads appropriate data from content.json, depending on which language has been selected.
     */
    function loadData() {
        $http.get('data/content.json').then(function(result) {
            service.text = result.data;
        });
        $http.get('data/langs.json').then(function(result) {
            service.langs = result.data;
        });
    }
};

angular.module('wdvr-mobile').service('languageService', languageService);
