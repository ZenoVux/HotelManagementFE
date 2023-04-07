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

    $scope.modalEdit = async function (action) {
        $('#modal-edit').modal(action);
    }

    $scope.getTotalService = function (usedService) {
        const startedTime = new Date(usedService.startedTime);
        startedTime.setHours(0, 0, 0, 0);
        const endedTime = new Date(usedService.endedTime);
        endedTime.setHours(0, 0, 0, 0);
        const days = (endedTime.getTime() - startedTime.getTime())  / (1000 * 3600 * 24);
        return usedService.servicePrice * days;
    }

    $scope.totalUsedService = function () {
        if (!$scope.usedServices) {
            return 0;
        }
        return $scope.usedServices.reduce((total, usedService) => total + $scope.getTotalService(usedService), 0);
    }

    $scope.getDate = function () {
        if (!$scope.invoiceDetail) {
            return 0;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const checkinExpected = new Date($scope.invoiceDetail.checkinExpected);
        checkinExpected.setHours(0, 0, 0, 0);
        const checkoutExpected = new Date($scope.invoiceDetail.checkoutExpected);
        checkoutExpected.setHours(0, 0, 0, 0);
        if (now.getTime() === checkinExpected.getTime()) {
            return 1;
        } else if (now.getTime() > checkoutExpected.getTime()) {
            return (checkoutExpected.getTime() - checkinExpected.getTime())  / (1000 * 3600 * 24);
        } else {
            return (now.getTime() - checkinExpected.getTime())  / (1000 * 3600 * 24);
        }
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
        return $scope.totalUsedService() + $scope.totalRoom() - $scope.invoiceDetail.deposit;
    }

    $scope.checkout = function() {
        if (!confirm("Bạn muốn trả phòng " + $routeParams.roomCode +  "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/checkout", {
            code: $routeParams.roomCode
        }).then(function (resp) {
            alert("Trả phòng thành công!");
            $location.path("/invoices/" + $scope.invoiceDetail.invoice.code);
        }, function () {
            alert("Trả phòng thất bại!");
        });
    }

    $scope.init();
});