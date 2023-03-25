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
        return $scope.usedServices.reduce((total, usedService) => total + (usedService.serviceRoom.price * usedService.quantity), 0);
    }

    $scope.getDate = function () {
        if (!$scope.invoiceDetail) {
            return 0;
        }
        const checkout = new Date($scope.invoiceDetail.invoice.booking.checkoutExpected);
        const checkin = new Date($scope.invoiceDetail.invoice.booking.checkinExpected);
        return checkout.getDate() - checkin.getDate();
    }

    $scope.totalRoom = function () {
        if (!$scope.invoiceDetail) {
            return 0;
        }
        return $scope.invoiceDetail.room.price * $scope.getDate();
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
        $http.post("http://localhost:8000/api/hotel/checkout", $routeParams.roomCode).then(function (resp) {
            const invoice = resp.data;
            alert("Trả phòng thành công!");
            $location.path("/invoices/" + invoice.code);
        }, function () {
            alert("Trả phòng thất bại!");
        });
    }

    $scope.init();
});