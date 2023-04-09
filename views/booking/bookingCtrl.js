app.controller("listBookingCtrl", function ($scope, $http, $filter) {

    $scope.loading = false;
    $scope.showBookingTable = true;
    $scope.showCustomerTable = false;
    $scope.showConfirmedTable = false;
    $scope.showPendingTable = false;
    $scope.currentTable = 0;
    $scope.booking = {};
    $scope.addRoom = {};

    $scope.booking.reasonCancel = "";

    $scope.closeDropdown = function () {
        $('.dropdown-menu').removeClass('show');
    };

    $scope.init = function () {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/bookings").then(function (resp) {
            $scope.bookings = resp.data;
            console.log($scope.bookings);
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

        $http.get("http://localhost:8000/api/room-types").then(function (resp) {
            $scope.roomTypes = resp.data;
        }).catch(function (error) {
            console.error('Error fetching data room type:', error);
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
        console.log(booking);
        $http.get("http://localhost:8000/api/bookings/" + booking.code).then(function (resp) {
            $scope.bookingInfo = resp.data;
            for (var i = 0; i < $scope.bookingInfo.bkList.length; i++) {
                var bk = $scope.bookingInfo.bkList[i];
                bk.checkinExpected = new Date(bk.checkinExpected);
                bk.checkoutExpected = new Date(bk.checkoutExpected);
            }
            console.log($scope.bookingInfo);
            $('#booking-modal').modal('show');
            $scope.loading = false;
        }).catch(function (error) {
            console.error('Error fetching data:', error);
            $scope.loading = false;
        });
    };

    $scope.addRoom = function () {
        $scope.addRoom.adults = 2;
        $scope.addRoom.children = 0;
        $('#adđ-room-modal').modal('show');
    };

    $scope.clearDataTable = function () {
        $scope.addBookings = [];
    };

    $scope.checkRoom = function () {

        var today = new Date();

        if ($scope.addRoom.roomType === undefined) {
            $scope.addRoom.roomType = '';
        }

        if ($scope.addRoom.checkinDate == null || $scope.addRoom.checkoutDate == null) {
            alert('Hãy chọn ngày check-in, check-out!.');
        } else if ($scope.addRoom.checkinDate < today.setDate(today.getDate() - 1)) {
            alert('Ngày check-in được tính từ ngày hôm nay.');
        } else if ($scope.addRoom.checkoutDate < $scope.addRoom.checkinDate) {
            alert('Ngày check-out phỉa sau ngày check-in.');
        } else {
            $scope.loading = true;
            $http.get('http://localhost:8000/api/bookings/info', {
                params: {
                    checkinDate: $scope.addRoom.checkinDate,
                    checkoutDate: $scope.addRoom.checkoutDate,
                    roomType: $scope.addRoom.roomType
                }
            }).then(function (response) {
                $scope.addBookings = response.data;
                $scope.loading = false;
            }).catch(function (error) {
                console.error('Error fetching data:', error);
                $scope.loading = false;
            });
        }
    };

    $scope.updateSelectedRooms = function (info) {

        $scope.rooms = [];
        var numAdults = $scope.addRoom.adults;
        var numChildren = $scope.addRoom.children;
        var maxAdults = 0;
        var maxChildren = 0;
        for (var i = 0; i < $scope.addBookings.length; i++) {
            var info = $scope.addBookings[i];
            for (var j = 0; j < info.listRooms.length; j++) {
                var room = info.listRooms[j];
                if (room.selected) {
                    $scope.rooms.push(room);
                    maxAdults += room.numAdults;
                    maxChildren += room.numChilds;
                }
            }
        }

        if (numAdults > maxAdults && numChildren > maxChildren) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numAdults - maxAdults) + ' người lớn và ' + (numChildren - maxChildren) + ' trẻ em nữa!';
        } else if (numAdults > maxAdults) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numAdults - maxAdults) + ' người lớn nữa!';
        } else if (numChildren > maxChildren) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numChildren - maxChildren) + ' trẻ em nữa!';
        }
        else {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng đáp ứng đủ số lượng khách!';
        }

    };

    $scope.addRoomToBooking = function () {

        var formData = new FormData();

        const bookingDetailJson = JSON.stringify({
            bookingCode: $scope.currentBooking.code,
            checkinExpected: $filter('date')($scope.addRoom.checkinDate, 'dd-MM-yyyy'),
            checkoutExpected: $filter('date')($scope.addRoom.checkoutDate, 'dd-MM-yyyy'),
            note: $scope.addRoom.note,
            numAdults: $scope.addRoom.adults,
            numChilds: $scope.addRoom.children,
            rooms: $scope.rooms.map(room => {
                const { selected, $$hashKey, ...cleanedRoom } = room;
                return cleanedRoom;
            }),
        });

        formData.append('bookingDetailReq', bookingDetailJson);

        $http.post('http://localhost:8000/api/booking-details/add-bkd', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            if (response.status == 200) {
                $('#booking-modal').modal('hide');
                alert('Thêm phòng thành công!');
                $('#adđ-room-modal').modal('hide');
                viewBooking($scope.currentBooking);
            }
        }).catch(function (error) {
            console.error('Error fetching data:', error);
        });
    }

    $scope.editRoom = function (room) {
        alert("Edit room");
    };

    $scope.deleteRoom = function (room) {
        alert("Delete room");
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

app.controller("createBookingCtrl", function ($scope, $http, $location, $filter) {

    $scope.booking = {};
    $scope.booking.adults = 2;
    $scope.booking.children = 0;
    $scope.customer = {};
    $scope.frontIdResp = {};
    $scope.loading = false;
    $scope.currentSection = 0;
    $scope.rooms = [];
    $scope.totalPrice = 0;
    $scope.frontIdCardBase64 = null;
    $scope.backIdCardBase64 = null;
    $scope.frontIdCardDisplay = null;
    $scope.backIdCardDisplay = null;
    $scope.isFrontImageCaptured = false;

    $scope.closeDropdown = function () {
        $('.dropdown-menu').removeClass('show');
    };

    $scope.nextSection = function () {
        if ($scope.currentSection == 0) {
            if ($scope.rooms.length == 0) {
                alert("Vui lòng chọn phòng!");
                return;
            }
        }
        if ($scope.currentSection == 1) {
            if ($scope.frontIdCardDisplay == null
                || $scope.backIdCardDisplay == null
                || $scope.customer.phoneNumber == null
                || $scope.customer.email == null) {
                alert("Vui lòng nhập đủ thông tin khách hàng!");
                return;
            }
        }
        $scope.currentSection++;
    };

    $scope.prevSection = function () {
        $scope.currentSection--;
    };

    $scope.init = function () {
        //roomTypes
        $http.get("http://localhost:8000/api/room-types").then(function (resp) {
            $scope.roomTypes = resp.data;
        }).catch(function (error) {
            console.error('Error fetching data room type:', error);
        });
    }
    $scope.init();

    $scope.clearDataTable = function () {
        $scope.bookings = [];
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
            alert('Ngày check-out phải sau ngày check-in.');
        } else {
            $scope.loading = true;
            $scope.booking.checkinDate = $filter('date')($scope.booking.checkinDate, 'dd-MM-yyyy');
            $scope.booking.checkoutDate = $filter('date')($scope.booking.checkoutDate, 'dd-MM-yyyy');

            $http.get('http://localhost:8000/api/bookings/info', {
                params: {
                    checkinDate: $scope.booking.checkinDate,
                    checkoutDate: $scope.booking.checkoutDate,
                    roomType: $scope.booking.roomType
                }
            }).then(function (response) {
                $scope.bookings = response.data;
                if ($scope.bookings.length == 0) {
                    alert('Không có phòng hợp lệ.');
                }
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
        var numAdults = $scope.booking.adults;
        var numChildren = $scope.booking.children;
        var maxAdults = 0;
        var maxChildren = 0;
        for (var i = 0; i < $scope.bookings.length; i++) {
            var info = $scope.bookings[i];
            for (var j = 0; j < info.listRooms.length; j++) {
                var room = info.listRooms[j];
                if (room.selected) {
                    $scope.rooms.push(room);
                    maxAdults += room.numAdults;
                    maxChildren += room.numChilds;
                    $scope.totalPrice += room.price;
                }
            }
        }
        if (numAdults > maxAdults && numChildren > maxChildren) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numAdults - maxAdults) + ' người lớn và ' + (numChildren - maxChildren) + ' trẻ em nữa!';
        } else if (numAdults > maxAdults) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numAdults - maxAdults) + ' người lớn nữa!';
        } else if (numChildren > maxChildren) {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng. Bạn cần chọn thêm cho ' + (numChildren - maxChildren) + ' trẻ em nữa!';
        }
        else {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng đáp ứng đủ số lượng khách!';
        }
    };

    $scope.getBookings = function () {

        var formData = new FormData();

        var binaryFront = atob($scope.frontIdCardBase64);
        var arrayFront = [];
        for (var i = 0; i < binaryFront.length; i++) { arrayFront.push(binaryFront.charCodeAt(i)); }
        var blobFront = new Blob([new Uint8Array(arrayFront)], { type: 'image/jpeg' });

        var binaryBack = atob($scope.backIdCardBase64);
        var arrayBack = [];
        for (var i = 0; i < binaryBack.length; i++) { arrayBack.push(binaryBack.charCodeAt(i)); }
        var blobBack = new Blob([new Uint8Array(arrayBack)], { type: 'image/jpeg' });

        var dateOfBirth = $scope.customer.dateOfBirth;
        var dateOfBirthArray = dateOfBirth.split('/');
        var dateOfBirthString = dateOfBirthArray[0] + '-' + dateOfBirthArray[1] + '-' + dateOfBirthArray[2];
        $scope.customer.dateOfBirth = dateOfBirthString;

        const bookingReqJson = JSON.stringify({
            customer: $scope.customer,
            rooms: $scope.rooms.map(room => {
                const { selected, $$hashKey, ...cleanedRoom } = room;
                return cleanedRoom;
            }),
            numChildren: $scope.booking.children,
            numAdults: $scope.booking.adults,
            checkinExpected: $filter('date')($scope.booking.checkinDate, 'dd-MM-yyyy'),
            checkoutExpected: $filter('date')($scope.booking.checkoutDate, 'dd-MM-yyyy'),
            note: $scope.booking.note
        });

        console.log(bookingReqJson);

        formData.append('frontIdCard', blobFront, 'frontIdCard.jpg');
        formData.append('backIdCard', blobBack, 'backIdCard.jpg');
        formData.append('bookingReq', bookingReqJson);

        $http.post('http://localhost:8000/api/bookings', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            if (response.status == 200) {
                alert('Đặt phòng thành công!');
                $location.path("/bookings");
            } else {
                alert('Đặt phòng thất bại!');
            }
            console.log(response);
        }).catch(function (error) {
            console.error('Error fetching data:', error);
        });

    }

    $scope.checkCustomer = async function (peopleId) {
        $scope.loading = true;
        try {
            const response = await $http.get('http://localhost:8000/api/customers/search-by-people-id/' + peopleId);
            if (response.status == 200) {
                $scope.customer = response.data;
                $scope.customer.dateOfBirth = $filter('date')($scope.customer.dateOfBirth, 'dd-MM-yyyy');
                return true;
            }
            $scope.loading = false;
            return false;
        } catch (error) {
            console.error('Error fetching data:', error);
            $scope.loading = false;
            return false;
        }
    };


    $scope.uploadFrontIdCard = function (imageData) {

        $scope.loading = true;
        $scope.frontIdCardBase64 = imageData.split(',')[1];

        var url = 'http://localhost:8000/api/bookings/read-front-id-card';
        var formData = new FormData();
        var binary = atob(imageData.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });

        formData.append('frontIdCard', blob);

        return $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            if (response.data != '') {

                $scope.checkCustomer(response.data.data[0].id).then(function (result) {
                    if (result) {
                        return response;
                    }
                });

                $scope.customer.fullName = response.data.data[0].name;
                $scope.customer.dateOfBirth = response.data.data[0].dob;
                $scope.customer.gender = response.data.data[0].sex === 'NAM' ? true : false;
                $scope.customer.peopleId = response.data.data[0].id;
                $scope.customer.address = response.data.data[0].address;
                $scope.customer.placeOfBirth = response.data.data[0].home;
                $scope.loading = false;
                return response;
            } else {
                $scope.loading = false;
                return response;
            }
        }).catch(function (error) {
            console.log(error);
            $scope.loading = false;
            return error;
        });

    };

    $scope.uploadBackIdCard = function (imageData) {

        $scope.loading = true;
        $scope.backIdCardBase64 = imageData.split(',')[1];

        var url = 'http://localhost:8000/api/bookings/read-back-id-card';
        var formData = new FormData();
        var binary = atob(imageData.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        formData.append('backIdCard', blob);
        return $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            console.log(response);
            $scope.loading = false;
            return response;
        }).catch(function (error) {
            console.log(error);
            $scope.loading = false;
            return error;
        });

    };


    $scope.takePicture = function () {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {

                var modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.background = 'rgba(0, 0, 0, 0.5)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.flexDirection = 'column';

                var video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                var noteContainer = document.createElement('div');
                noteContainer.style.display = 'flex';
                noteContainer.style.marginTop = '15px';
                noteContainer.style.justifyContent = 'center';
                noteContainer.style.alignItems = 'center';

                var note = document.createElement('div');

                note.textContent = 'Chụp mặt trước CMND/CCCD. Nhấn SPACE để chụp, ESC để hủy.';

                note.classList.add('alert', 'alert-secondary');
                noteContainer.appendChild(note);

                function onKeyEvent(event) {
                    if (event.code === 'Space') {
                        event.preventDefault();
                        captureImage();
                    }
                    if (event.code === 'Escape') {
                        event.preventDefault();
                        video.srcObject = null;
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        modal.remove();
                        document.removeEventListener('keydown', onKeyEvent);
                    }
                }

                document.addEventListener('keydown', onKeyEvent);

                modal.appendChild(video);
                modal.appendChild(noteContainer);
                document.body.appendChild(modal);

                async function captureImage() {

                    if ($scope.isFrontImageCaptured == false) {
                        const canvasFront = document.createElement('canvas');
                        canvasFront.width = video.videoWidth;
                        canvasFront.height = video.videoHeight;

                        canvasFront.getContext('2d').drawImage(video, 0, 0, canvasFront.width, canvasFront.height);
                        video.pause();

                        const frontResponse = await $scope.uploadFrontIdCard(canvasFront.toDataURL('image/jpeg'));
                        console.log(frontResponse);

                        if (frontResponse != undefined && frontResponse.data != '') {
                            video.play();
                            document.removeEventListener('keydown', onKeyEvent);
                            note.textContent = 'Chụp mặt sau CMND/CCCD. Nhấn SPACE để chụp, ESC để hủy.';
                            $scope.$apply(function () {
                                $scope.frontIdCardDisplay = canvasFront.toDataURL('image/jpeg');
                            });
                            $scope.isFrontImageCaptured = true;
                        } else {
                            cleanCamera();
                            alert('Không thể nhận diện được ảnh! Vui lòng chụp lại!');
                            $scope.isFrontImageCaptured = false;
                        }
                    }

                    if ($scope.isFrontImageCaptured == true) {
                        function onKeyEvent2(event) {
                            if (event.code === 'Space') {
                                event.preventDefault();
                                capImageBack();
                                cleanCamera2();
                            }
                            if (event.code === 'Escape') {
                                event.preventDefault();
                                video.srcObject = null;
                                stream.getTracks().forEach(function (track) {
                                    track.stop();
                                });
                                modal.remove();
                                document.removeEventListener('keydown', onKeyEvent2);
                            }
                        }
                        document.addEventListener('keydown', onKeyEvent2);
                    }


                    async function capImageBack() {
                        const canvasBack = document.createElement('canvas');
                        canvasBack.width = video.videoWidth;
                        canvasBack.height = video.videoHeight;

                        canvasBack.getContext('2d').drawImage(video, 0, 0, canvasBack.width, canvasBack.height);
                        video.pause();
                        const backResponse = await $scope.uploadBackIdCard(canvasBack.toDataURL('image/jpeg'));
                        if (backResponse.data != '') {
                            $scope.$apply(function () {
                                $scope.backIdCardDisplay = canvasBack.toDataURL('image/jpeg');
                            });
                            alert('Chụp CCCD/CMND thành công!');
                        } else {
                            alert('Không thể nhận diện được ảnh! Vui lòng chụp lại từ đầu!');
                        }
                        $scope.isFrontImageCaptured = false;
                    }

                    function cleanCamera2() {
                        video.srcObject = null;
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        modal.remove();
                        document.removeEventListener('keydown', onKeyEvent2);
                    }

                }

                function cleanCamera() {
                    video.srcObject = null;
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    modal.remove();
                    document.removeEventListener('keydown', onKeyEvent);
                }

            })
            .catch(function (err) {
                console.log('An error occurred: ' + err);
            });
    };

});


