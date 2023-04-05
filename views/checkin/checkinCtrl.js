app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.customers = [];
    $scope.bookingDetail = {};
    $scope.customer = {
        gender: false
    };

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

    $scope.modalPeopleRoom = async function (action) {
        if (action == "show") {
            await $scope.loadCustomers();
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
        } else {
            $(document).ready(function () {
                tableCustomer.clear();
                tableCustomer.destroy();
            });
            $scope.customers = [];
            $scope.customer = {
                gender: false
            };
        }
        $('#modal-people-room').modal(action);
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

    $scope.modalServiceRoom = async function (action) {
        if (action == 'show') {
            await $http.get("http://localhost:8000/api/services").then(function (resp) {
                $scope.serviceRooms = resp.data;
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
            });
        } else {
            $(document).ready(function () {
                tableServiceRoom.clear();
                tableServiceRoom.destroy();
            });
            $scope.serviceRooms = [];
        }
        $('#modal-service-room').modal(action);
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

    $scope.modalListCustomer = async function (action) {
        if (action == 'show') {
            await $http.get("http://localhost:8000/api/customers").then(function (resp) {
                $scope.customers = resp.data;
            });
        } else {
            $scope.customers = [];
        }
        $('#modal-list-customer').modal(action);
    }

    $scope.checkin = function () {
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

    $scope.init();
});