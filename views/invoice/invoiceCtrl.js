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

    $scope.init = async function () {
        await $scope.loadInvoice();
        await $scope.loadInvoiceDetails();
    }

    $scope.loadInvoice = async function () {
        await $http.get("http://localhost:8000/api/invoices/" + $routeParams.code).then(function (resp) {
            $scope.invoice= resp.data;
        });
    }

    $scope.loadInvoiceDetails = async function () {
        await $http.get("http://localhost:8000/api/invoice-details/invoice-code/" + $routeParams.code).then(function (resp) {
            $scope.invoiceDetails = resp.data;
        });
        if ($scope.invoiceDetails.length <= 0) {
            console.log("zzzzzzzzzz");
        }
    }

    $scope.loadUsedServices = async function (invoiceDetail) {
        await $http.get("http://localhost:8000/api/used-services/invoice-detail/" + invoiceDetail.id).then(function (resp) {
            invoiceDetail.usedServices = resp.data;
        });
    }

    $scope.init();
    
});