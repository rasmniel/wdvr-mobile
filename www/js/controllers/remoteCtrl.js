var remoteCtrl = function($ionicPlatform, $state, $timeout, $ionicHistory, $scope, commService) {
	var ctrl = this;

	var buttonPlayPauseImg = $('#btn-play-pause-img')[0];

	window.screen.lockOrientation('landscape');

	var reenableBackButton = $ionicPlatform.registerBackButtonAction(function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log('register backbutton');
	}, 101);

	$scope.$on('$destroy', function() {
		reenableBackButton();
	});

	var remote = $('#remote-view');

    // Append protocol and port to the slave's internal ip.
	remote[0].src = 'http://' + commService.internalSlaveIp + ':8080';
    $timeout(function() {
		var container = remote.contents().find('#container');
		var screen = container.find('#screen');
		screen.detach();
		screen.prevObject.append(screen);
		container.find('#header').remove();
		screen.find('canvas').css('height', '100vh');
	}, 5000);

	ctrl.pausePlayback = function() {
		if (buttonPlayPauseImg.src.endsWith("pause.png")) {
			buttonPlayPauseImg.src = 'img/lobby/button-play-green.png';
		} else {
			buttonPlayPauseImg.src = 'img/lobby/button-pause.png';
		}
		commService.execute('pause');
	};

	ctrl.stopPlayback = function() {
		commService.execute('stop');
		$state.go('library');
	};
};

angular.module('wdvr-mobile').controller('RemoteCtrl', remoteCtrl);
