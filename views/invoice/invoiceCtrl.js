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

app.controller("invoiceDetailCtrl", function ($scope, $routeParams, $http, $window) {

    $scope.invoice = {};
    $scope.payment = {};
    $scope.invoiceDetails = [];
    $scope.paymentMethods = [];
    $scope.promotions = [];

    $scope.init = async function () {
        await $scope.loadInvoice();
        await $scope.loadInvoiceDetails();
    }

    $scope.loadInvoice = async function () {
        await $http.get("http://localhost:8000/api/invoices/" + $routeParams.code).then(function (resp) {
            $scope.invoice = resp.data;
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


    $scope.getTotalUsedService = function (usedServices) {
        if (!usedServices) {
            return 0;
        }
        return usedServices.reduce((total, usedService) => total + (usedService.serviceRoom.price * usedService.quantity), 0);
    }

    $scope.getDays = function (invoiceDetail) {
        if (!invoiceDetail) {
            return 0;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const checkin = new Date(invoiceDetail.checkoutExpected);
        return (now.getTime() - checkin.getTime())  / (1000 * 3600 * 24);
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
        return $scope.getTotalUsedService(usedServices) + $scope.getTotalRoom(invoiceDetail);
    }

    $scope.getTotalInvoice = function () {
        return $scope.invoice.total;
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

    $scope.handlerPayment = function() {
        console.log("payment", {
            invoiceCode: $scope.invoice.code,
            promotionCode: $scope.payment.promotion ? $scope.payment.promotion.code : null,
            paymentMethodCode: $scope.payment.paymentMethod ? $scope.payment.paymentMethod.code : null
        });
        if (!$scope.paymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!")
            return;
        }
        if (!confirm("Bạn muốn thanh toán hoá đơn " + $scope.invoice.code +  "?")) {
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

    $scope.init();

});