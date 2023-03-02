app.controller("hotelRoomCtrl", function ($scope, $location, $http) {
    $scope.statuses = [
        {
            id: 0,
            name: "Trống"
        },
        {
            id: 1,
            name: "Đang ở"
        },
        {
            id: 2,
            name: "Đã đặt"
        },
        {
            id: 3,
            name: "Quá hạn"
        }
    ]
    $scope.statusCounts = [];
    $scope.floors = [];
    $scope.rooms = [];
    $scope.selectRoom = {};
    $scope.people = {};
    $scope.peoples = [];

    $scope.init = async function () {
        await $scope.loadStatusCount();
        await $scope.loadFloors();
    }

    $scope.loadFloors = async function () {
        await $http.get("http://localhost:8000/api/floors").then(function (resp) {
            $scope.floors = resp.data;
        });
    }

    $scope.loadRooms = async function (floor) {
        await $http.get("http://localhost:8000/api/rooms/floor/" + floor.id).then(function (resp) {
            floor.rooms = resp.data;
        });
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

    $scope.checkinRoom = function (item) {
        $scope.selectRoom = item;
        $('#checkinModal').modal('show');
        $('#secondmodal').modal('hide');
        $scope.people = {
            fullName: "Vũ Văn Luân",
            phoneNumber: "0987654321",
            email: "luanvu0702@gmail.com",
            dateOfBirth: "07/02/2002",
            gender: "Nam",
            peopleId: "87265232724",
            placeOfBirth: "Thái Bình",
            address: "Hà Nội",
            checkinDate: "25/02/2023",
            checkoutDate: "26/02/2023"
        }
        Webcam.reset();
    }

    $scope.roomDetail = function (item) {
        $scope.checkinRoom(item);
    }

    $scope.addPeople = function () {
        $('#checkinModal').modal('hide');
        $('#secondmodal').modal('show');
        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        $scope.configCam();
        $scope.peoples.push(angular.copy($scope.people));
    }

    $scope.configCam = function () {
        Webcam.attach('#font-img');
        Webcam.attach('#back-img');
    }

    $scope.offCam = function () {
        $('#checkinModal').modal('show');
    }

    $scope.snapshotFont = function () {
        Webcam.snap( function(data_uri) {
            document.getElementById('font-img').innerHTML = 
            '<img id="imageprev" src="'+data_uri+'"/>';
        } );

        // Webcam.reset();
    }

    $scope.snapshotBack = function () {
        Webcam.snap( function(data_uri) {
            document.getElementById('back-img').innerHTML = 
            '<img id="imageprev" src="'+data_uri+'"/>';
        } );

        // Webcam.reset();
    }

    $scope.removePeople = function (item) {
        $scope.peoples.splice(0, 1);
    }

    $scope.init();
});