app.controller("roomTypeListCtrl", function ($scope, $http) {
    $scope.roomTypes = [];
    $scope.form = {};
    // Load data room
    $scope.initialize = function(){
        $http.get("http://localhost:8000/api/room-types").then(resp =>{
            $scope.roomTypes = resp.data;
            $(document).ready(function () {
                $('#datatable-room-types').DataTable();
            });
        }).catch(error =>{
            alert("Error load data room type")
            console.log("Error", error);
        })
    }
    //Pagination
    $scope.pager = {

    }
    $scope.initialize();
});

app.controller("roomTypeCreateFormCtrl", function ($scope, $http, $location) {
    $scope.roomTypes = [];
    $scope.form = {

    };

    $scope.create = function () {
        var roomType = angular.copy($scope.form);
        $http.post("http://localhost:8000/api/room-types", roomType).then(resp =>{
            alert("Create thành công")
        }).catch(error=>{
            alert("Create thất bại")
            console.log("Error", error);
        })
    }


    //Reset form
    $scope.reset = function () {
        $scope.form = {
            
        };
    };
});

app.controller("roomTypeUpdateFormCtrl", function ($scope, $routeParams, $http) {
    $scope.form = {};
    
    //Load room detail
    $scope.edit = function(){
        $http.get("http://localhost:8000/api/room-types/" + $routeParams.id).then(resp =>{
            $scope.form = resp.data;
        }).catch(error=>{
            alert("Error load form update")
            console.log("Error", error);
        })

    }
    
    //Update room
    $scope.update = function(){
        var roomType = angular.copy($scope.form);
        $http.put("http://localhost:8000/api/room-types", roomType).then(resp=>{
            alert("Update thanh cong")
        }).catch(error=>{
            alert("Update khong thanh cong")
            console.log("Error", error);
        })
    }

    //Reset form
    $scope.reset = function () {
        $scope.form = {
            
        };
    };
    $scope.edit();
});
