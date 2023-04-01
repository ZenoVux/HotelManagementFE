app.controller("checkoutCtrl", function ($scope, $routeParams, $location, $http) {

    const roomCodes = $routeParams.roomCode.split("-");
    $scope.checkoutRoom = {};
    $scope.booking = null;

    $scope.init = async function () {
        if (roomCodes.length <= 0) {
            $location.path("/");
        }
        roomCodes.forEach(async function (roomCode) {
            $scope.checkoutRoom[roomCode] = {}
            await $scope.loadBookingDetail(roomCode);
            await $scope.loadUsedServices(roomCode, $scope.checkoutRoom[roomCode].bookingDetail);


            if (!$scope.booking) {
                $scope.booking = $scope.checkoutRoom[roomCode].bookingDetail.booking;
            }
        });
        // await $scope.loadBookingDetail();
        // await $scope.loadUsedServices();
    }

    $scope.loadBookingDetail = async function (roomCode) {
        await $http.get("http://localhost:8000/api/booking-details/checkout-room/" + roomCode).then(function (resp) {
            $scope.checkoutRoom[roomCode].bookingDetail = resp.data;
        }, function () {
            delete $scope.checkoutRoom[roomCode];
        });
    }

    $scope.loadUsedServices = async function (roomCode, bookingDetail) {
        await $http.get("http://localhost:8000/api/used-services/booking-detail-code/" + bookingDetail.code).then(function (resp) {
            $scope.checkoutRoom[roomCode].usedServices = resp.data;
        });
    }

    $scope.totalUsedService = function (usedServices) {
        if (!usedServices) {
            return 0;
        }
        return usedServices.reduce((total, usedService) => total + (usedService.serviceRoom.price * usedService.quantity), 0);
    }

    $scope.getDate = function (bookingDetail) {
        if (!bookingDetail) {
            return 0;
        }
        const now = new Date();
        const checkin = new Date(bookingDetail.checkinExpected);
        return now.getDate() - checkin.getDate();
    }

    $scope.totalRoom = function (bookingDetail) {
        if (!bookingDetail) {
            return 0;
        }
        return bookingDetail.room.price * $scope.getDate(bookingDetail);
    }

    $scope.total = function (bookingDetail, usedServices) {
        if (!usedServices || !bookingDetail) {
            return 0;
        }
        return $scope.totalUsedService(usedServices) + $scope.totalRoom(bookingDetail);
    }

    $scope.checkout = function() {
        console.log("checkout", roomCodes);
        $http.post("http://localhost:8000/api/rooms/checkout", roomCodes).then(function (resp) {
            const invoice = resp.data;
            alert("Trả phòng thành công!");
            $location.path("/invoices/" + invoice.code);
        }, function () {
            alert("Trả phòng thất bại!");
        });
    }

    $scope.init();
});