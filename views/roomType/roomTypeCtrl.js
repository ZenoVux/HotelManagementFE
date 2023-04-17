app.controller("roomTypeListCtrl", function ($scope, $http, $location) {
    $scope.roomTypes = [];
    $scope.form = {};
    $scope.roomType = {};
    // Load data room
    $scope.initialize = function(){
        $http.get("http://localhost:8000/api/room-types").then(resp =>{
            $scope.roomTypes = resp.data;
            $(document).ready(function () {
                // khởi tạo table id 'datatable-room-type'
                tableInvoiceDetailHistory = $('#datatable-room-type').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                    },
                    dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
                });
                // gắn ô tìm kiếm id 'search-datatable-room-type' cho table
                $('#search-datatable-room-type').keyup(function () {
                    tableInvoiceDetailHistory.search($(this).val()).draw();
                });
            });
        }).catch(error =>{
            alert("Error load data room type")
            console.log("Error", error);
        })
    }

    $scope.edit = function(roomType){
        $scope.form = roomType;
    }
    
    $scope.view = function(item) {
        $scope.roomType = item;
    }
    
    //Update room-type
    $scope.update = function(){
        var roomType = angular.copy($scope.form);
        $http.put("http://localhost:8000/api/room-types", roomType).then(resp=>{
            alert("Cập nhập thành công");
        }).catch(error=>{
            alert("Cập nhập không thành công")
            console.log("Error", error);
        })
    }

    $scope.reset = function () {
        $scope.form = {
        };
    };
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
    
    //Update room-type
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
