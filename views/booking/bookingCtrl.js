app.controller("bookingCtrl", function ($scope, $http) {

    $scope.booking = {};
    $scope.booking.checkinDate;
    $scope.booking.checkoutDate;
    $scope.booking.roomCount = 1;
    $scope.booking.adults = 2;
    $scope.booking.children = 0;

    $scope.checkRoom = function () {
        var today = new Date();

        if ($scope.booking.checkinDate == null || $scope.booking.checkoutDate == null) {
            alert('Please select check-in and check-out dates.');
        } else if ($scope.booking.checkinDate < today.setDate(today.getDate() - 1)) {
            alert('Check-in date must be after today.');
        } else if ($scope.booking.checkoutDate < $scope.booking.checkinDate) {
            alert('Check-out date must be after check-in date.');
        } else {
            alert($scope.booking.checkinDate + " " + $scope.booking.checkoutDate + " " + $scope.booking.roomCount + " " + $scope.booking.adults + " " + $scope.booking.children);
        }

    };

    $scope.closeDropdown = function () {
        $('.dropdown-menu').removeClass('show');
    };

    $scope.init = function () {
        $http.get("http://localhost:8000/api/bookings/rooms").then(function (resp) {
            $scope.roomBookings = resp.data;
            console.log($scope.roomBookings);
        });
    }
    $scope.init();
});
