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

app.controller("createBookingCtrl", function ($scope, $http, $location) {

    $scope.booking = {};
    $scope.booking.adults = 2;
    $scope.booking.children = 0;
    $scope.customer = {};
    $scope.frontIdResp = {};
    $scope.loading = false;
    $scope.currentSection = 0;
    $scope.rooms = [];
    $scope.totalPrice = 0;
    const checkinDateDisplay = new Date().toISOString().split('T')[0].split('-').reverse().join('/').replace('/', '-').replace('/', '-');
    const checkinDate = new Date();
    $scope.booking.checkinDate = checkinDateDisplay;
    $scope.frontIdCard = null;
    $scope.backIdCard = null;

    $scope.closeDropdown = function () {
        $('.dropdown-menu').removeClass('show');
    };

    $scope.nextSection = function () {
        // if ($scope.currentSection == 0) {
        //     if ($scope.rooms.length == 0) {
        //         alert("Vui lòng chọn phòng!");
        //         return;
        //     }
        // }
        // if ($scope.currentSection == 1) {
        //     if () {
        //         alert("Vui lòng nhập đủ thông tin khách hàng!");
        //         return;
        //     }
        // }
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

        //paymentMethods
        $http.get("http://localhost:8000/api/payment-methods").then(function (resp) {
            $scope.paymentMethods = resp.data;
        }).catch(function (error) {
            console.error('Error fetching data payment method:', error);
        });

    }
    $scope.init();

    $scope.checkRoom = function () {

        if ($scope.booking.checkinDate != checkinDateDisplay) {
            checkinDate = $scope.booking.checkinDate;
        }

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
                    checkinDate: checkinDate,
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
                    $scope.deposit = $scope.totalPrice * 0.1;
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
            $scope.alertMessage = 'Bạn cần chọn thêm cho ' + (numChildren - maxChildren) + ' trẻ em nữa!';
        }
        else {
            $scope.showAlert = true;
            $scope.alertMessage = 'Đã chọn ' + $scope.rooms.length + ' phòng đáp ứng đủ số lượng khách!';
        }
    };

    $scope.getBookings = function () {

        $scope.customer.dateOfBirth = new Date($scope.customer.dateOfBirth);

        $http.post('http://localhost:8000/api/bookings', {
            customer: $scope.customer,
            frontIdCard: $scope.frontIdCard,
            backIdCard: $scope.backIdCard,
            rooms: $scope.rooms,
            numChildren: $scope.booking.children,
            numAdults: $scope.booking.adults,
            checkinExpected: $scope.booking.checkinDate,
            checkoutExpected: $scope.booking.checkoutDate,
            paymentCode: $scope.booking.payment,
            note: $scope.booking.note,
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

        console.log('Front ID card:', $scope.frontIdCard);
        console.log('Back ID card:', $scope.backIdCard);

    }


    $scope.uploadFrontIdCard = function (imageData) {

        $scope.loading = true;

        var url = 'http://localhost:8000/api/bookings/read-front-id-card';
        var formData = new FormData();
        var binary = atob(imageData.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        formData.append('image', blob);

        console.log("---------START---------");
        return $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            if (response.data != '') {
                $scope.customer.fullName = response.data.data[0].name;
                $scope.customer.dateOfBirth = response.data.data[0].dob;
                $scope.customer.gender = response.data.data[0].sex === 'NAM' ? true : false;
                $scope.customer.peopleId = response.data.data[0].id;
                $scope.customer.address = response.data.data[0].address;
                $scope.customer.placeOfBirth = response.data.data[0].home;
                console.log(1);
                console.log("---------END1---------");
                $scope.loading = false;
                return response;
            } else {
                console.log(2);
                console.log("---------END2---------");
                $scope.loading = false;
                return response;
            }
        }).catch(function (error) {
            console.log(3);
            console.log("---------END3---------");
            console.log(error);
            $scope.loading = false;
            return error;
        });

    };


    $scope.uploadBackIdCard = function (imageData) {

        $scope.loading = true;

        var url = 'http://localhost:8000/api/bookings/read-back-id-card';
        var formData = new FormData();
        var binary = atob(imageData.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        formData.append('image', blob);
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

    $scope.isFrontImageCaptured = false;

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
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    });

                var noteContainer = document.createElement('div');
                noteContainer.style.display = 'flex';
                noteContainer.style.marginTop = '15px';
                noteContainer.style.justifyContent = 'center';
                noteContainer.style.alignItems = 'center';

                var note = document.createElement('div');
                note.textContent = 'Chụp mặt trước CMND/CCCD. Nhấn SPACE để chụp, ESC để hủy.';
                note.classList.add('alert', 'alert-secondary');
                noteContainer.appendChild(note);

                document.addEventListener('keydown', function (event) {
                    if (event.code === 'Space') {
                        event.preventDefault();
                        captureImage();
                    }
                    if (event.code === 'Escape') {
                        event.preventDefault();
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        modal.remove();
                    }
                });

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
                            note.textContent = 'Chụp mặt sau CMND/CCCD. Nhấn SPACE để chụp, ESC để hủy.';
                            $scope.$apply(function () {
                                $scope.frontIdCard = canvasFront.toDataURL('image/jpeg');
                            });
                            $scope.isFrontImageCaptured = true;
                        } else {
                            stream.getTracks().forEach(function (track) {
                                track.stop();
                            });
                            modal.remove();
                            canvasFront.remove();
                            alert('Không thể nhận diện được ảnh! Vui lòng chụp lại! 111');
                            $scope.isFrontImageCaptured = false;
                        }
                    }

                    if ($scope.isFrontImageCaptured == true) {
                        const canvasBack = document.createElement('canvas');
                        canvasBack.width = video.videoWidth;
                        canvasBack.height = video.videoHeight;

                        document.addEventListener('keydown', async function (event) {
                            if (event.code === 'Space') {
                                event.preventDefault();
                                canvasBack.getContext('2d').drawImage(video, 0, 0, canvasBack.width, canvasBack.height);
                                video.pause();
                                const backResponse = await $scope.uploadBackIdCard(canvasBack.toDataURL('image/jpeg'));
                                if (backResponse.data != '') {
                                    $scope.$apply(function () {
                                        $scope.backIdCard = canvasBack.toDataURL('image/jpeg');
                                    });
                                    alert('Chụp CCCD/CMND thành công!');
                                    stream.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                    modal.remove();
                                } else {
                                    alert('Không thể nhận diện được ảnh! Vui lòng chụp lại! 222');
                                    stream.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                    modal.remove();
                                    canvasBack.remove();
                                }

                            }
                            if (event.code === 'Escape') {
                                event.preventDefault();
                                modal.remove();
                            }
                        });
                    }
                }
            })
            .catch(function (err) {
                console.log('An error occurred: ' + err);
            });
    };

});


