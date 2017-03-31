var gatewayService = function($http) {
	var service = this;

	var api = 'https://wdvr-api.azurewebsites.net/api/';
	var basicAuthString;
	var activeUser;

	service.clearBasicAuthString = function() {
		basicAuthString = '';
		$http.defaults.headers.common['Authorization'] = undefined;
		activeUser = undefined;
	};

	service.acquireBasicAuthString = function(username, password, callback) {
		if (!username || !password) {
			callback(false);
			return;
		}
		$http({
			method: 'GET',
			url: api + 'basicauthstring/' + username + '/' + password
		}).then(function(result) {
			if (result.data) {
				basicAuthString = result.data;
				$http.defaults.headers.common['Authorization'] = basicAuthString;
				callback(true);
			} else {
				callback(false);
			}
		});
	};

	service.getUserData = function() {
		$http({
			method: 'GET',
			url: api + 'userbyauth/' + basicAuthString
		}).then(function(result) {
			if (result.status == 200) {
				activeUser = result.data;
				console.log('User data after login ->', activeUser);
			}
		});
	};

	service.getVideos = function(groupId, callback) {
		$http({
			method: 'GET',
			url: api + 'UserVideoMetadatas'
		}).then(function(result) {
			if (result.status == 200) {
				callback(result.data);
			}
		});
	};

	service.getPublicVideos = function(callback) {
		service.acquireBasicAuthString('lobby', 'lobby', function(success) {
			if (success) {
				$http({
					method: 'GET',
					url: api + 'publicvideometadatas'
				}).then(function(result) {
					if (result.status == 200) {
						callback(result.data);
					}
				});
			} else {
				console.log('Could not get public videos', success);
			}
		});
	};

	service.getUsername = function() {
		if (activeUser) {
			// console.log('gatewayService getUsername()', activeUser.Username);
			return activeUser.Username;
		}
	};

	service.getUserGroupId = function() {
		if (activeUser) {
			// console.log('gatewayService getUserGroupId()', activeUser.GroupId);
			return activeUser.GroupId;
		}
	};
};

angular.module('wdvr-mobile').service('gatewayService', gatewayService);
