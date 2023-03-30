app.controller("invoiceCtrl", function ($scope, $http) {

    $scope.invoices = [];

    $scope.initTable = function () {
        $http.get("http://localhost:8000/api/invoices").then(function (resp) {
            $scope.invoices = resp.data;
            $(document).ready(function () {
                $('#datatable-invoices').DataTable();
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

app.controller("invoiceDetailCtrl", function ($scope, $routeParams, $http) {

    $scope.invoice = {};
    $scope.invoiceDetails = [];
    $scope.paymentMethods = [];
    $scope.promotions = [];
    $scope.total = 0;

    $scope.init = async function () {
        await $scope.loadInvoice();
        await $scope.loadInvoiceDetails();
    }

    $scope.loadInvoice = async function () {
        await $http.get("http://localhost:8000/api/invoices/" + $routeParams.code).then(function (resp) {
            $scope.invoice= resp.data;
        });
    }

    $scope.loadPaymentMethods = async function () {
        await $http.get("http://localhost:8000/api/payment-methods").then(function (resp) {
            $scope.paymentMethods = resp.data;
        });
    }

    $scope.loadPromotions = async function () {
        await $http.get("http://localhost:8000/api/promotions").then(function (resp) {
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
    

    $scope.totalUsedService = function (usedServices) {
        if (!usedServices) {
            return 0;
        }
        return usedServices.reduce((total, usedService) => total + (usedService.serviceRoom.price * usedService.quantity), 0);
    }

    $scope.getDate = function (invoiceDetail) {
        if (!invoiceDetail) {
            return 0;
        }
        const now = new Date();
        const checkin = new Date(invoiceDetail.invoice.booking.checkinExpected);
        return now.getDate() - checkin.getDate();
    }

    $scope.totalRoom = function (invoiceDetail) {
        if (!invoiceDetail) {
            return 0;
        }
        return invoiceDetail.room.price * $scope.getDate(invoiceDetail);
    }

    $scope.totalInvoiceDetail = function (invoiceDetail, usedServices) {
        if (!usedServices || !invoiceDetail) {
            return 0;
        }
        return $scope.totalUsedService(usedServices) + $scope.totalRoom(invoiceDetail);
    }

    $scope.totalInvoice = function () {
        if ($scope.invoice.promotion) {
            const price = $scope.invoice.total / 100 * $scope.invoice.promotion.percent;
            $scope.total = $scope.invoice.total - price;
        } else {
            console.log("aaaaaaaaaaaaa");
            $scope.total = $scope.invoice.total;
        }
        
    }

    $scope.isSplitInvoice = function () {
        if ($scope.isPaymentInvoice() && $scope.invoiceDetails.length >= 2) {
            return true;
        }
        return false;
    }

    $scope.isPaymentInvoice = function () {
        for (let i = 0; i < $scope.invoiceDetails.length; i++) {
            const invoiceDetail = $scope.invoiceDetails[i];
            if (invoiceDetail.status == 1) {
                return false;
            }
        }
        return true;
    }

    $scope.modalPayment = async function (action) {
        if (action == "show") {
            await $scope.totalInvoice();
            await $scope.loadPromotions();
            await $scope.loadPaymentMethods();
        } else {
            $scope.paymentMethods = [];
        }
        $('#modal-payment').modal(action);
    }

    $scope.init();
    
});