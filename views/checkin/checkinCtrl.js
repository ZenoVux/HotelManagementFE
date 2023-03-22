app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.bookingDetail = {};
    $scope.people = {
        gender: false
    };

    $scope.init = async function () {
        await $scope.loadBookingDetail();
        await $scope.loadhostedAts();
        await $scope.loadUsedServices();
    }

    $scope.loadBookingDetail = async function () {
        await $http.get("http://localhost:8000/api/booking-details/checkin-room/" + $routeParams.roomCode).then(function (resp) {
            $scope.bookingDetail = resp.data;
        }, function () {
            alert("Có lỗi xảy ra vui lòng thử lại!");
            $location.path("/hotel-room");
        });
    }

    $scope.loadhostedAts = async function () {
        await $http.get("http://localhost:8000/api/hosted-ats/booking-detail/" + $scope.bookingDetail.id).then(function (resp) {
            $scope.hostedAts = resp.data;
        }, function () {
            console.log("Có lỗi xảy ra vui lòng thử lại!");
        });
    }

    $scope.loadUsedServices = async function () {
        await $http.get("http://localhost:8000/api/used-services/booking-detail/" + $scope.bookingDetail.id).then(function (resp) {
            $scope.usedServices = resp.data;
        }, function () {
            console.log("Có lỗi xảy ra vui lòng thử lại!");
        });
    }

    $scope.modalPeopleRoom = function (action) {
        if (action == "hide") {
            $scope.people = {
                gender: false
            };
        }
        $('#modal-people-room').modal(action);
    }

    $scope.searchCustomer = function () {
        $http.get("http://localhost:8000/api/customers/search-by-people-id/" + $scope.people.peopleId)
        .then(function (resp) {
            $scope.people = resp.data;
            $scope.people.dateOfBirth = new Date($scope.people.dateOfBirth);
        }, function () {
            alert("Khách hàng không tồn tại!");
            $scope.people = {
                gender: false
            };
        });
    }

    $scope.addPeople = async function () {
        const numAdults = $scope.bookingDetail.numAdults;
        const numChildren = $scope.bookingDetail.numChildren;
        const numPeople = $scope.hostedAts.length + 1;
        if (numPeople > (numAdults + numChildren)) {
            alert("max people");
            return;
        }
        if (!$scope.people.id) {
            await $http.post("http://localhost:8000/api/customers", $scope.people).then(function (resp) {
                $scope.people = resp.data;
            }, function () {
                alert("Thêm khách hàng thất bại!");
            });
        }
        
        $http.post("http://localhost:8000/api/hosted-ats", {
            bookingDetail: {
                id: $scope.bookingDetail.id
            },
            checkin: new Date(),
            customer: $scope.people
        }).then(function (resp) {
            alert("Thêm khách hàng thành công!");
            $scope.hostedAts.push(resp.data);
            $scope.people = {
                gender: false
            };
            $('#modal-people-room').modal('hide');
        }, function () {
            alert("Thêm khách hàng thất bại!");
        });
    }

    $scope.addHostedAt = function (customer) {
        $scope.people = customer;
        $scope.addPeople();
    }

    $scope.modalServiceRoom = async function (action) {
        if (action == 'show') {
            await $http.get("http://localhost:8000/api/service-rooms").then(function (resp) {
                $scope.serviceRooms = resp.data;
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
            $http.post("http://localhost:8000/api/used-services", {
                serviceRoom: service,
                bookingDetail: $scope.bookingDetail,
                quantity: 1
            }).then(function (resp) {
                alert("Thêm dịch vụ thành công!");
                $scope.usedServices.push(resp.data);
            });
        }
    }

    $scope.updateServiceRoom = function (usedService) {
        $http.put("http://localhost:8000/api/used-services", usedService).then(function (resp) {
            alert("Cập nhật dịch vụ thành công!");
        });
    }

    $scope.removeServiceRoom = function (service) {
        if (!confirm("Bạn muốn loại bỏ dịch vụ này khỏi phòng?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services/" + service.id).then(function () {
            alert("Loại bỏ dịch vụ thành công!");
            $scope.loadUsedServices();
        });
    }

    $scope.removeHostedAt = function (hostedAt) {
        if (!confirm("Bạn muốn loại bỏ khách hàng này khỏi phòng?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/hosted-ats/" + hostedAt.id).then(function () {
            alert("Loại bỏ khách hàng thành công!");
            $scope.loadhostedAts();
        });
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
        $http.get("http://localhost:8000/api/rooms/checkin/" + $routeParams.roomCode).then(function (resp) {
            alert("Nhận phòng thành công!");
            $location.path("/hotel-room");
        });
    }

    $scope.init();
});