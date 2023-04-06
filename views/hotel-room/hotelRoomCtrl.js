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
            name: "Đang dọn dẹp"
        },
        {
            id: 1,
            name: "Không hoạt động"
        }
    ]
    $scope.loading = false;
    $scope.statusCounts = [];
    $scope.hotelRooms = [];
    $scope.services = [];
    $scope.usedServices = [];
    $scope.hostedAts = [];
    $scope.roomTypes = [];
    $scope.rooms = [];
    $scope.customers = [];
    $scope.room = {};
    $scope.selectRoom = {};
    $scope.invoiceDetail = {};
    $scope.bookingDetail = {};
    $scope.extendCheckoutRoom = {};
    $scope.cancelRoom = {};
    $scope.changeRoom = {};
    $scope.usedServiceDate = {};
    $scope.customer = {
        gender: false
    };

    $scope.getStatus = function (_status) {
        return $scope.statuses.find(item => item.id == _status);;
    }

    $scope.getColor = function (name, status) {
        return name + (status == 0 ? '-success' : (status == 1 ? '-sliver' : (status == 2 ? '-danger' : (status == 3 ? '-purple' : (status == 4 ? '-primary' : (status == 5 ? '-warning' : '-secondary'))))))
    }

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

    $scope.loadCustomers = async function () {
        await $http.get("http://localhost:8000/api/customers").then(function (resp) {
            $scope.customers = resp.data;
        });
    }

    $scope.initTableUsedService = function () {
        $(document).ready(async function () {
            tableUsedService = $('#datatable-used-service').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                },
                dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                columnDefs: [
                    {
                        targets: 6,
                        orderable: false
                    }
                ]
            });
            $('#search-datatable-used-service').keyup(function () {
                tableUsedService.search($(this).val()).draw();
            });
        });
    }

    $scope.clearTableUsedService = function () {
        $(document).ready(function () {
            tableUsedService.clear();
            tableUsedService.destroy();
        });
    }

    $scope.initTableServiceRoom = function () {
        $(document).ready(async function () {
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
            $('#search-datatable-service-room').keyup(function () {
                tableServiceRoom.search($(this).val()).draw();
            });
        });
    }

    $scope.clearTableServiceRoom = function () {
        $(document).ready(function () {
            tableServiceRoom.clear();
            tableServiceRoom.destroy();
        });
    }

    $scope.initTableHostedAt = function () {
        $(document).ready(async function () {
            tableHostedAt = $('#datatable-hosted-at').DataTable({
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
        });

        $('#search-datatable-hosted-at').keyup(function () {
            tableHostedAt.search($(this).val()).draw();
        });
    }

    $scope.clearTableHostedAt = function () {
        $(document).ready(function () {
            tableHostedAt.clear();
            tableHostedAt.destroy();
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
            $('#search-datatable-customer').keyup(function () {
                tableCustomer.search($(this).val()).draw();
            });
        });
    }

    $scope.clearTableCustomer = function () {
        $(document).ready(function () {
            tableCustomer.clear();
            tableCustomer.destroy();
        });
    }

    $scope.addServiceRoom = function (service) {
        const usedService = $scope.usedServices.find(item => item.serviceRoom.id == service.id && !item.isUsed);
        if (usedService) {
            alert("Dịch vụ đã tồn tại!");
        } else {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const checkoutExpected = new Date($scope.selectRoom.checkoutExpected);
            if (now > $scope.usedServiceDate.startedTime) {
                alert("Không thể chọn ngày bắt đầu trước ngày hiện tại!");
                return;
            }
            if (checkoutExpected < $scope.usedServiceDate.endedTime) {
                alert("Không thể chọn ngày kết thúc sau ngày trả phòng!");
                return;
            }
            if (!($scope.usedServiceDate.startedTime > $scope.usedServiceDate.endedTime) && !($scope.usedServiceDate.startedTime < $scope.usedServiceDate.endedTime)) {
                alert("Không thể chọn ngày bắt đầu trùng ngày kết thúc!");
                return;
            }
            if (!confirm("Bạn muốn thêm " + service.name + "?")) {
                return;
            }
            $http.post("http://localhost:8000/api/used-services", {
                serviceRoom: {
                    id: service.id
                },
                invoiceDetail: {
                    id: $scope.selectRoom.invoiceDetailId
                },
                startedTime: $scope.usedServiceDate.startedTime,
                endedTime: $scope.usedServiceDate.endedTime,
                quantity: 1
            }).then(async function (resp) {
                alert("Thêm dịch vụ thành công!");
                await $scope.clearTableUsedService();
                await $scope.loadUsedServices();
                await $scope.initTableUsedService();
                $('.nav-tabs a[href="#used-service-tab"]').tab('show');
            }, function () {
                alert("Thêm dịch vụ thất bại!");
            });
        }
    }

    $scope.updateServiceRoom = function (usedService) {
        if (!confirm("Bạn muốn cập nhật dịch vụ này?")) {
            return;
        }
        $http.put("http://localhost:8000/api/used-services", usedService).then(function (resp) {
            alert("Cập nhật dịch vụ thành công!");
        }, function () {
            alert("Cập nhật dịch vụ thất bại!");
        });
    }

    $scope.removeServiceRoom = function (usedService) {
        if (usedService.status) {
            alert("Không thể xoá dịch vụ đã sử dụng!");
            return;
        }
        if (!confirm("Bạn muốn loại bỏ dịch vụ này khỏi phòng?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/used-services/" + usedService.id).then(function () {
            alert("Loại bỏ dịch vụ thành công!");
            $scope.loadUsedServices();
        }, function () {
            alert("Loại bỏ dịch vụ thất bại!");
        });
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
        $('#modal-info-room').modal(action);
    }

    $scope.modalHostedAt = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            await $scope.loadHostedAts();
            await $scope.loadCustomers();
            await $scope.initTableHostedAt();
            await $scope.initTableCustomer();
        } else {
            $scope.clearTableHostedAt();
            $scope.clearTableCustomer();
            $scope.hostedAts = [];
            $scope.customers = [];
            $scope.customer = {
                gender: false
            };
        }
        await $('#modal-hosted-at').modal(action);
        $('.nav-tabs a[href="#hosted-at-tab"]').click(function () {
            $('#search-datatable-hosted-at').focus()
        });
        $('.nav-tabs a[href="#customer-tab"]').click(function () {
            $('#search-datatable-customer').focus()
        });
        $('.nav-tabs a[href="#hosted-at-tab"]').tab('show');
        setTimeout(function () {
            $('#search-datatable-hosted-at').focus()
        }, 1000);
    }

    $scope.modalAddCustomer = function (action) {
        if (action == "show") {
            $scope.modalHostedAt('hide');
            $scope.customer = {
                gender: false
            };
        }
        $('#modal-add-customer').modal(action);
    }

    $scope.modalUsedService = async function (action, room) {
        $scope.selectRoom = room;
        if (action == 'show') {
            $scope.usedServiceDate.startedTime = new Date();
            $scope.usedServiceDate.startedTime.setHours(0, 0, 0, 0);
            $scope.usedServiceDate.endedTime = new Date($scope.selectRoom.checkoutExpected);
            await $scope.loadServices();
            await $scope.loadUsedServices();
            await $scope.initTableUsedService();
            await $scope.initTableServiceRoom();
        } else {
            $scope.clearTableUsedService();
            $scope.clearTableServiceRoom();
            $scope.services = [];
            $scope.usedServices = [];
            $scope.usedServiceDate = {};
        }
        await $('#modal-used-service').modal(action);
        $('.nav-tabs a[href="#used-service-tab"]').click(function () {
            $('#search-datatable-used-service').focus()
        });
        $('.nav-tabs a[href="#service-tab"]').click(function () {
            $('#search-datatable-service-room').focus()
        });
        $('.nav-tabs a[href="#used-service-tab"]').tab('show');
        setTimeout(function () {
            $('#search-datatable-used-service').focus()
        }, 1000);
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
        $scope.changeRoom.toRoomCode = null;
        if (action == 'show') {
            await $scope.loadInvoiceDetail();
            const checkinDate = new Date($scope.selectRoom.checkinExpected);
            const checkoutDate = new Date($scope.selectRoom.checkoutExpected);
            await $http.get("http://localhost:8000/api/rooms/unbooked?checkin-date=" + checkinDate.toLocaleDateString('vi-VN') + "&checkout-date=" + checkoutDate.toLocaleDateString('vi-VN')).then(resp => {
                $scope.rooms = resp.data;
                $(document).ready(function () {
                    tableChangeRoom = $('#datatable-change-room').DataTable({
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
                    $('#search-datatable-change-room').keyup(function () {
                        tableChangeRoom.search($(this).val()).draw();
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

    $scope.handlerAddCustomer = async function (_customer) {
        const hostedAt = $scope.hostedAts.find(hostedAt => hostedAt.customer.id == _customer.id);
        if (hostedAt) {
            alert("Khách hàng đã tồn tại!");
        } else {
            if (!confirm("Bạn muốn thêm khách hàng " + _customer.fullName + " vào phòng " + $scope.selectRoom.code + "?")) {
                return;
            }
            $http.post("http://localhost:8000/api/hosted-ats", {
                invoiceDetail: {
                    id: $scope.selectRoom.invoiceDetailId
                },
                customer: _customer
            }).then(function (_resp) {
                alert("Thêm khách hàng thành công!");
                $('.nav-tabs a[href="#hosted-at-tab"]').tab('show');
                $scope.hostedAts.push(_resp.data);
            }, function () {
                alert("Thêm khách hàng thất bại!");
            });
        }
    }

    $scope.removeHostedAt = function (hostedAt) {
        if (!confirm("Bạn muốn loại bỏ khách hàng này khỏi phòng?")) {
            return;
        }
        $http.delete("http://localhost:8000/api/hosted-ats/" + hostedAt.id).then(function () {
            alert("Loại bỏ khách hàng thành công!");
            $scope.loadHostedAts();
        }, function () {
            alert("Loại bỏ khách hàng thất bại!");
        });
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
        }, function () {
            alert("Thêm khách hàng mới thất bại!");
        });
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