var lobbyCtrl = function($timeout, $ionicPlatform, lobbyService, gatewayService, commService, loadingService) {

	window.screen.lockOrientation('landscape');

	var camera = document.querySelector('#main-camera');
	var lobby = document.querySelector('#lobby-content');
	var video = document.querySelector('#video');
	var videosphere = '';
	var buttonsControlFrame = document.querySelector('#buttons-control-frame');
	var buttonsPlayPauseControl = document.querySelector('#buttons-play-pause');
	var lobbyPlayButton = document.querySelector('#lobby-play-button');

	const PANEL_CAPACITY = 4;
	// videos array will appear two-dimensional when data has been loaded.
	var videos = [];
	var pageIndex = 0;

	$ionicPlatform.ready(function() {
		lobbyService.playVideo = playVideo;
		lobbyService.pauseVideo = pauseVideo;
		lobbyService.stopVideo = stopVideo;
		lobbyService.prev = showPreviousVideos;
		lobbyService.next = showNextVideos;
		video.onended = stopVideo;
	});

	// Broadcast as a slave and assign command event handler.
	commService.broadcast(false, function() {
		// Listen for incoming command.
		commService.listen(function(command) {
			// On command, split string into array.
			command = command.split(' ');
			if (command.length > 1 && command[0] === 'start') {
				// If start command were issued, play url argument.
				console.log('Received command array', command);
                playUrl(command[1]);
				// Do not display controls & cursor during slave playback.
				buttonsControlFrame.setAttribute('visible', false);
				camera.setAttribute('visible', false);
			} else if (command.length === 1) {
				// If only a single command were issued.
				console.log('Received command', command[0]);
				if (command[0] === 'stop') {
					// Stop video.
					stopVideo();
					console.log('Stop video.');
				} else if (command[0] === 'pause') {
					// Toggle play/pause.
					pauseVideo();
				}
			}
		});
	});

	gatewayService.getPublicVideos(function(videoData) {
		// Sort the videos into pages of four.
		for (var i = 0; i < videoData.length; i += PANEL_CAPACITY) {
			var page = [];
			for (var j = 0; j < PANEL_CAPACITY; j++) {
				var v = videoData[i + j];
				if (v) {
					page.push(v);
				}
			}
			videos.push(page);
		}
		//console.log('Paged videos:', videos);
		// Add the first video page to the display frame.
		displayPage();
	});

	// Display next videos page, if less than 4 videos, hide missing ThumbnailImageUrl & video frame.
	function displayPage() {
		for (var i = 0; i < PANEL_CAPACITY; i++) {
			var v = videos[pageIndex][i];
			var thumb = document.querySelector('#video0' + i);
			if (v) {
				// console.log('video thumbnail url', v);
				thumb.setAttribute('visible', true);
				thumb.setAttribute('src', v.ThumbnailImageUrl);
			} else {
				thumb.setAttribute('visible', false);
			}
		}
	}

	function playVideo(index) {
		// Play video url chosen by index.
		playUrl(videos[pageIndex][index].VideodataUrl);
	}

	function playUrl(url) {
		video.src = url;
		// Display the playback video.
		lobby.setAttribute('visible', false);
		buttonsControlFrame.setAttribute('visible', true);
        if (videosphere) {
            document.querySelector('a-scene').removeChild(videosphere);
        }
		videosphere = document.createElement('a-videosphere');
		videosphere.setAttribute('src', '#video');
		document.querySelector('a-scene').appendChild(videosphere);
		video.play();
	}

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
		video.src = '';
		videosphere.setAttribute('visible', false);
		document.querySelector('a-scene').removeChild(videosphere);
        videosphere = '';
		camera.setAttribute('visible', true);
		buttonsControlFrame.setAttribute('visible', false);
		buttonsPlayPauseControl.setAttribute('src', '#button-pause');
		resetSelection();
		lobby.setAttribute('visible', true);
	}

	function resetSelection() {
		lobbyPlayButton.setAttribute('visible', false);
		for (var i = 0; i < PANEL_CAPACITY; i++) {
			var frame = document.querySelector('#frame0' + i);
			frame.emit('focusend');
		}
	}

	function showPreviousVideos() {
		if (pageIndex == 0) {
			pageIndex = videos.length;
		}
		pageIndex--;
		resetSelection();
		displayPage();
	}

	function showNextVideos() {
		pageIndex++;
		if (pageIndex >= videos.length) {
			pageIndex = 0;
		}
		resetSelection();
		displayPage();
	}

	// AFRAME black screen fix.
	var scene = document.querySelector('a-scene');

	scene.addEventListener('loaded', function(event) {
		console.log('loaded');
		// Unhide modal window, change background image, and remove top-left corner X button.
		var modal = angular.element(document.querySelector('.a-orientation-modal'));
		modal.removeClass('a-hidden');
		modal.css('background', 'url(img/vr-modal.png)');
		modal.css('background-size', 'cover');
		modal.empty();
		// Bring VR mode button on top.
		angular.element(document.querySelector('.a-enter-vr')).css('z-index', '10000000');
		// Leverage click on enter vr button to exit VR mode, if black screen occurs.
		var enterVrButton = document.querySelector('.a-enter-vr-button');
		if (enterVrButton) {
			enterVrButton.addEventListener('click', function(event) {
				console.log('vr-mode click');
				verifyCanvasWidth();
			});
		} else {
			console.warn('VR button not found on loaded event!');
		}
		loadingService.loaderHide();
	});

	var verifyCanvasWidth = function() {
		$timeout(function() {
			var width = getCanvasWidth();
			//console.log('Canvas width:', width);
			if (width <= 0) {
				console.warn('Exiting VR mode to relieve black screen bug.');
				scene.exitVR();
			}
		}, 2000);
	};

	var getCanvasWidth = function() {
		var wrapper = document.querySelector('.webvr-polyfill-fullscreen-wrapper');
		if (wrapper) {
			var width = wrapper.children[0].style.width;
			return width.substring(0, width.length - 2);
		} else {
			console.warn('Polyfill fullscreen wrapper not found.');
		}
	};
};

angular.module('wdvr-mobile').controller('LobbyCtrl', lobbyCtrl);
