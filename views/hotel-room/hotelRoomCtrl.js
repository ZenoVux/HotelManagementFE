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
            name: "Chờ nhận phòng"
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
            id: 6,
            name: "Đang dọn"
        },
        {
            id: 1,
            name: "Không hoạt động"
        }
    ]
    $scope.statusCounts = [];
    $scope.hotelRooms = [];
    $scope.selectRoom = {};
    $scope.peoples = [];
    $scope.loading = false;
    $scope.invoiceDetail = {};
    $scope.bookingDetail = {};
    $scope.services = [];
    $scope.usedServices = [];
    $scope.hostedAts = [];
    $scope.roomTypes = [];
    $scope.room = {};
    $scope.rooms = [];
    $scope.extendCheckoutRoom = {};
    $scope.cancelRoom = {};
    $scope.changeRoom = {};

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

    $scope.loadRoom = async function () {
        await $http.get("http://localhost:8000/api/rooms/code-room/" + $scope.selectRoom.code).then(function (resp) {
            $scope.room = resp.data;
        });
    }

    $scope.checkStatusCount = function (status) {
        const statusCount = $scope.statusCounts.find(item => item.status == status);
        if (statusCount) {
            return statusCount.count;
        }
        return 0;
    }

    $scope.loadServices = async function () {
        await $http.get("http://localhost:8000/api/services").then(function (resp) {
            $scope.services = resp.data;
        });
    }

    $scope.loadInvoiceDetail = async function () {
        await $http.get("http://localhost:8000/api/invoice-details/" + $scope.selectRoom.invoiceDetailId).then(function (resp) {
            $scope.invoiceDetail = resp.data;
        });
    }

    $scope.loadBookingDetail = async function () {
        await $http.get("http://localhost:8000/api/booking-details/" + $scope.selectRoom.bookingDetailId).then(function (resp) {
            $scope.bookingDetail = resp.data;
        });
    }

    $scope.loadUsedServices = async function () {
        await $http.get("http://localhost:8000/api/used-services/invoice-detail/" + $scope.selectRoom.invoiceDetailId).then(function (resp) {
            $scope.usedServices = resp.data;
        });
    }

    $scope.loadHostedAts = async function () {
        await $http.get("http://localhost:8000/api/hosted-ats/invoice-detail/" + $scope.selectRoom.invoiceDetailId).then(function (resp) {
            $scope.hostedAts = resp.data;
        });
    }

    $scope.addServiceRoom = function (service) {
        var usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id);
        if (usedService) {
            alert("Dịch vụ đã tồn tại!");
        } else {
            if (!confirm("Xác nhận thêm " + service.name + "?")) {
                return;
            }
            $http.post("http://localhost:8000/api/hotel/used-service", {
                serviceId: service.id,
                invoiceDetailId: $scope.selectRoom.invoiceDetailId,
                quantity: 1
            }).then(function (resp) {
                alert("Thêm dịch vụ thành công!");
                $scope.usedServices.push(resp.data);
            }, function () {
                alert("Thêm dịch vụ thất bại!");
            });
        }
    }

    $scope.updateServiceRoom = function (usedService) {
        if (!confirm("Bạn muốn cập nhật dịch vụ này?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/used-service", {
            serviceId: usedService.serviceRoom.id,
            invoiceDetailId: $scope.selectRoom.invoiceDetailId,
            quantity: usedService.quantity
        }).then(function (resp) {
            alert("Cập nhật dịch vụ thành công!");
        }, function () {
            alert("Cập nhật dịch vụ thất bại!");
        });
    }

    $scope.removeServiceRoom = function (service) {
        if (!confirm("Bạn muốn loại bỏ dịch vụ này khỏi phòng?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services/" + service.id).then(function () {
            alert("Loại bỏ dịch vụ thành công!");
            $scope.loadUsedServices();
        }, function () {
            alert("Loại bỏ dịch vụ thất bại!");
        });
    }

    $scope.getColor = function (name, status) {
        return name + (status == 0 ? '-success' : (status == 1 ? '-sliver' : (status == 2 ? '-danger' : (status == 3 ? '-secondary' : (status == 4 ? '-primary' : (status == 5 ? '-warning' : '-secondary'))))))
    }

    $scope.roomDetail = function (item) {
        $scope.checkinRoom(item);
    }

    $scope.checkin = function (room) {
        $location.path("/checkin/" + room.code);
    }

    $scope.checkout = function (room) {
        const now = new Date();
        const checkout = new Date(room.checkoutExpected);

        if (checkout > now) {
            if (!confirm("Bạn muốn trả phòng " + room.code + " sớm?")) {
                return;
            }
        }
        $location.path("/checkout/" + room.code);
    }

    $scope.modalInfoRoom = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadRoom();
        } else {
            $scope.room = {};
        }
        console.log("aaaaaaaaaaa");
        $('#modal-info-room').modal(action);
    }

    $scope.modalHostedAt = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadHostedAts();
        } else {
            $scope.hostedAts = [];
        }
        $('#modal-hosted-at').modal(action);
    }

    $scope.modalUsedService = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadServices();
            await $scope.loadUsedServices();
            $(document).ready(function () {
                tableServiceRoom = $('#datatable-service-room').DataTable({
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
                tableUsedService = $('#datatable-used-service').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                    },
                    columnDefs: [
                        {
                            targets: 6,
                            orderable: false
                        }
                    ]
                });
            });
        } else {
            $(document).ready(function () {
                tableServiceRoom.clear();
                tableServiceRoom.destroy();
                tableUsedService.clear();
                tableUsedService.destroy();
            });
            $scope.services = [];
            $scope.usedServices = [];
        }
        $('#modal-used-service').modal(action);
    }

    $scope.modalCancelRoom = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            if (room.status == 2 || room.status == 5) {
                await $scope.loadInvoiceDetail();
            } else {
                await $scope.loadBookingDetail();
            }
        } else {
            $scope.invoiceDetail = {};
        }
        $scope.cancelRoom.note = "";
        $('#modal-cancel-room').modal(action);
    }

    $scope.modalExtendDate = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            $scope.extendCheckoutRoom.code = $scope.selectRoom.code;
            $scope.extendCheckoutRoom.extendDate = new Date($scope.selectRoom.checkoutExpected);
            $scope.extendCheckoutRoom.note = "";
            await $scope.loadInvoiceDetail();
        } else {
            $scope.invoiceDetail = {};
        }
        $('#modal-extend-date').modal(action);
    }

    $scope.modalChangeRoom = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadInvoiceDetail();
            await $http.get("http://localhost:8000/api/rooms/unbooked?start-date=" + $scope.selectRoom.checkinExpected + "&end-date=" + $scope.selectRoom.checkoutExpected).then(resp => {
                $scope.rooms = resp.data;
                $(document).ready(function () {
                    tableChangeRoom = $('#datatable-change-room').DataTable({
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
            }).catch(error => {
                alert("Error load data room")
                console.log("Error", error);
            })
        } else {
            $(document).ready(function () {
                tableChangeRoom.clear();
                tableChangeRoom.destroy();
            });
            $scope.invoiceDetail = {};
            $scope.rooms = [];
        }
        $('#modal-change-room').modal(action);
    }

    $scope.handlerExtendDateRoom = async function () {
        const checkout = new Date($scope.selectRoom.checkoutExpected);
        const newCheckout = new Date($scope.extendCheckoutRoom.extendDate);
        if (newCheckout <= checkout) {
            alert("Ngày trả phòng không hợp lệ!");
            return;
        }
        if (!$scope.extendCheckoutRoom.note) {
            alert("Vui lòng nhập ghi chú!");
            return;
        }
        if (!confirm("Bạn muốn gia hạn ngày trả phòng " + $scope.selectRoom.code + "?")) {
            return;
        }
        await $http.post("http://localhost:8000/api/hotel/extend-checkout-date", $scope.extendCheckoutRoom).then(function (resp) {
            alert("Gia hạn ngày trả phòng thành công!");
            $window.location.reload();
        }, function () {
            alert("Gia hạn ngày trả phòng thất bại!");
        });
        extendDateForm.$setPristine();
        extendDateForm.$setUntouched();
    }

    $scope.handlerCancelRoom = function () {
        if (!$scope.cancelRoom.note) {
            alert("Vui lòng nhập ghi chú!");
            return;
        }
        if (!confirm("Bạn muốn huỷ phòng " + $scope.selectRoom.code + "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/cancel", {
            code: $scope.selectRoom.code,
            note: $scope.cancelRoom.note
        }).then(function (resp) {
            alert("Huỷ phòng thành công!");
            $scope.cancelRoom.note = "";
            $window.location.reload();
        }, function () {
            alert("Huỷ phòng thất bại!");
        });
    }

    $scope.handlerReadyRoom = function (room) {
        if (!confirm("Bạn muốn chuyển phòng " + room.code + " về trạng thái sẵn sàng?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/ready", {
            code: room.code
        }).then(function (resp) {
            alert("Phòng đã sẵn sàng!");
            $window.location.reload();
        }, function () {
            alert("Phòng chưa sẵn sàng!");
        });
    }

    $scope.handlerChangeRoom = function () {
        if (!$scope.changeRoom.toRoomCode) {
            alert("Vui lòng chọn phòng muốn đổi!");
            return;
        }
        if (!$scope.changeRoom.note) {
            alert("Vui lòng nhập ghi chú!");
            return;
        }
        if (!confirm("Bạn muốn chuyển phòng " + $scope.selectRoom.code + " sang phòng " + $scope.changeRoom.toRoomCode + "?")) {
            return;
        }
        $scope.changeRoom.fromRoomCode = $scope.selectRoom.code;
        console.log("changeRoom", $scope.changeRoom);
        $http.post("http://localhost:8000/api/hotel/change", $scope.changeRoom).then(function (resp) {
            alert("Đổi phòng thành công!");
            $window.location.reload();
        }, function () {
            alert("Đổi phòng thất bại!");
        });
    }

    $scope.init();

});