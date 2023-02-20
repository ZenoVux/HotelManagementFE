app.controller("accountCreateCtrl", function ($scope, $location, $http) {

    $scope.account = {
        username: null,
        password: null,
        fullName: null,
        phoneNumber: null,
        email: null,
        address: null
    };
    
    $scope.create = function () {
        // alert("Update success");
        if ($scope.account.password) {
            alert("Error");
            return;
        }
        if ($scope.account.password != $scope.account.confirmpassword) {
            alert("Error");
            return;
        }
        $http.post("http://localhost:8000/api/accounts", $scope.account).then(function(resp) {
            $scope.account = resp.data;
            alert("Create success");
            $location.path("/account");
        });
    };
});

app.controller("accountUpdateCtrl", function ($scope, $routeParams, $http, $location) {
    
    $scope.account = {};
    $scope.roles = [];
    $scope.userRoles = [];

    $scope.init = async function () {
        await $scope.loadForm();
        await $scope.loadUserRole();
        await $scope.loadRole();
    }

    $scope.loadUserRole = async function () {
        await $http.get("http://localhost:8000/api/user-roles/by-account?id=" + $routeParams.id)
        .then(function(resp) {
            $scope.userRoles = resp.data;
            console.log($scope.userRoles);
        });
    }

    $scope.loadForm = async function () {
        await $http.get("http://localhost:8000/api/accounts/" + $routeParams.id)
        .then(function(resp) {
            $scope.account = resp.data;
        }, function (resp) {
            alert(resp.data);
            $location.path("/account");
        });
    }

    $scope.loadRole = async function () {
        await $http.get("http://localhost:8000/api/roles").then(function(resp) {
            $scope.roles = resp.data;
            $(".select2").select2();
        });
    }

    $scope.checkRole = function (role) {
        const check = $scope.userRoles.find(item => item.role.id == role.id);
        if (check) {
            return true;
        }
        return false;
    }
    
    $scope.update = function () {
        if ($scope.account.password != $scope.account.confirmPassword) {
            alert("Error");
            return;
        }
        $http.put("http://localhost:8000/api/accounts", $scope.account).then(function(resp) {
            $scope.account = resp.data;
            alert("Update success");
        });
    };

    $scope.init();
});

app.controller("accountListCtrl", function ($scope, $window, $http) {

    $scope.accounts = [];
    $scope.account = {};

    $scope.view = function (item) {
        $scope.account = item;
        $('#myModal').modal('show');
    }

    $scope.initTable = function() {
        $http.get("http://localhost:8000/api/accounts").then(function(resp) {
            $scope.accounts = resp.data;
            $(document).ready(function() {
                $('#datatable-accounts').DataTable();
            });
        });
    }

    $scope.initTable();
});
