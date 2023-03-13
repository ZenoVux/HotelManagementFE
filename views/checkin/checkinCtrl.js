app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.editable = false;
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.bookingDetail = {};
    $scope.people = {};

    $scope.init = async function () {
        await $scope.loadBookingDetail();
        await $scope.loadhostedAts();
        await $scope.loadUsedServices();
    }

    $scope.loadBookingDetail = async function () {
        await $http.get("http://localhost:8000/api/booking-details/checkin-room/" + $routeParams.roomCode).then(function (resp) {
            $scope.bookingDetail = resp.data;
        }, function (params) {
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
        $('#modal-people-room').modal('hide');
        $scope.hostedAts.push({
            customer: $scope.people
        });
    }

    $scope.modalServiceRoom = async function () {
        await $http.get("http://localhost:8000/api/service-rooms").then(function (resp) {
            $scope.serviceRooms = resp.data;
        });
        // $(document).ready(function () {
        //     $('#datatable-service-room').DataTable({
        //         'aoColumnDefs': [{
        //              'bSortable': false,
        //              'aTargets': [-1]
        //          }]
        //      });
        // });
        $('#modal-service-room').modal('show');
    }

    $scope.addServiceRoom = function (service) {
        var usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id);
        if (usedService) {
            usedService.quantity++;
            $http.put("http://localhost:8000/api/used-services", usedService).then(function (resp) {
                alert("update success")
            });
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

    $scope.removeServiceRoom = function (service) {
        if (!confirm("ok?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services", service.id);
    }

    $scope.checkin = function () {

    }

    $scope.init();
});