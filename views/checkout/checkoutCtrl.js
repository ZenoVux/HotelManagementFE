app.controller("checkoutCtrl", function ($scope, $routeParams, $location, $http) {

    $scope.invoiceDetail = null;
    $scope.usedServices = [];

    $scope.init = async function () {
        await $scope.loadInvoiceDetail();
        if ($scope.invoiceDetail) {
            await $scope.loadUsedServices();
        }
    }

    $scope.loadInvoiceDetail = async function () {
        await $http.get("http://localhost:8000/api/invoice-details/using-room/" + $routeParams.roomCode).then(function (resp) {
            $scope.invoiceDetail = resp.data;
            console.log("invoiceDetail", $scope.invoiceDetail);
        }, function () {
            alert("Có lỗi xảy ra vui lòng thử lại!");
            $location.path("/hotel-room");
        });
    }

    $scope.loadUsedServices = async function () {
        await $http.get("http://localhost:8000/api/used-services/invoice-detail/" + $scope.invoiceDetail.id).then(function (resp) {
            $scope.usedServices = resp.data;
        });
    }

    $scope.totalUsedService = function () {
        if (!$scope.usedServices) {
            return 0;
        }
        return $scope.usedServices.reduce((total, usedService) => total + (usedService.servicePrice * usedService.quantity), 0);
    }

    $scope.getDate = function () {
        if (!$scope.invoiceDetail) {
            return 0;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const checkinExpected = new Date($scope.invoiceDetail.checkinExpected);
        const checkoutExpected = new Date($scope.invoiceDetail.checkoutExpected);
        if (now > checkoutExpected) {
            return (checkoutExpected.getTime() - checkinExpected.getTime())  / (1000 * 3600 * 24);
        }
        return (now.getTime() - checkinExpected.getTime())  / (1000 * 3600 * 24);
    }

    $scope.totalRoom = function () {
        if (!$scope.invoiceDetail) {
            return 0;
        }
        return $scope.invoiceDetail.roomPrice * $scope.getDate();
    }

    $scope.total = function () {
        if (!$scope.usedServices || !$scope.invoiceDetail) {
            return 0;
        }
        return $scope.totalUsedService() + $scope.totalRoom();
    }

    $scope.checkout = function() {
        if (!confirm("Bạn muốn trả phòng " + $routeParams.roomCode +  "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/checkout", {
            code: $routeParams.roomCode
        }).then(function (resp) {
            const invoiceDetail = resp.data;
            alert("Trả phòng thành công!");
            $location.path("/invoices/" + invoiceDetail.invoice.code);
        }, function () {
            alert("Trả phòng thất bại!");
        });
    }

    $scope.init();
});