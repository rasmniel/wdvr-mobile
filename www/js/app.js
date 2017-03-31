// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('wdvr-mobile', ['ionic', 'ngCordova', 'btford.socket-io'])

.run(function($ionicPlatform, $cordovaDevice) {
	$ionicPlatform.ready(function() {
		if (window.StatusBar) {
			window.StatusBar.hide();
		}
		if (window.cordova) {
			window.plugins.insomnia.keepAwake();
			window.screen.lockOrientation('portrait');
			if (window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
		}
	});
}).config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home',
			cache: false
		})
		.state('lobby', {
			url: '/lobby',
			templateUrl: 'views/lobby.html',
			controller: 'LobbyCtrl',
			controllerAs: 'lobby',
			cache: false
		})
		.state('admin', {
			url: '/admin',
			templateUrl: 'views/admin.html',
			controller: 'AdminCtrl',
			controllerAs: 'admin',
			cache: false
		})
		.state('library', {
			url: '/library',
			templateUrl: 'views/library.html',
			controller: 'LibraryCtrl',
			controllerAs: 'library',
			cache: false
		})
		.state('preview', {
			url: '/preview',
			templateUrl: 'views/preview.html',
			controller: 'PreviewCtrl',
			controllerAs: 'preview',
			cache: false
		})
		.state('remote', {
			url: '/remote',
			templateUrl: 'views/remote.html',
			controller: 'RemoteCtrl',
			controllerAs: 'remote',
			cache: false
		});

	$urlRouterProvider.otherwise('home');

	// Source origin whitelist.
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'https://welfaredenmark.blob.core.windows.net/**',
		'https://wdvr-api.azurewebsites.net/**'
	]);

	// Disable 'swipe' back function.
	$ionicConfigProvider.views.swipeBackEnabled(false);
});
