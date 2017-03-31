var lobbyService = function($timeout, $ionicPlatform) {
	var service = this;

	var hackfuse = '';
	var fuseLength = 2000;
	var focus = '';
	var selectedVideo = '';

	service.toPreview = '';

	service.playVideo = undefined;
	service.pauseVideo = undefined;
	service.stopVideo = undefined;
	service.prev = undefined;
	service.next = undefined;

	function cancelFuse() {
		if (hackfuse) {
			$timeout.cancel(hackfuse);
		}
	}

	AFRAME.registerComponent('hackursor', {
		init: function() {
			this.el.addEventListener('mouseenter', function(event) {
				var thisEl = this;
				var intersected = event.detail.intersectedEl;
				if (intersected.className.includes('clickable')) {
					focus = intersected;
					thisEl.emit('cursortrigger');
					intersected.emit('cursortrigger');
					cancelFuse();
					hackfuse = $timeout(function() {
						thisEl.emit('hackevent');
                        intersected.emit('hackevent');
					}, fuseLength);
				}
			});

			this.el.addEventListener('mouseleave', function(event) {
				if (focus) {
					this.emit('cursorabort');
					focus.emit('cursorabort');
					focus = '';
					cancelFuse();
				}
			});
		}
	});

	AFRAME.registerComponent('target', {
		init: function() {
			var getFrame = this.getFrame;
			this.el.addEventListener('cursortrigger', function(event) {
				var frameElement = getFrame(event.target.id);
				frameElement.emit('focusstart');
			});
			this.el.addEventListener('cursorabort', function(event) {
				var videoId = event.target.id;
				if (selectedVideo.id !== videoId) {
					var frameElement = getFrame(videoId);
					frameElement.emit('focusend');
				}
			});
			this.el.addEventListener('hackevent', function(event) {
				var videoId = event.target.id;
				if (selectedVideo) {
					if (selectedVideo.id !== videoId) {
						var frameElement = getFrame(selectedVideo.id);
						frameElement.emit('focusend');
					}
				}
				var playButton = document.querySelector('#lobby-play-button');
				playButton.setAttribute('visible', true);
				selectedVideo = event.target;
			});
		},
		getFrame: function(videoId) {
			var frameId = 'frame' + videoId.substring('video'.length);
			return document.querySelector('#' + frameId);
		}
	});

	// Lobby play video control
	AFRAME.registerComponent('lobby-play-button', {
		init: function() {
			this.el.addEventListener('hackevent', function(event) {
				var id = selectedVideo.id;
				var index = parseInt(id.substring(id.length - 2, id.length));
				service.playVideo(index);
			});
		}
	});

	// In-video controls
	AFRAME.registerComponent('control-button', {
		init: function() {
			this.el.addEventListener('hackevent', function(event) {
				var input = event.target.id;
				if (input === 'buttons-play-pause') {
					service.pauseVideo();
				} else {
					service.stopVideo();
				}
			});
		}
	});

	AFRAME.registerComponent('button-prev', {
		init: function() {
			this.el.addEventListener('hackevent', function(event) {
				service.prev();
			});
		}
	});

	AFRAME.registerComponent('button-next', {
		init: function() {
			this.el.addEventListener('hackevent', function(event) {
				service.next();
			});
		}
	});

};

angular.module('wdvr-mobile').service('lobbyService', lobbyService);
