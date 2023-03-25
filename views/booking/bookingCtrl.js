app.controller("listBookingCtrl", function ($scope, $http) {

    $scope.loading = false;
    $scope.showBookingTable = true;
    $scope.showCustomerTable = false;
    $scope.showConfirmedTable = false;
    $scope.showPendingTable = false;
    $scope.currentTable = 0;

    $scope.init = function () {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/bookings").then(function (resp) {
            $scope.bookings = resp.data;
            $(document).ready(function () {
                $('#bookingTable').DataTable();
            });
            $(document).ready(function () {
                $('#confirmedTable').DataTable();
            });
            $(document).ready(function () {
                $('#pendingTable').DataTable();
            });
            $scope.loading = false;
        }).catch(function (error) {
            console.error('Error fetching data:', error);
            $scope.loading = false;
        });
    }
    $scope.init();

    $scope.setFalseAllTable = function () {
        $scope.showBookingTable = false;
        $scope.showCustomerTable = false;
        $scope.showConfirmedTable = false;
        $scope.showPendingTable = false;
    }

    $scope.resetAllCard = function () {
        var cards = document.querySelectorAll('.card.booking-header');
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.backgroundColor = 'white';
            cards[i].style.color = 'black';
        }
    }

    $scope.toggleTable = function (tableId) {
        $scope.setFalseAllTable();
        switch (tableId) {
            case 'bookingTable':
                $scope.currentTable = 0;
                $scope.showBookingTable = true;
                $scope.resetAllCard();
                var card = document.querySelector('.card.booking-header.booking');
                card.style.backgroundColor = '#0d6efd';
                card.style.color = 'white';
                break;
            case 'customerTable':
                $scope.currentTable = 1;
                $scope.showCustomerTable = true;
                $scope.resetAllCard();
                var card = document.querySelector('.card.booking-header.customer');
                card.style.backgroundColor = '#6c757d';
                card.style.color = 'white';
                break;
            case 'confirmedTable':
                $scope.currentTable = 2;
                $scope.showConfirmedTable = true;
                $scope.resetAllCard();
                var card = document.querySelector('.card.booking-header.confirmed');
                card.style.backgroundColor = '#198754';
                card.style.color = 'white';
                break;
            case 'pendingTable':
                $scope.currentTable = 3;
                $scope.showPendingTable = true;
                $scope.resetAllCard();
                var card = document.querySelector('.card.booking-header.pending');
                card.style.backgroundColor = '#dc3545';
                card.style.color = 'white';
                break;
        }
    };

    $scope.viewBooking = function (booking) {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/bookings/" + booking.code).then(function (resp) {
            $scope.bookingInfo = resp.data;
            console.log($scope.bookingInfo);
            $('#booking-modal').modal('show');
            $scope.loading = false;
        }).catch(function (error) {
            console.error('Error fetching data:', error);
            $scope.loading = false;
        });
    };

});

app.controller("createBookingCtrl", function ($scope, $http) {

    $scope.booking = {};
    $scope.customer = {};
    $scope.loading = false;
    $scope.currentSection = 0;
    $scope.rooms = [];
    $scope.totalPrice = 0;

    $scope.nextSection = function () {
        $scope.currentSection++;
    };

    $scope.prevSection = function () {
        $scope.currentSection--;
    };

    $scope.init = function () {
        $scope.loading = true;

        //bookingsInfo
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

        //roomTypes
        $http.get("http://localhost:8000/api/room-types").then(function (resp) {
            $scope.roomTypes = resp.data;
        }).catch(function (error) {
            console.error('Error fetching data room type:', error);
        });

        //services
        $http.get("http://localhost:8000/api/services").then(function (resp) {
            $scope.services = resp.data;
            console.log($scope.services);
        }).catch(function (error) {
            console.error('Error fetching data service:', error);
        });

        //paymentMethods
        $http.get("http://localhost:8000/api/payment-methods").then(function (resp) {
            $scope.paymentMethods = resp.data;
            console.log($scope.paymentMethods);
        }).catch(function (error) {
            console.error('Error fetching data payment method:', error);
        });

    }
    $scope.init();

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
                $scope.loading = false;
            }).catch(function (error) {
                console.error('Error fetching data:', error);
                $scope.loading = false;
            });
        }
    };

    $scope.updateSelectedRooms = function (info) {
        $scope.totalPrice = 0;
        $scope.rooms = [];
        var selectedCount = 0;
        angular.forEach(info.listRooms, function (room) {
            if (room.selected) {
                selectedCount++;
            }
        });
        info.roomCount = selectedCount;
        for (var i = 0; i < $scope.bookings.length; i++) {
            var info = $scope.bookings[i];
            for (var j = 0; j < info.listRooms.length; j++) {
                var room = info.listRooms[j];
                if (room.selected) {
                    $scope.rooms.push(room);
                    $scope.totalPrice += room.price;
                    $scope.deposit = $scope.totalPrice * 0.1;
                }
            }
        }
    };

    $scope.getBookings = function () {

        console.log($scope.rooms);
        console.log($scope.rooms.length);
        console.log("Name: " + $scope.customer.fullName);
        console.log("Gender: " + $scope.customer.gender);
        console.log("dateOfBirth: " + $scope.customer.dateOfBirth);
        console.log("peopleId: " + $scope.customer.peopleId);
        console.log("address: " + $scope.customer.address);
        console.log("placeOfBirth: " + $scope.customer.placeOfBirth);
        console.log("phoneNumber: " + $scope.customer.phoneNumber);
        console.log("email: " + $scope.customer.email);
        $http.post('http://localhost:8000/api/bookings', {
            customer: $scope.customer,
            rooms: rooms,
            checkinExpected: $scope.booking.checkinDate,
            checkoutExpected: $scope.booking.checkoutDate,
            note: "note"
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error('Error fetching data:', error);
        });

    }

});