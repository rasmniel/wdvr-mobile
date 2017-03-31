var commService = function($timeout, $ionicPlatform, $cordovaDevice) {
	var comm = this;

	var socket;
    var timeoutDuration = 10;
    var serverUrl = 'https://lab-rasmniel.c9users.io/';
    //var serverUrl = 'http://wdvr-admin.azurewebsites.net/';
    var identity = {
		name: undefined,
		uuid: undefined,
		model: undefined,
		internalIp: undefined,
		isControl: false
	};

	comm.connected = false;
	comm.internalSlaveIp;

	$ionicPlatform.ready(function() {
		identity.name = cordova.plugins.deviceName.name;
		identity.uuid = $cordovaDevice.getUUID();
		console.log('commService uuid', identity.uuid);
		identity.model = $cordovaDevice.getModel();
		networkinterface.getIPAddress(function(ip) {
			identity.internalIp = ip;
		});
	});

	comm.terminate = function() {
		if (socket) {
			socket.disconnect();
		}
		comm.connected = false;
	};

	comm.broadcast = function(isControl, callback) {
		// If socket exists, disconnect first.
		comm.terminate();
		// Connect to the server and assess connection.
		identity.isControl = isControl || false;
		socket = io.connect(serverUrl);
		socket.on('connect', function() {
			console.log('Service connected', socket.connected);
			socket.emit('identity', identity);
			if (callback) {
				socket.on('identityConfirm', callback);
			}
			comm.connected = socket.connected;
		});
		// If there is no connection within a duration, fire timeout.
		$timeout(function() {
			if (!comm.connected) {
				console.error('Socket not connected after ' + timeoutDuration + ' seconds.');
			}
		}, timeoutDuration * 1000);
	};

	comm.inquire = function(callback) {
		socket.emit('inquire');
		socket.on('list', function(listeners) {
			// Asynchronously return array of listening devices.
			callback(listeners);
		});
	};

	comm.control = function(device, callback) {
		socket.emit('control', device.uuid);
		if (callback) {
			socket.on('controlConfirm', function(device) {
				comm.internalSlaveIp = device.internalIp;
				callback(device);
			});
		}
	};

	comm.execute = function(command) {
		socket.emit('execute', command);
	};

	comm.listen = function(onCommand) {
		socket.on('command', onCommand);
	};

	comm.hasSlave = function() {
		return comm.internalSlaveIp != undefined;
	};
};

angular.module('wdvr-mobile').service('commService', commService);
