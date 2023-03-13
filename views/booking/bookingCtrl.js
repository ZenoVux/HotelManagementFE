app.controller("bookingCtrl", function ($scope, $http) {

    $scope.booking = {};
    $scope.booking.checkinDate;
    $scope.booking.checkoutDate;
    $scope.loading = false;
    $scope.customer = [];

    $scope.formData = {};
    $scope.currentSection = 0;

    $scope.nextSection = function () {
        $scope.currentSection++;
    };

    $scope.prevSection = function () {
        $scope.currentSection--;
    };

    $scope.submitForm = function () {
        // submit form data
    };

    $scope.checkRoom = function () {
        var today = new Date();

        if ($scope.booking.roomType === undefined) {
            $scope.booking.roomType = '';
        }

        if ($scope.booking.checkinDate == null || $scope.booking.checkoutDate == null) {
            alert('Hãy chọn ngày check-in, check-out!.');
        } else if ($scope.booking.checkinDate < today.setDate(today.getDate() - 1)) {
            alert('Ngày check-in được tính từ ngày hôm nay.');
        } else if ($scope.booking.checkoutDate < $scope.booking.checkinDate) {
            alert('Ngày check-out phỉa sau ngày check-in.');
        } else {
            $scope.loading = true;
            $http.get('http://localhost:8000/api/bookings/info', {
                params: {
                    checkinDate: $scope.booking.checkinDate,
                    checkoutDate: $scope.booking.checkoutDate,
                    roomType: $scope.booking.roomType
                }
            }).then(function (response) {
                $scope.bookings = response.data;
                console.log($scope.bookings);
                $scope.loading = false;
            }).catch(function (error) {
                console.error('Error fetching data:', error);
                $scope.loading = false;
            });
        }
    };

    $scope.updateSelectedRooms = function (info) {
        var selectedCount = 0;
        angular.forEach(info.listRooms, function (room) {
            if (room.selected) {
                selectedCount++;
            }
        });
        info.roomCount = selectedCount;
    };

    $scope.getBookings = function () {
        var selectedRooms = [];
        for (var i = 0; i < $scope.bookings.length; i++) {
            var info = $scope.bookings[i];
            for (var j = 0; j < info.listRooms.length; j++) {
                var room = info.listRooms[j];
                if (room.selected) {
                    selectedRooms.push(room);
                }
            }
        }
        // Log the selected rooms
        console.log(selectedRooms);
        console.log($scope.customer);


        // Redirect to booking page with selectedRooms as query parameter
        var url = '#!/booking?selectedRooms=' + encodeURIComponent(JSON.stringify(selectedRooms));
        //  window.location.href = url;
    }

    $scope.init = function () {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/room-types").then(function (resp) {
            $scope.roomTypes = resp.data;
        }).catch(function (error) {
            console.error('Error fetching data room type:', error);
        });

        $http.get('http://localhost:8000/api/bookings/info', {
            params: {
                checkinDate: new Date(1990, 1, 1),
                checkoutDate: new Date(1990, 1, 1),
                roomType: ''
            }
        }).then(function (response) {
            $scope.bookings = response.data;
            $scope.loading = false;
        }).catch(function (error) {
            console.error('Error fetching data booking:', error);
            $scope.loading = false;
        });

    }
    $scope.init();

});