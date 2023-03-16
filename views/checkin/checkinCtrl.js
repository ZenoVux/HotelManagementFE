app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.customers = [];
    $scope.usedServices = [];
    $scope.bookingDetail = {};
    $scope.people = {
        gender: false
    };
    $scope.currentStep = 0;

    $scope.nextSection = function () {
        $scope.currentStep++;
    };

    $scope.prevSection = function () {
        $scope.currentStep--;
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
            $location.path("/hotel-room");
        });
    }

    $scope.loadhostedAts = async function () {
        await $http.get("http://localhost:8000/api/hosted-ats/booking-detail/" + $scope.bookingDetail.id).then(function (resp) {
            $scope.hostedAts = resp.data;
        });
    }

    $scope.loadUsedServices = async function () {
        await $http.get("http://localhost:8000/api/used-services/booking-detail/" + $scope.bookingDetail.id).then(function (resp) {
            $scope.usedServices = resp.data;
        });
    }

    $scope.modalPeopleRoom = function () {
        $('#modal-people-room').modal('show');
    }

    $scope.addPeople = function () {
        const numAdults = $scope.bookingDetail.numAdults;
        const numChildren = $scope.bookingDetail.numChildren;
        const numPeople = $scope.hostedAts.length + 1;
        if (numPeople > (numAdults + numChildren)) {
            alert("max people");
            return;
        }
        $http.post("http://localhost:8000/api/customers", $scope.people).then(function (resp1) {
            $http.post("http://localhost:8000/api/hosted-ats", {
                bookingDetail: {
                    id: $scope.bookingDetail.id
                },
                checkin: new Date(),
                customer: resp1.data
            }).then(function (resp2) {
                $scope.hostedAts.push(resp2.data);
                $scope.people = {
                    gender: false
                };
                $('#modal-people-room').modal('hide');
            });
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
            usedService.quantity++;
            $scope.updateServiceRoom(usedService);
        } else {
            $http.post("http://localhost:8000/api/used-services", {
                serviceRoom: service,
                bookingDetail: $scope.bookingDetail,
                quantity: 1
            }).then(function (resp) {
                $scope.usedServices.push(resp.data);
            });
        }
    }

    $scope.updateServiceRoom = function (usedService) {
        $http.put("http://localhost:8000/api/used-services", usedService).then(function (resp) {
            alert("update success");
        });
    }

    $scope.removeServiceRoom = function (service) {
        if (!confirm("ok?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services/" + service.id).then(function () {
            alert("delete service success");
            $scope.loadUsedServices();
        });
    }

    $scope.removeHostedAt = function (hostedAt) {
        if (!confirm("ok?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services/" + hostedAt.id).then(function () {
            alert("delete hosted at success");
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
        if (!confirm("confirm checkin room " + $routeParams.roomCode +  "?")) {
            return;
        }
        $http.put("http://localhost:8000/api/rooms/status", {
            code: $routeParams.roomCode,
            status: 2
        }).then(function (resp) {
            alert("checkin success");
            $location.path("/hotel-room");
        });
    }

    $scope.init();
});