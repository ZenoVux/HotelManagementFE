app.controller("settingCtrl", function ($scope, $http) {

    $scope.setting = {};

    $scope.init = function () {
        $http.get("http://localhost:8000/api/settings").then(function (resp) {
            $scope.setting = resp.data;
            $scope.setting.checkinTime = new Date($scope.setting.checkinTime);
            $scope.setting.checkoutTime = new Date($scope.setting.checkoutTime);
        });
    }

    $scope.update = function () {
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