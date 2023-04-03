app.controller("settingCtrl", function ($scope, $http) {

    $scope.setting = {};
    $scope.surcharge = {};
    $scope.earlyCheckinSurcharges = [];
    $scope.lateCheckoutSurcharges = [];

    $scope.init = function () {
        $scope.loadSetting();
        $scope.loadEarlyCheckinSurcharge();
        $scope.loadLateCheckoutSurcharge();
    }

    $scope.loadSetting = function () {
        $http.get("http://localhost:8000/api/settings").then(function (resp) {
            $scope.setting = resp.data;
            $scope.setting.checkinTime = new Date($scope.setting.checkinTime);
            $scope.setting.checkoutTime = new Date($scope.setting.checkoutTime);
        });
    }

    $scope.loadEarlyCheckinSurcharge = function () {
        $http.get("http://localhost:8000/api/surcharges/early-checkin").then(function (resp) {
            $scope.earlyCheckinSurcharges = resp.data;
        });
    }

    $scope.loadLateCheckoutSurcharge = function () {
        $http.get("http://localhost:8000/api/surcharges/late-checkout").then(function (resp) {
            $scope.lateCheckoutSurcharges = resp.data;
        });
    }

    $scope.handlerUpdateSetting = function () {
        if (!confirm("Bạn muốn cập nhật cấu hình giờ?")) {
            return;
        }
        $http.post("http://localhost:8000/api/settings", $scope.setting).then(function (resp) {
            $scope.setting = resp.data;
            $scope.setting.checkinTime = new Date($scope.setting.checkinTime);
            $scope.setting.checkoutTime = new Date($scope.setting.checkoutTime);
            alert("Cập nhật cấu hình thành công?")
        });
    }

    $scope.init();
});