app.controller("checkinCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.editable = false;
    $scope.hostedAts = [];
    $scope.serviceRooms = [];
    $scope.usedServices = [];
    $scope.bookingDetail = {};

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

    $scope.modalServicePeople = function () {
        $('#secondmodal').modal('show');
    }

    $scope.addPeople = function () {
        $('#secondmodal').modal('hide');
        $scope.hostedAts.push({
            customer: {
                fullName: "Vũ Văn Luân",
                phoneNumber: "0987654321",
                email: "luanvu0702@gmail.com",
                dateOfBirth: "07/02/2002",
                gender: "Nam",
                peopleId: "87265232724",
                placeOfBirth: "Thái Bình",
                address: "Hà Nội"
            }
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
        } else {
            $scope.usedServices.push({
                serviceRoom: service,
                quantity: 1
            });
        }
    }

    $scope.removeServiceRoom = function (service) {
    }

    $scope.checkin = function () {

    }

    $scope.init();
});