app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.customers = [];
    $scope.bookingDetail = {};
    $scope.customer = {
        gender: true
    };
    $scope.frontIdCardBase64 = null;
    $scope.backIdCardBase64 = null;
    $scope.frontIdCardDisplay = null;
    $scope.backIdCardDisplay = null;
    $scope.isFrontImageCaptured = false;

    $scope.init = async function () {
        await $scope.loadBookingDetail();
    }

    $scope.loadBookingDetail = async function () {
        await $http.get("http://localhost:8000/api/booking-details/waiting-checkin/" + $routeParams.roomCode).then(function (resp) {
            $scope.bookingDetail = resp.data;
        }, function () {
            alert("Có lỗi xảy ra vui lòng thử lại!");
            $location.path("/hotel-room");
        });
    }

    $scope.loadCustomers = async function () {
        await $http.get("http://localhost:8000/api/customers").then(function (resp) {
            $scope.customers = resp.data;
        });
    }

    $scope.loadServiceRoom = async function () {
        await $http.get("http://localhost:8000/api/services").then(function (resp) {
            $scope.serviceRooms = resp.data;
        });
    }

    $scope.initTableCustomer = function () {
        $(document).ready(function () {
            tableCustomer = $('#datatable-customer').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                },
                dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                columnDefs: [
                    {
                        targets: 5,
                        orderable: false
                    }
                ]
            });
            $('#search-datatable-customer').keyup(function(){
                tableCustomer.search($(this).val()).draw() ;
            });
        });
    }

    $scope.clearTableCustomer = function () {
        $(document).ready(function () {
            tableCustomer.clear();
            tableCustomer.destroy();
        });
    }

    $scope.initTableServiceRoom = function () {
        $(document).ready(function () {
            tableServiceRoom = $('#datatable-service-room').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                },
                dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                columnDefs: [
                    {
                        targets: 4,
                        orderable: false
                    }
                ]
            });
            $('#search-datatable-service-room').keyup(function(){
                tableServiceRoom.search($(this).val()).draw() ;
            });
        });
    }

    $scope.clearTableServiceRoom = function () {
        $(document).ready(function () {
            tableServiceRoom.clear();
            tableServiceRoom.destroy();
        });
    }

    $scope.modalPeopleRoom = async function (action) {
        if (action == "show") {
            await $scope.loadCustomers();
            await $scope.initTableCustomer();
        } else {
            $scope.clearTableCustomer();
            $scope.customers = [];
            $scope.customer = {
                gender: true
            };
        }
        await $('#modal-people-room').modal(action);
        $('.nav-tabs a[href="#customer-tab"]').click(function () {
            $('#search-datatable-customer').focus()
        });
        $('.nav-tabs a[href="#add-customer-tab"]').click(function () {
            $('#peopleId').focus()
        });
        $('.nav-tabs a[href="#customer-tab"]').tab('show');
        setTimeout(function () {
            $('#search-datatable-customer').focus()
        }, 1000);
    }

    $scope.modalServiceRoom = async function (action) {
        if (action == 'show') {
            await $scope.loadServiceRoom();
            await $scope.initTableServiceRoom();
        } else {
            await $scope.clearTableServiceRoom();
            $scope.serviceRooms = [];
        }
        $('#modal-service-room').modal(action);
        setTimeout(function () {
            $('#search-datatable-service-room').focus()
        }, 1000);
    }

    $scope.handlerAddCustomer = function (_customer) {
        if ($scope.hostedAts.find(hostedAt => hostedAt.customer.peopleId == _customer.peopleId)) {
            alert("khách hàng đã tồn tại!");
            return;
        } else {
            if (!confirm("Bạn muốn thêm khách hàng " + _customer.fullName + " vào phòng?")) {
                return;
            }
            $scope.hostedAts.push({
                customer: _customer
            });
            alert("Thêm khách hàng thành công!");
        }
    }

    $scope.handlerCreateCustomer = async function () {
        if (!$scope.customer.peopleId) {
            alert("Vui lòng nhập CCCD/CMND!");
            $("#peopleId").focus();
            return;
        }
        if ($scope.customers.find(_customer => _customer.peopleId == $scope.customer.peopleId)) {
            alert("CCCD/CMND đã tồn tại!");
            $("#peopleId").focus();
            return;
        }
        if (!$scope.customer.fullName) {
            alert("Vui lòng nhập họ và tên!");
            $("#fullName").focus();
            return;
        }
        if (!$scope.customer.phoneNumber) {
            alert("Vui lòng nhập SĐT!");
            $("#phoneNumber").focus();
            return;
        }
        if (!$scope.customer.email) {
            alert("Vui lòng nhập email!");
            $("#email").focus();
            return;
        }
        if (!$scope.customer.dateOfBirth) {
            alert("Vui lòng nhập ngày sinh!");
            $("#dateOfBirth").focus();
            return;
        }
        if (!$scope.customer.placeOfBirth) {
            alert("Vui lòng nhập quê quán!");
            $("#placeOfBirth").focus();
            return;
        }
        if (!$scope.customer.address) {
            alert("Vui lòng nhập địa chỉ!");
            $("#address").focus();
            return;
        }
        if (!confirm("Bạn muốn thêm mới khách hàng?")) {
            return;
        }
        $http.post("http://localhost:8000/api/customers/create-member", $scope.customer).then(function (_resp) {
            alert("Thêm khách hàng mới thành công!");
            $('.nav-tabs a[href="#customer-tab"]').tab('show');
            $scope.customers.push(_resp.data);
            $scope.customer = {
                gender: false
            };
            $(document).ready(function () {
                tableCustomer.clear();
                tableCustomer.destroy();
                tableCustomer = $('#datatable-customer').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                    },
                    dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    columnDefs: [
                        {
                            targets: 5,
                            orderable: false
                        }
                    ]
                });
                $('#search-datatable-customer').keyup(function(){
                    tableCustomer.search($(this).val()).draw() ;
                });
            });
        }, function () {
            alert("Thêm khách hàng mới thất bại!");
        });
    }

    $scope.addServiceRoom = function (service) {
        var usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id);
        if (usedService) {
            alert("Dịch vụ đã tồn tại!");
        } else {
            if (!confirm("Bạn muốn thêm " + service.name + "?")) {
                return;
            }
            usedService = {
                serviceRoom: service,
                bookingDetail: $scope.bookingDetail,
                quantity: 1
            }
            $scope.usedServices.push(usedService);
            alert("Thêm dịch vụ thành công!");
        }
    }

    $scope.removeServiceRoom = function (service) {
        if (!confirm("Bạn muốn loại bỏ dịch vụ này khỏi phòng?")) {
            return;
        }
        const index = $scope.usedServices.findIndex(item => item.serviceRoom.id == service.id);
        $scope.usedServices.splice(index, 1);
    }

    $scope.removeHostedAt = function (customer) {
        if (!confirm("Bạn muốn loại bỏ khách hàng này?")) {
            return;
        }
        const index = $scope.hostedAts.findIndex(item => item.customer.id == customer.id);
        $scope.hostedAts.splice(index, 1);
    }

    $scope.handlerCheckin = function () {
        const numPeople = $scope.hostedAts.length;
        if (numPeople <= 0) {
            alert("Chưa có thông tin người ở!");
            return;
        }
        if (!confirm("Bạn muốn nhận phòng " + $routeParams.roomCode +  "?")) {
            return;
        }
        console.log("checkin", {
            code: $routeParams.roomCode,
            hostedAts: $scope.hostedAts,
            usedServices: $scope.usedServices
        });
        const customers = $scope.hostedAts.map(hostedAt => {
            return {
                customerId: hostedAt.customer.id
            }
        });
        const services = $scope.usedServices.map(usedService => {
            return {
                serviceId: usedService.serviceRoom.id,
                quantity: usedService.quantity
            }
        });
        $http.post("http://localhost:8000/api/hotel/checkin", {
            code: $routeParams.roomCode,
            customers: customers,
            services: services
        }).then(function (resp) {
            alert("Nhận phòng thành công!");
            $location.path("/hotel-room");
        });
    }


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
                modal.style.zIndex = '10000';
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

    $scope.init();
});