app.controller("listBookingCtrl", function ($scope, $http) {

    $scope.loading = false;
    $scope.showBookingTable = true;
    $scope.showCustomerTable = false;
    $scope.showConfirmedTable = false;
    $scope.showPendingTable = false;
    $scope.currentTable = 0;
    $scope.booking = {};
    $scope.booking.reasonCancel = "";

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

        $http.get("http://localhost:8000/api/customers/in-use").then(function (resp) {
            $scope.customersInUse = resp.data;
            $(document).ready(function () {
                $('#customerTable').DataTable();
            });
        }).catch(function (error) {
            console.error('Error fetching data:', error);
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
        $scope.currentBooking = booking;
        $scope.currentBooking.checkin = new Date(booking.checkin);
        $scope.currentBooking.checkout = new Date(booking.checkout);
        console.log(booking);
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

    $scope.cancelBooking = function () {
        var confirmationMessage = "Xác nhận huỷ booking " + $scope.currentBooking.code + "";
        if (window.confirm(confirmationMessage)) {
            $scope.currentBooking.note = $scope.currentBooking.note + " ----- Lí do huỷ: "
                + $scope.booking.reasonCancel + " ----- Người huỷ: Minh";
            $http.put("http://localhost:8000/api/bookings/cancel", $scope.currentBooking).then(function (resp) {
                $scope.booking.reasonCancel = "";
                $scope.init();
                $('#booking-modal').modal('hide');
            }).catch(function (error) {
                console.error('Error fetching data:', error);
            });
        }
    };

});

app.controller("createBookingCtrl", function ($scope, $http) {

    $scope.booking = {};
    $scope.booking.numAdults = 0;
    $scope.booking.numChildren = 0;
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

        $scope.customer.dateOfBirth = new Date($scope.customer.dateOfBirth);

        $scope.customer.gender == 1 ? $scope.customer.gender = true : $scope.customer.gender = false;

        console.log($scope.customer.gender);

        $http.post('http://localhost:8000/api/bookings', {
            customer: $scope.customer,
            rooms: $scope.rooms,
            numChildren: $scope.booking.numChildren,
            numAdults: $scope.booking.numAdults,
            checkinExpected: $scope.booking.checkinDate,
            checkoutExpected: $scope.booking.checkoutDate,
            paymentCode: $scope.booking.payment,
            note: $scope.booking.note,
        }).then(function (response) {
            if (response.status == 200) {
                alert('Đặt phòng thành công!');
            } else {
                alert('Đặt phòng thất bại!');
            }
            console.log(response);
        }).catch(function (error) {
            console.error('Error fetching data:', error);
        });

    }

});