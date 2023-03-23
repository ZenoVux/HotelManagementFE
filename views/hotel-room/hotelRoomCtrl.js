app.controller("hotelRoomCtrl", function ($scope, $location, $http, $window) {
    $scope.statuses = [
        {
            id: 0,
            name: "Trống"
        },
        {
            id: 3,
            name: "Đang đặt"
        },
        {
            id: 4,
            name: "Nhận phòng"
        },
        {
            id: 2,
            name: "Đang ở"
        },
        {
            id: 5,
            name: "Quá hạn"
        },
        {
            id: 1,
            name: "Không hoạt động"
        }
    ]
    $scope.statusCounts = [];
    $scope.hotelRooms = [];
    $scope.services = [];
    $scope.usedServices = [];
    $scope.selectRoom = {};
    $scope.hotel = {
        note: "",
        extendDate: new Date()
    };
    $scope.peoples = [];
    $scope.loading = false;

    $scope.init = async function () {     
        $scope.loading = true; 
        await $scope.loadHotelRooms();
    }

    $scope.loadHotelRooms = async function () {
        await $http.get("http://localhost:8000/api/hotel").then(function (resp) {
            $scope.hotelRooms = resp.data.hotelRooms;
            $scope.statusCounts = resp.data.statusCounts;
            $scope.loading = false;
        });
    }

    $scope.loadStatusCount = async function () {
        await $http.get("http://localhost:8000/api/rooms/status-count").then(function (resp) {
            $scope.statusCounts = resp.data;
        });
    }

    $scope.checkStatusCount = function (status) {
        const statusCount = $scope.statusCounts.find(item => item.status == status);
        if (statusCount) {
            return statusCount.count;
        }
        return 0;
    }

    $scope.modalUsedService = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadServices();
            await $scope.loadUsedServices();
        } else {
            $scope.services = [];
            $scope.usedServices = [];
        }
        $('#modal-used-service').modal(action);
    }

    $scope.loadServices = async function () {
        await $http.get("http://localhost:8000/api/services").then(function (resp) {
            $scope.services = resp.data;
        });
    }

    $scope.loadUsedServices = async function () {
        await $http.get("http://localhost:8000/api/used-services/invoice-detail/" + $scope.selectRoom.invoiceDetailId).then(function (resp) {
            $scope.usedServices = resp.data;
        });
    }

    $scope.addServiceRoom = function (service) {
        var usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id);
        if (usedService) {
            alert("Dịch vụ đã tồn tại!");
        } else {
            console.log($scope.selectRoom.bookingDetail);
            $http.post("http://localhost:8000/api/used-services", {
                serviceRoom: service,
                bookingDetail: {
                    id: $scope.selectRoom.bookingDetailId
                },
                invoiceDetail: {
                    id: $scope.selectRoom.invoiceDetailId
                },
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
    
    $scope.getColor = function (name, status) {
        return name + (status == 0 ? '-success' : (status == 1 ? '-sliver' : (status == 2 ? '-danger' : (status == 3 ? '-secondary' : (status == 4 ? '-primary' : '-warning')))))
    }

    $scope.roomDetail = function (item) {
        $scope.checkinRoom(item);
    }

    $scope.checkin = function (room) {
        $location.path("/checkin/" + room.code);
    }

    $scope.checkout = function (room) {
        $location.path("/checkout/" + room.code);
        // $('#modal-checkout-list-room').modal("show");
    }

    $scope.modalCancelRoom = function (action, room) {
        $scope.selectRoom = room;
        $scope.hotel.note = "";
        $('#modal-cancel-room').modal(action);
    }

    $scope.modalExtendDate = function (room) {
        $scope.selectRoom = room;
        $scope.hotel.note = "";
        $('#modal-extend-date').modal("show");
    }

    $scope.modalChangeRoom = function (action, room) {
        $scope.selectRoom = room;

        $('#modal-change-room').modal(action);
    }

    $scope.cancelRoom = function () {
        if (!confirm("Bạn muốn huỷ phòng " + $scope.selectRoom.code +  "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/cancel", {
            code: $scope.selectRoom.code,
            note: $scope.hotel.note
        }).then(function (resp) {
            alert("Huỷ phòng thành công!");
            $scope.hotel.note = "";
            $window.location.reload();
        }, function () {
            alert("Huỷ phòng thất bại!");
        });
    }


    $scope.init();
});