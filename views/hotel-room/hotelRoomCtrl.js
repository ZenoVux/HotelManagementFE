app.controller("hotelRoomCtrl", function ($scope, $location, $http) {
    $scope.statuses = [
        {
            id: 0,
            name: "Trống"
        },
        {
            id: 3,
            name: "Đang đặt"
        },
        {
            id: 4,
            name: "Nhận phòng"
        },
        {
            id: 2,
            name: "Đang ở"
        },
        {
            id: 5,
            name: "Quá hạn"
        },
        {
            id: 1,
            name: "Không hoạt động"
        }
    ]
    $scope.statusCounts = [];
    $scope.floors = [];
    $scope.hotelRooms = [];
    $scope.selectRoom = {};
    $scope.people = {
        name: "Luân"
    };
    $scope.peoples = [];

    $scope.init = async function () {      
        await $scope.loadStatusCount();
        await $scope.loadHotelRooms();
        // await $scope.loadFloors();
    }

    $scope.loadHotelRooms = async function () {
        await $http.get("http://localhost:8000/api/rooms/hotel-room").then(function (resp) {
            $scope.hotelRooms = resp.data;
        });
    }

    $scope.loadFloors = function () {
        // $scope.hotelRooms.forEach(element => {
            
        // });
        $scope.floors.push({
            name: "Tầng 1",
            rooms: $scope.hotelRooms
        });
        console.log($scope.floors)
        // await $http.get("http://localhost:8000/api/rooms/floor/" + floor.id).then(function (resp) {
        //     floor.rooms = resp.data;
        // });
    }

    $scope.loadStatusCount = async function () {
        await $http.get("http://localhost:8000/api/rooms/status-count").then(function (resp) {
            $scope.statusCounts = resp.data;
        });
    }

    $scope.checkStatusCount = function (status) {
        const statusCount = $scope.statusCounts.find(item => item.status == status);
        if (statusCount) {
            return statusCount.count;
        }
        return 0;
    }

    
    $scope.getColor = function (name, status) {
        return name + (status == 0 ? '-success' : (status == 1 ? '-sliver' : (status == 2 ? '-danger' : (status == 3 ? '-secondary' : (status == 4 ? '-primary' : '-warning')))))
    }

    $scope.roomDetail = function (item) {
        $scope.checkinRoom(item);
    }

    $scope.checkin = function (room) {
        $location.path("/checkin/" + room.roomCode);
    }

    $scope.checkout = function (room) {
        $location.path("/checkout/" + room.roomCode);
        
    }

    $scope.init();
});