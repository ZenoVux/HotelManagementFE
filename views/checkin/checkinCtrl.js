app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.bookingDetail = {};
    $scope.people = {
        gender: false
    };
    $scope.isCustomer = false;

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

    $scope.modalPeopleRoom = function (action) {
        if (action == "show") {
            $scope.people = {
                gender: false
            };
        }
        $('#modal-people-room').modal(action);
    }

    $scope.searchCustomer = function () {
        $http.get("http://localhost:8000/api/customers/search-by-people-id/" + $scope.people.peopleId).then(function (resp) {
            $scope.people = resp.data;
            $scope.people.dateOfBirth = new Date($scope.people.dateOfBirth);
            $scope.isCustomer = true;
        }, function () {
            alert("Khách hàng không tồn tại!");
            $scope.people = {
                gender: false
            };
            $scope.isCustomer = false;
        });
    }

    $scope.addPeople = async function (customerForm) {
        const numAdults = $scope.bookingDetail.numAdults;
        const numChildren = $scope.bookingDetail.numChildren;
        const numPeople = $scope.hostedAts.length + 1;
        if (numPeople > (numAdults + numChildren)) {
            alert("max people");
            return;
        }
        if ($scope.isCustomer) {
            const customer = $scope.hostedAts.find(item => item.customer.id == $scope.people.id);
            if (customer) {
                alert("Khách hàng đã tồn tại!");
                $scope.people = {
                    gender: false
                };
                customerForm.$setPristine();
                customerForm.$setUntouched();
                return;
            }
            $scope.hostedAts.push({
                customer: $scope.people
            });
            $scope.people = {
                gender: false
            };
            $scope.isCustomer = false;
            customerForm.$setPristine();
            customerForm.$setUntouched();
            $('#modal-people-room').modal('hide');
            return;
        }
        if (customerForm.$valid) {
            await $http.post("http://localhost:8000/api/customers", $scope.people).then(function (resp) {
                $scope.people = resp.data;
                const hostedAt = {
                    customer: $scope.people
                }
                $scope.hostedAts.push(hostedAt);
                $scope.people = {
                    gender: false
                };
                customerForm.$setPristine();
                customerForm.$setUntouched();
                $('#modal-people-room').modal('hide');
            }, function () {
                alert("Thêm khách hàng thất bại!");
            });
        } else {
            alert("Vui lòng nhập đầy đủ thông tin!")
        }
    }

    $scope.modalServiceRoom = async function (action) {
        if (action == 'show') {
            await $http.get("http://localhost:8000/api/services").then(function (resp) {
                $scope.serviceRooms = resp.data;
                $(document).ready(function () {
                    $('#datatable-service-room').DataTable({
                        language: {
                            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                        },
                        columnDefs: [
                            {
                                targets: 4,
                                orderable: false
                            }
                        ]
                    });
                });
            });
        } else {
            $scope.serviceRooms = [];
        }
        $('#modal-service-room').modal(action);
    }

    $scope.addServiceRoom = function (service) {
        var usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id);
        if (usedService) {
            alert("Dịch vụ đã tồn tại!");
        } else {
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
        })
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