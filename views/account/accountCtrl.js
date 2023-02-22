app.controller("accountCreateCtrl", function ($scope, $location, $http) {

    $scope.account = {
        username: null,
        password: null,
        fullName: null,
        phoneNumber: null,
        email: null,
        address: null,
        status: true
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
        $http.post("http://localhost:8000/api/accounts", $scope.account).then(function (resp) {
            $scope.account = resp.data;
            alert("Create success");
            $location.path("/account");
        });
    };
});

app.controller("accountUpdateCtrl", function ($scope, $routeParams, $http, $location) {

    $scope.account = {};

    $scope.init = async function () {
        await $scope.loadForm();
    }

    $scope.loadForm = async function () {
        await $http.get("http://localhost:8000/api/accounts/" + $routeParams.id)
            .then(function (resp) {
                if (resp.status == 200) {
                    $scope.account = resp.data;
                }
            }, function (resp) {
                alert("Can't find account by id " + $routeParams.id);
                $location.path("/account");
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
        $http.put("http://localhost:8000/api/accounts", $scope.account).then(function (resp) {
            if (resp.status == 200) {
                $scope.account = resp.data;
                alert("Update success");
            }
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

    $scope.initTable = function () {
        $http.get("http://localhost:8000/api/accounts").then(function (resp) {
            $scope.accounts = resp.data;
            $(document).ready(function () {
                $('#datatable-accounts').DataTable();
            });
        });
    }

    $scope.initTable();
});

app.controller("accountRoleCtrl", function ($scope, $window, $http) {

    $scope.accounts = [];
    $scope.roles = [];
    $scope.userRoles = [];

    $scope.init = async function () {
        await $scope.loadRole();
        await $scope.loadUserRole();
        await $scope.loadAccount();
    }

    $scope.loadAccount = async function () {
        await $http.get("http://localhost:8000/api/accounts")
            .then(resp => {
                if (resp.status == 200) {
                    $scope.accounts = resp.data;
                    $(document).ready(function () {
                        $('#datatable-accounts').DataTable();
                    });
                }
            });
    }

    $scope.loadRole = async function () {
        await $http.get("http://localhost:8000/api/roles")
            .then(resp => {
                if (resp.status == 200) {
                    $scope.roles = resp.data;
                }
            });
    }

    $scope.loadUserRole = async function () {
        await $http.get("http://localhost:8000/api/user-roles")
            .then(resp => {
                if (resp.status == 200) {
                    $scope.userRoles = resp.data;
                }
            });
    }

    $scope.userRoleOf = function (account, role) {
        return $scope.userRoles.find(userRole => userRole.account.id == account.id && userRole.role.id == role.id);
    }

    $scope.userRoleChanged = (account, role) => {
        const userRole = $scope.userRoleOf(account, role);
        if (userRole) {
            $scope.revokeUserRole(userRole);
        } else {
            $scope.grantUserRole({
                account: account,
                role: role
            });
        }
    }

    $scope.grantUserRole = function (userRole) {
        $http.post("http://localhost:8000/api/user-roles", userRole).then(resp => {
            $scope.userRoles.push(resp.data);
            alert("Cấp quyền thành công");
        }, error => {
            alert("Cấp quyền thất bại");
        });
    }

    $scope.revokeUserRole = function (userRole) {
        $http.delete("http://localhost:8000/api/user-roles/" + userRole.id).then(resp => {
            const index = $scope.userRoles.findIndex(item => item.id == userRole.id);
            $scope.userRoles.splice(index, 1);
            alert("Thu hồi quyền thành công");
        }, error => {
            alert("Thu hồi quyền thất bại");
        });
    }

    $scope.init();
});
