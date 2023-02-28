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
    $scope.rooms = [];
    $scope.selectRoom = {};
    $scope.people = {};
    $scope.peoples = [];

    $scope.init = async function () {
        await $scope.loadStatusCount();
        await $scope.loadRoom();
    }

    $scope.loadRoom = async function () {
        await $http.get("http://localhost:8000/api/rooms").then(function (resp) {
            $scope.rooms = resp.data;
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
        $scope.configCam();
        $scope.peoples.push(angular.copy($scope.people));
    }

    $scope.configCam = function () {
        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my_camera');
    }

    $scope.snapshot = function () {
    }

    $scope.removePeople = function (item) {
        $scope.peoples.splice(0, 1);
    }

    $scope.init();
});