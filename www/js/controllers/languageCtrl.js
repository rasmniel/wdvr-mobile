var languageCtrl = function($rootScope, $timeout, $ionicSideMenuDelegate, languageService) {
    var ctrl = this;

    ctrl.service = languageService;
    ctrl.getText = languageService.getText;

    (function init() {
        $rootScope.$on('expandLeftEvent', function() {
            ctrl.langMenu = false;
        });
    })();

	ctrl.openLangMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	ctrl.isLeftMenuOpen = function() {
	    return $ionicSideMenuDelegate.isOpenLeft();
	};

    /**
     * Toggle language menu display.
     */
    ctrl.langToggle = function() {
        if (ctrl.langMenu) {
            $timeout(function() {
                ctrl.langMenu = false;
            }, 50);
        }
        else {
            ctrl.langMenu = true;
        }
    };

    /**
     * Sets language equal to picked language from language menu.
     */
    ctrl.selectLanguage = function(language) {
        ctrl.langToggle();
        languageService.setLanguage(language);
        ctrl.langMenu = false;
    };
};

angular.module('wdvr-mobile').controller('LanguageCtrl', languageCtrl);
