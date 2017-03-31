var libraryCtrl = function($state, $ionicPlatform, lobbyService, gatewayService, commService) {
	var ctrl = this;

	ctrl.videos;
	ctrl.hasSlave = commService.hasSlave;

	window.screen.lockOrientation('portrait');

    console.log(gatewayService.getUserGroupId());

	gatewayService.getVideos(gatewayService.getUserGroupId(), function(videoData) {
		ctrl.videos = videoData;
	});

	ctrl.cast = function(video) {
		commService.execute('start ' + video.VideodataUrl);
		$state.go('remote');
	};

	ctrl.preview = function(video) {
		window.screen.unlockOrientation();
		//lobbyService.toPreview = video.VideodataUrl;
		$state.go('preview');
	};

	ctrl.expand = function(event) {
		var chosen = event.target;
		if (!chosen.className.includes('video-item-expanded')) {
			// Collapse expanded item.
			var expanded = document.querySelector('.video-item-expanded');
			if (expanded) {
				expanded.className = expanded.className.replace('video-item-expanded', 'video-item');
			}
			// Expand chosen item.
			if (chosen.className.includes('video-item')) {
				chosen.className = chosen.className.replace('video-item', 'video-item-expanded');
			}
		}
	};

};

angular.module('wdvr-mobile').controller('LibraryCtrl', libraryCtrl);
