app.controller("invoiceCtrl", function ($scope, $http) {

    $scope.invoices = [];

    $scope.initTable = function () {
        $http.get("http://localhost:8000/api/invoices").then(function (resp) {
            $scope.invoices = resp.data;
            $(document).ready(function () {
                $('#datatable-invoices').DataTable({
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
        });
    }

    $scope.modalInvoiceDetail = async function (action, item) {
        if (action == 'show') {
            await $http.get("http://localhost:8000/api/invoice-details/invoice-code/" + item.code).then(function (resp) {
                $scope.invoiceDetails = resp.data;
            });
        } else {
            $scope.invoiceDetails = [];
        }
        console.log($scope.invoiceDetails);
        $('#modal-invoice-detail').modal(action);
    }

    $scope.initTable();
});

app.controller("invoiceDetailCtrl", function ($scope, $routeParams, $http, $window, $location) {

    $scope.invoice = {};
    $scope.payment = {};
    $scope.invoiceDetail = {};
    $scope.invoiceDetailUpdate = {};
    $scope.invoiceDetails = [];
    $scope.invoiceDetailHistories = [];
    $scope.paymentMethods = [];
    $scope.promotions = [];

    $scope.init = async function () {
        await $scope.loadInvoice();
        await $scope.loadInvoiceDetails();
    }

    $scope.loadInvoice = async function () {
        await $http.get("http://localhost:8000/api/invoices/" + $routeParams.code).then(function (resp) {
            $scope.invoice = resp.data;
        }, function () {
            alert("Có lỗi xảy ra vui lòng thử lại!");
            $location.path("/invoices");
        });
    }

    $scope.loadPaymentMethods = async function () {
        await $http.get("http://localhost:8000/api/payment-methods").then(function (resp) {
            $scope.paymentMethods = resp.data;
        });
    }

    $scope.loadPromotions = async function () {
        await $http.get("http://localhost:8000/api/promotions/by-amount?amount=" + $scope.invoice.total).then(function (resp) {
            $scope.promotions = resp.data;
        });
    }

    $scope.loadInvoiceDetails = async function () {
        await $http.get("http://localhost:8000/api/invoice-details/invoice-code/" + $routeParams.code).then(function (resp) {
            $scope.invoiceDetails = resp.data;
        });
    }

    $scope.loadUsedServices = async function (invoiceDetail) {
        await $http.get("http://localhost:8000/api/used-services/invoice-detail/" + invoiceDetail.id).then(function (resp) {
            invoiceDetail.usedServices = resp.data;
        });
    }

    $scope.loadInvoiceDetailHistories = async function () {
        await $http.get("http://localhost:8000/api/invoice-detail-histories?invoiceDetailId=" + $scope.invoiceDetail.id).then(function (resp) {
            $scope.invoiceDetailHistories = resp.data;
        });
    }

    $scope.initTableInvoiceDetailHistory = function () {
        $(document).ready(function () {
            tableInvoiceDetailHistory = $('#datatable-invoice-detail-history').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                },
                dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
            });
            $('#search-datatable-invoice-detail-history').keyup(function () {
                tableInvoiceDetailHistory.search($(this).val()).draw();
            });
        });
    }

    $scope.clearTableInvoiceDetailHistory = function () {
        $(document).ready(function () {
            tableInvoiceDetailHistory.clear();
            tableInvoiceDetailHistory.destroy();
        });
    }

    $scope.getTotalService = function (usedService) {
        const startedTime = new Date(usedService.startedTime);
        startedTime.setHours(0, 0, 0, 0);
        const endedTime = new Date(usedService.endedTime);
        endedTime.setHours(0, 0, 0, 0);
        const days = (endedTime.getTime() - startedTime.getTime()) / (1000 * 3600 * 24);
        return usedService.servicePrice * days;
    }

    $scope.getTotalUsedService = function (usedServices) {
        if (!usedServices) {
            return 0;
        }
        return usedServices.reduce((total, usedService) => total + $scope.getTotalService(usedService), 0);
    }

    $scope.getDays = function (invoiceDetail) {
        if (!invoiceDetail) {
            return 0;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const checkinExpected = new Date(invoiceDetail.checkinExpected);
        checkinExpected.setHours(0, 0, 0, 0);
        const checkoutExpected = new Date(invoiceDetail.checkoutExpected);
        checkoutExpected.setHours(0, 0, 0, 0);
        if (now.getTime() === checkinExpected.getTime()) {
            return 1;
        } else if (now.getTime() > checkoutExpected.getTime()) {
            return (checkoutExpected.getTime() - checkinExpected.getTime()) / (1000 * 3600 * 24);
        } else {
            return (now.getTime() - checkinExpected.getTime()) / (1000 * 3600 * 24);
        }
    }

    $scope.getDiscount = function () {
        if ($scope.payment.promotion) {
            const discount = $scope.invoice.total / 100 * $scope.payment.promotion.percent;
            if (discount >= $scope.payment.promotion.maxDiscount) {
                return $scope.payment.promotion.maxDiscount;
            }
            return discount;
        } else {
            return 0;
        }
    }

    $scope.getTotalRoom = function (invoiceDetail) {
        if (!invoiceDetail) {
            return 0;
        }
        return invoiceDetail.room.price * $scope.getDays(invoiceDetail);
    }

    $scope.getTotalInvoiceDetail = function (invoiceDetail, usedServices) {
        if (!usedServices || !invoiceDetail) {
            return 0;
        }
        return $scope.getTotalUsedService(usedServices) + $scope.getTotalRoom(invoiceDetail) - invoiceDetail.deposit + invoiceDetail.earlyCheckinFee + invoiceDetail.lateCheckoutFee;
    }

    $scope.getTotalInvoice = function () {
        // return $scope.invoiceDetails.reduce((total, invoiceDetail) => total + $scope.getTotalInvoiceDetail(invoiceDetail, invoiceDetail.usedServices), 0);
        return $scope.invoice.total;
    }

    $scope.getTotalDeposit = function () {
        return $scope.invoiceDetails.reduce((total, invoiceDetail) => total + invoiceDetail.deposit, 0);
    }

    $scope.getTotalPayment = function () {
        return $scope.getTotalInvoice() - $scope.getDiscount();
    }

    $scope.isSplitInvoice = function () {
        if ($scope.isPaymentInvoice() && $scope.invoiceDetails.length >= 2) {
            return true;
        }
        return false;
    }

    $scope.isPaymentInvoice = function () {
        if ($scope.invoice.status == 2 || $scope.invoice.status == 3) {
            return true;
        }
        return false;
    }

    $scope.modalPayment = async function (action) {
        if (action == "show") {
            await $scope.loadPromotions();
            await $scope.loadPaymentMethods();
        } else {
            $scope.paymentMethods = [];
        }
        $('#modal-payment').modal(action);
    }

    $scope.modalUpdateRoom = async function (action, invoiceDetail) {
        $scope.invoiceDetail = invoiceDetail;
        if (action == "show") {
            $scope.invoiceDetailUpdate.invoiceDetailId = $scope.invoiceDetail.id;
            $scope.invoiceDetailUpdate.roomPrice = $scope.invoiceDetail.roomPrice;
            $scope.invoiceDetailUpdate.deposit = $scope.invoiceDetail.deposit;
            $scope.invoiceDetailUpdate.earlyCheckinFee = $scope.invoiceDetail.earlyCheckinFee;
            $scope.invoiceDetailUpdate.lateCheckoutFee = $scope.invoiceDetail.lateCheckoutFee;
            $scope.invoiceDetailUpdate.note = "";
        } else {
            $scope.invoiceDetailUpdate = {};
        }
        $('#modal-update-room').modal(action);
    }

    $scope.modalHistoryRoom = async function (action, invoiceDetail) {
        $scope.invoiceDetail = invoiceDetail;
        if (action == "show") {
            await $scope.loadInvoiceDetailHistories();
            await $scope.initTableInvoiceDetailHistory();
        } else {
            await $scope.clearTableInvoiceDetailHistory();
            $scope.invoiceDetailHistories = [];
        }
        $('#modal-history-room').modal(action);
        setTimeout(function () {
            $('#search-datatable-invoice-detail-history').focus()
        }, 1000);
    }

    $scope.handlerUpdateRoom = function () {
        if ($scope.invoiceDetailUpdate.note === "") {
            alert("Vui lòng nhập ghi chú!");
            $('#note').focus()
            return;
        }
        if (!confirm("Bạn muốn cập nhật phòng " + $scope.invoiceDetail.room.code + "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/update-invoice-detail", $scope.invoiceDetailUpdate).then(function (resp) {
            alert("Cập nhật thành công!");
            $window.location.reload();
        }, function () {
            alert("Cập nhật thất bại!");
        });
    }

    $scope.handlerVNPay = function () {
        $window.open("http://localhost:8000/payment/invoice/" + $scope.invoice.code, "_blank")
    }

    $scope.handlerPayment = function () {
        console.log("payment", {
            invoiceCode: $scope.invoice.code,
            promotionCode: $scope.payment.promotion ? $scope.payment.promotion.code : null,
            paymentMethodCode: $scope.payment.paymentMethod ? $scope.payment.paymentMethod.code : null
        });
        if (!$scope.payment.paymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!")
            return;
        }
        if (!confirm("Bạn muốn thanh toán hoá đơn " + $scope.invoice.code + "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/payment", {
            invoiceCode: $scope.invoice.code,
            promotionCode: $scope.payment.promotion ? $scope.payment.promotion.code : null,
            paymentMethodCode: $scope.payment.paymentMethod ? $scope.payment.paymentMethod.code : null
        }).then(function (resp) {
            alert("Thanh toán thành công!");
            $window.location.reload();
        }, function () {
            alert("Thanh toán thất bại!");
        });
    }

    $scope.confirmPayment = function () {
        if (!confirm("Bạn muốn xác nhận đã thanh toán hoá đơn " + $scope.invoice.code + "?")) {
            return;
        }
        $http.post("http://localhost:8000/api/hotel/confirm-payment", {
            invoiceCode: $scope.invoice.code
        }).then(function (resp) {
            alert("Xác nhận thành công!");
            $window.location.reload();
        }, function () {
            alert("Xác nhận thất bại!");
        });
    }

    $scope.init();

});