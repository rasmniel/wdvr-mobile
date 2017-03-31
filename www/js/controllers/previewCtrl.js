var previewCtrl = function($ionicHistory, lobbyService, $timeout) {

	var video = document.querySelector('#preview-video');
	var buttonsPlayPauseControl = document.querySelector('#buttons-play-pause');

	(function init() {
		video.src = lobbyService.toPreview;
		video.onended = stopVideo;
		lobbyService.pauseVideo = pauseVideo;
		lobbyService.stopVideo = stopVideo;
	})();

	function pauseVideo() {
		if (video.paused) {
			buttonsPlayPauseControl.setAttribute('src', '#button-pause');
			video.play();
		} else {
			buttonsPlayPauseControl.setAttribute('src', '#button-play');
			video.pause();
		}
	}

	function stopVideo() {
		video.pause();
		video.currentTime = 0;
		$ionicHistory.goBack();
	}
};

angular.module('wdvr-mobile').controller('PreviewCtrl', previewCtrl);
