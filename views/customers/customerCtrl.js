app.controller("customerCtrl", function ($scope, $http) {
    $scope.initTable = function () {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/customers").then(function (resp) {
            $scope.customers = resp.data;
            $(document).ready(function () {
                $('#customer-table').DataTable();
            });
            $scope.loading = false;
        });
    }
    $scope.initTable();
    $scope.viewCustomer = function (customer) {
        $('#customer-modal').modal('show');
        $scope.selectedCustomer = customer;
        console.log(customer);
    };

});
app.controller("customerEditCtrl", function ($scope, $routeParams, $http) {
    $scope.getCustomerById = function () {
        $http.get("http://localhost:8000/api/customers/" + $routeParams.customerId).then(function (resp) {
            $scope.customer = resp.data;
            console.log($scope.customer);
        });
    }
    $scope.getCustomerById();
    $scope.updateCustomer = function () {
        $http.put("http://localhost:8000/api/customers", $scope.customer).then(function (resp) {
            if (resp.status == 200) {
                alert("Update success");
            } else {
                alert("Update failed");
            }
        });
    };
});
app.controller("customerTypeCtrl", function ($scope, $http) {
    $scope.getCustomerTypes = function () {
        $scope.loading = true;
        $http.get("http://localhost:8000/api/customers").then(function (resp) {
            $scope.customers = resp.data;
            $http.get("http://localhost:8000/api/customer-types").then(function (resp) {
                $scope.customerTypes = resp.data;
                $scope.loading = false;
                $scope.customerTypes.forEach(function (customerType) {
                    customerType.numOfCustomers = 0;
                    $scope.customers.forEach(function (customer) {
                        if (customer.customerType.id == customerType.id) {
                            customerType.numOfCustomers++;
                        }
                    });
                });
            });
        });
    }
    $scope.getCustomerTypes();
    $scope.editType = function (type) {
        $scope.customerType = angular.copy(type);
    };
    $scope.updateCustomerType = function (customerType) {
        $http.put('http://localhost:8000/api/customer-types', customerType).then(function (resp) {
            if (resp.status == 200) {
                alert("Update success");
                $scope.getCustomerTypes();
            } else {
                alert("Update failed");
            }
        });
    };
});