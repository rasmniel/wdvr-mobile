var homeCtrl = function($state, $timeout, $ionicPlatform, $ionicSideMenuDelegate, languageService, gatewayService, commService, loadingService) {
	var ctrl = this;

	ctrl.loginMode = false;
	ctrl.username = '';
	ctrl.password = '';

	ctrl.clearLogin = function() {
		ctrl.username = '';
		ctrl.password = '';
	};

	// If a connection is running, terminate it.
	commService.terminate();

	// If a users name & password is saved from a previous session, clear them.
	ctrl.clearLogin();

	// If a basic auth string is set from a previous session, then clear it.
	gatewayService.clearBasicAuthString();


	$ionicPlatform.ready(function() {
		$ionicSideMenuDelegate.canDragContent(false);
		if (!ionic.Platform.is('browser')) {
			window.screen.lockOrientation('portrait');
		}
		loadingService.loaderShowHome();
		// Wake up server if in idle mode.
		var promise = $timeout(function() {
			loadingService.loaderHide();
			window.plugins.toast.showWithOptions({
				message: languageService.getText('serverError'),
				duration: 'long',
				position: "bottom",
				styling: {
					opacity: 1,
					backgroundColor: '#53C6E6',
					textSize: 20,
					cornerRadius: 16,
					horizontalPadding: 20,
					verticalPadding: 16
				}
			});
		}, 60000);
		gatewayService.getPublicVideos(function() {
			$timeout(function() {
				loadingService.loaderHide();
				$timeout.cancel(promise);
			}, 2000);
		});
	});

	ctrl.enterLobby = function() {
		loadingService.loaderShowLobby();
		$state.go('lobby');
		window.screen.unlockOrientation();
	};

	ctrl.login = function() {
		gatewayService.acquireBasicAuthString(ctrl.username, ctrl.password, function(isAuthenticated) {
			if (isAuthenticated) {
				gatewayService.getUserData();
				$state.go('admin');
			} else {
				window.plugins.toast.showWithOptions({
					message: languageService.getText('loginError'),
					duration: 'long',
					position: "bottom",
					styling: {
						opacity: 1,
						backgroundColor: '#53C6E6',
						textSize: 20,
						cornerRadius: 16,
						horizontalPadding: 20,
						verticalPadding: 16
					}
				});
			}
		});
	};
};

angular.module('wdvr-mobile').controller('HomeCtrl', homeCtrl);
