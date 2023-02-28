app.controller("roomListCtrl", function ($scope, $http) {
    $scope.rooms = [];
    $scope.form = {};
    $scope.supplyRooms = [];
    $scope.initialize = function(){
        // Load data rooms
        $http.get("http://localhost:8000/api/rooms").then(resp =>{
            $scope.rooms = resp.data;
        }).catch(error =>{
            alert("Error load data room")
            console.log("Error", error);
        })
    }

    $scope.loadSupplyRoom = function(codeRoom){
        $http.get("http://localhost:8000/api/supply-rooms/" + codeRoom).then(resp =>{
            $scope.supplyRooms = resp.data;
        }).catch(error =>{
            alert("Error load data room")
            console.log("Error", error);
        })
    }
    //Pagination
    $scope.pager = {

    }
    $scope.initialize();
});

app.controller("roomCreateFormCtrl", function ($scope, $http, $location) {
    $scope.form = {
        code: 200,
        price: 1000000,
        maxAdult: 2,
        maxAdultAdd: 1,
        maxChild: 2,
        maxChildAdd: 1,
        area: 30,
        isSmoking: false,
        description: "No",
        roomType: {
            id: 5,
            code: null,
            name: "Single room",
            adultSurcharge: 200000,
            childSurcharge: 200000,
            cancellationPolicy: "No refunds",
            otherPolicy: "No",
            description: "for 1 person"
        },
        status: 0
    };
    $scope.supplys = {};
    $scope.supplySelected = [];
    // Load data room
    $scope.initialize = function(){
        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp =>{
            $scope.roomTypes = resp.data;
        }).catch(error=>{
            alert("Error load room type")
            console.log("Error", error);
        })
        //Load supplys
        $http.get("http://localhost:8000/api/supplies").then(resp =>{
            $scope.supplys = resp.data;
            $scope.supplys.forEach(supply =>{
                supply.count = 0;
                supply.checked = false;
            });
        }).catch(error=>{
            alert("Error load supply")
            console.log("Error", error);
        })
    }

    $scope.supplySearch = function(supply1){
        return $scope.supplySelected.find(supply2 => supply2.supply.id == supply1.id)
    }

    $scope.supplyChanged = async function (supply1) {
        var supplyRoom = {
            code: "",
            room: {},
            supply: {},
            quantity: 0
        }
        const supply2 = $scope.supplySearch(supply1);
        if(supply2){
            const index = $scope.supplySelected.findIndex(item => item.supply.id == supply1.id);
            $scope.supplySelected.splice(index, 1);
        }else{
            supplyRoom.supply = supply1;
            await $scope.supplySelected.push(supplyRoom);
        }
    }

    $scope.quantityChanged = async function (supply1) {
        const index = $scope.supplySelected.findIndex(item => item.supply.id == supply1.id);
        $scope.supplySelected.splice(index, 1);
    }

    $scope.create = async function () {
        var room = angular.copy($scope.form);
        await $http.post("http://localhost:8000/api/rooms", room).then(resp =>{
            alert("Create thành công")
        }).catch(error=>{
            alert("Create thất bại")
            console.log("Error", error);
        })
        $scope.createSupplyRoom(room.code);
    }

    $scope.createSupplyRoom = async function (codeRoom) {
        // var room1 = {};
        // await $http.get("http://localhost:8000/api/rooms/code-room/" + codeRoom).then(resp =>{
        //     room1 = resp.data;
        // }).catch(error =>{
        //     console.log("Error", error);
        // })
        // $scope.supplySelected.forEach(supply => {
        //     var quantity = supply.count;
        //     var roomDetail = {
        //         code,
        //         room,
        //         supply,
        //         quantity
        //     }
        //     $http.post("http://localhost:8000/api/supply-rooms", roomDetail).then(resp =>{

        //     }).catch(error=>{

        //         console.log("Error", error);
        //     })
           
        // });    
        // $scope.reset();     
    }

    //Reset form
    $scope.reset = function () {
        $scope.form = {
            code: "",
            price: "",
            maxAdult: "",
            maxAdultAdd: "",
            maxChild: "",
            maxChildAdd: "",
            area: "",
            isSmoking: true,
            description: "",
            roomType: {
                id: 5,
                code: null,
                name: "Single room",
                adultSurcharge: 200000,
                childSurcharge: 200000,
                cancellationPolicy: "No refunds",
                otherPolicy: "No",
                description: "for 1 person"
            },
            status: 0
        };
        $scope.supplySelected = [];
        $scope.supplys.forEach(supply =>{
            supply.count = 0;
            supply.checked = false;
        });
    };
    $scope.initialize();
});

app.controller("roomUpdateFormCtrl", function ($scope, $routeParams, $http) {
    $scope.form = {};
    $scope.supplys = [];
    $scope.supplyRooms = [];
    $scope.supplySelected = [];

    // Load data room
    $scope.initialize = async function(){
        //Load room detail
        await $http.get("http://localhost:8000/api/rooms/" + $routeParams.id).then(resp =>{
            $scope.form = resp.data;
        }).catch(error=>{
            alert("Error load form update")
            console.log("Error", error);
        })

        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp =>{
            $scope.roomTypes = resp.data;
        }).catch(error=>{
            alert("Error load room type")
            console.log("Error", error);
        })

        //Load supply room
        await $http.get("http://localhost:8000/api/supply-rooms/" + $scope.form.code).then(resp =>{
            $scope.supplyRooms = resp.data;
            $scope.supplySelected = resp.data;
        }).catch(error=>{
            alert("Error load supply room")
            console.log("Error", error);
        })
        //Load supply
        await $http.get("http://localhost:8000/api/supplies").then(resp =>{
            $scope.supplys = resp.data;
            $scope.supplys.forEach(supply1 => {
                $scope.supplyRooms.forEach(supply2 => {
                    if (supply1.id == supply2.supply.id) {
                        supply1.checked = true;
                        supply1.quantity = supply2.quantity;
                    }
                })
            })
        }).catch(error=>{
            alert("Error load supply")
            console.log("Error", error);
        })
    }

    $scope.supplySearch = function(supply){
        return $scope.supplySelected.find(supply2 => supply2.supply.id == supply.id)
    }

    $scope.supplyChanged = async function (supply) {
        const supply1 = $scope.supplySearch(supply);
        if(supply1){
            const index = $scope.supplySelected.findIndex(item => item.supply.id == supply.id);
            $scope.supplySelected.splice(index, 1);
        }else{
            await $scope.supplySelected.push(supply);
        }
    }

    //Update room
    $scope.update = function(){
        var room = angular.copy($scope.form);
        $http.put("http://localhost:8000/api/rooms", room).then(resp=>{
            alert("Update thành công")
        }).catch(error=>{
            alert("Update không thành công")
            console.log("Error", error);
        })
    }

    //Reset form
    $scope.reset = function () {
        $scope.form = {
            code: "",
            price: "",
            maxAdult: "",
            maxAdultAdd: "",
            maxChild: "",
            maxChildAdd: "",
            area: "",
            isSmoking: true,
            description: "",
            roomType: {
                id: 5,
                code: null,
                name: "Single room",
                adultSurcharge: 200000,
                childSurcharge: 200000,
                cancellationPolicy: "No refunds",
                otherPolicy: "No",
                description: "for 1 person"
            },
        };
        $scope.supplySelected = [];
    };
    $scope.initialize();

});
