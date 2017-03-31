var adminCtrl = function ($interval, $scope, $timeout, $state, gatewayService, commService) {
    var ctrl = this;

    ctrl.go = $state.go;
    ctrl.listeners = [];
    ctrl.slaveUuid = '';

    ctrl.getUsername = function () {
        return gatewayService.getUsername();
    };

    commService.broadcast(true, function () {
        $interval(function () {
            if ($state.current.name == 'admin') {
                commService.inquire(function (listeners) {
                    ctrl.listeners = listeners;
                });
            }
        }, 5000);
    });

    ctrl.setSlave = function (slave) {
        commService.control(slave, function (device) {
            ctrl.slaveUuid = device.uuid;
            $scope.$digest();
            console.log('Control confirmed', device);
            // Perhaps implement 'notify' call for connection confirmation instead of 'execute'?
            // commService.execute('Connected with control.');
        });
    };
};

angular.module('wdvr-mobile').controller('AdminCtrl', adminCtrl);
