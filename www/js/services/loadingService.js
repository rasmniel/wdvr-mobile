// This is a service which can show and hide a progress-loader while waiting for data/tasks.

var loadingService = function($ionicLoading, $timeout, languageService) {

	/**
	 * Shows the Ionic loader (home view).
	 */
	this.loaderShowHome = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="lines"></ion-spinner></br>' + languageService.getText('spinnerText'),
			animation: 'fade-in'
		});
	};

	/**
	 * Shows the Ionic loader (lobby view).
	 */
	this.loaderShowLobby = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="lines"></ion-spinner></br>',
			animation: 'fade-in'
		});
	};

	/**
	 * Hides the Ionic Loader.
	 */
	this.loaderHide = function() {
		$ionicLoading.hide();
	};
};

angular.module('wdvr-mobile').service('loadingService', loadingService);
