app.controller("roomListCtrl", function ($scope, $http) {
    $scope.form = {};
    $scope.rooms = [];
    $scope.supplyRooms = [];
    $scope.bedRooms = [];
    $scope.imageRooms = [];

    $scope.initialize = function () {
        // Load data rooms
        $http.get("http://localhost:8000/api/rooms").then(resp => {
            $scope.rooms = resp.data;
            $(document).ready(function () {
                $('#datatable-rooms').DataTable();
            });
        }).catch(error => {
            alert("Error load data room")
            console.log("Error", error);
        })
    }

    // Load data supply room
    $scope.loadSupplyRoom = function (codeRoom) {
        $http.get("http://localhost:8000/api/supply-rooms/" + codeRoom).then(resp => {
            $scope.supplyRooms = resp.data;
        }).catch(error => {
            alert("Error load data room")
            console.log("Error", error);
        })
    }

    // Load data bed room
    $scope.loadBedRoom = function (codeRoom) {
        $http.get("http://localhost:8000/api/bed-rooms/" + codeRoom).then(resp => {
            $scope.bedRooms = resp.data;
        }).catch(error => {
            alert("Error load data bed room")
            console.log("Error", error);
        })
    }

        // Load data image room
        $scope.loadImageRoom = function (codeRoom) {
            $http.get("http://localhost:8000/api/room-images/" + codeRoom).then(resp => {
                $scope.imageRooms = resp.data;
            }).catch(error => {
                alert("Error load data room")
                console.log("Error", error);
            })
        }

        $scope.url = function(imageName){
            return `http://localhost:8000/api/storage/${imageName}`;
        }
    //Pagination
    $scope.pager = {
    }

    $scope.initialize();
});

app.controller("roomCreateFormCtrl", function ($scope, $http, $location) {
    $scope.form = {
        code: 501,
        number: null,
        price: 3000000,
        maxAdultAdd: null,
        maxChildAdd: null,
        area: 60,
        isSmoking: true,
        description: "No",
        floor: {
            id: 4,
            code: "T4",
            name: "Tầng 4"
        },
        roomType: {
            id: 5,
            code: "standard",
            name: "Standard",
            adultSurcharge: 200000,
            childSurcharge: 200000,
            cancellationPolicy: "No refunds",
            otherPolicy: "No",
            description: "for 1 person"
        },
        status: 0
    };
    $scope.floors = [];

    $scope.supplys = {};
    $scope.supplySelected = [];

    $scope.bedTypes = [];
    $scope.bedTypeSelected = [];

    $scope.chooseImageRoom = [];

    // Load data room
    $scope.initialize = function () {
        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp => {
            $scope.roomTypes = resp.data;
        }).catch(error => {
            alert("Error load room type")
            console.log("Error", error);
        })
        //Load data floors
        $http.get("http://localhost:8000/api/floors").then(resp => {
            $scope.floors = resp.data;
        }).catch(error => {
            alert("Error load supply")
            console.log("Error", error);
        })
        //Load data supplys
        $http.get("http://localhost:8000/api/supplies").then(resp => {
            $scope.supplys = resp.data;
            $scope.supplys.forEach(item => {
                item.count = 0;
                item.checked = false;
            });
        }).catch(error => {
            alert("Error load supply")
            console.log("Error", error);
        })

        // Load data bed type
        $http.get("http://localhost:8000/api/bed-types").then(resp => {
            $scope.bedTypes = resp.data;
            $scope.bedTypes.forEach(item => {
                item.count = 0;
                item.checked = false;
            });
        }).catch(error => {
            alert("Error load data bed type")
            console.log("Error", error);
        })
    }

    $scope.supplySearch = function (supply) {
        return $scope.supplySelected.find(item => item.id == supply.id)
    }

    $scope.supplyChanged = async function (supply) {
        const supply2 = $scope.supplySearch(supply);
        if (supply2) {
            const index = $scope.supplySelected.findIndex(item => item.id == supply.id);
            $scope.supplySelected.splice(index, 1);
            if (supply.checked == true) {
                $scope.supplySelected.push(supply);
            }
        } else {
            await $scope.supplySelected.push(supply);
        }
    }

    $scope.bedTypeSearch = function (bedType) {
        return $scope.bedTypeSelected.find(item => item.id == bedType.id)
    }

    $scope.bedTypeChanged = async function (bedType) {
        const bedType2 = $scope.bedTypeSearch(bedType);
        if (bedType2) {
            const index = $scope.bedTypeSelected.findIndex(item => item.id == bedType.id);
            $scope.bedTypeSelected.splice(index, 1);
            if (bedType.checked == true) {
                $scope.bedTypeSelected.push(bedType);
            }
        } else {
            $scope.bedTypeSelected.push(bedType);
        }
        console.log($scope.bedTypeSelected);
    }

    $scope.createSupplyRoom = async function (room1) {
        var room = room1;
        $scope.supplySelected.forEach(item => {
            var supply = item;
            var quantity = item.count;
            var supplyRoom = {
                code: "",
                room,
                supply,
                quantity
            }
            $http.post("http://localhost:8000/api/supply-rooms", supplyRoom).then(resp => {
            }).catch(error => {
                console.log("Error", error);
            })
        });
    }

    $scope.createBedRoom = async function (room1) {
        var room = room1;
        $scope.bedTypeSelected.forEach(item => {
            var bedType = item;
            var quantityBed = item.count;
            var bedRoom = {
                code: "",
                room,
                bedType,
                quantityBed
            }
            $http.post("http://localhost:8000/api/bed-rooms", bedRoom).then(resp => {
            }).catch(error => {
                console.log("Error", error);
            })
        });
    }

    $scope.uploadImageStorage = function (files) {
        var file = new FormData();
        for (var index = 0; index < files.length; index++) {
            file.append("file", files[index]);
        }
        $http.post("http://localhost:8000/api/storage", file, {
            transformRequest: angular.identity,
            headers: {'Content-Type' : undefined},
            transformResponse: [
                function (file) { 
                    return file; 
                }
            ]
        }).then(resp => {
            $scope.chooseImageRoom.push(resp.data);
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.deleteImageStorage = function(imageName){
        $http.delete("http://localhost:8000/api/storage/" + imageName).then(resp => {
            const index = $scope.chooseImageRoom.findIndex(name => name == imageName);
            $scope.chooseImageRoom.splice(index, 1);
            document.getElementById('formrow-image-input').value = null;
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.url = function(imageName){
            return `http://localhost:8000/api/storage/${imageName}`;
    }

    $scope.createImage = function (room) {
        $scope.chooseImageRoom.forEach(item => {
            var image = {
                code: null,
                url: item
            }
            $http.post("http://localhost:8000/api/images", image).then(resp => {
                $scope.createImageRoom(resp.data, room);
            }).catch(error => {
                console.log("Error", error);
            })
        });
    }

    $scope.createImageRoom = function (image, room) {
        var roomImage = {
            code: null,
            image,
            room
        };
        $http.post("http://localhost:8000/api/room-images", roomImage).then(resp => {
        }).catch(error => {
            console.log("Error", error);
        })
    }

    // Create room
    $scope.create = async function () {
        var room = angular.copy($scope.form);
        await $http.post("http://localhost:8000/api/rooms", room).then(resp => { 
            $scope.createSupplyRoom(resp.data);
            $scope.createBedRoom(resp.data);
            $scope.createImage(resp.data);
            alert("Create thành công");
            $location.path("/room");
        }).catch(error => {
            alert("Create thất bại")
            console.log("Error", error);
        })
    }
    //Reset form
    $scope.reset = function () {
        $scope.form = {
            code: "",
            price: "",
            maxAdultAdd: "",
            maxChildAdd: "",
            area: "",
            isSmoking: true,
            description: "",
            floor: {
                id: 1,
                code: "T1",
                name: "Tầng 1"
            },
            roomType: {
                id: 8,
                code: "suite",
                name: "suite",
                adultSurcharge: 1000000,
                childSurcharge: 1200000,
                cancellationPolicy: "No refunds",
                otherPolicy: "No",
                description: "No"
            },
            status: 0
        };
        $scope.supplySelected = [];
        $scope.supplys.forEach(item => {
            item.count = 0;
            item.checked = false;
        });

        $scope.bedTypeSelected = [];
        $scope.bedTypes.forEach(item => {
            item.count = 0;
            item.checked = false;
        });
        $scope.chooseImageRoom = [];
        document.getElementById('formrow-image-input').value = null;
    };

    $scope.initialize();
});

app.controller("roomUpdateFormCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.form = {};

    $scope.supplys = [];
    $scope.supplyRooms = [];
    $scope.supplySelected = [];

    $scope.bedTypes = [];
    $scope.bedRooms = [];
    $scope.bedTypeSelected = [];

    $scope.imageRoom = [];
    $scope.chooseImageRoom = [];

    // Load data room
    $scope.initialize = async function () {
        //Load room detail
        await $http.get("http://localhost:8000/api/rooms/" + $routeParams.id).then(resp => {
            $scope.form = resp.data;
        }).catch(error => {
            alert("Error load form update")
            console.log("Error", error);
        })

        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp => {
            $scope.roomTypes = resp.data;
        }).catch(error => {
            alert("Error load room type")
            console.log("Error", error);
        })

        //Load data floors
        $http.get("http://localhost:8000/api/floors").then(resp => {
            $scope.floors = resp.data;
        }).catch(error => {
            alert("Error load supply")
            console.log("Error", error);
        })

        //Load supply room
        await $http.get("http://localhost:8000/api/supply-rooms/" + $scope.form.code).then(resp => {
            $scope.supplyRooms = resp.data;
            $scope.supplyRooms.forEach(item => {
                var supply = item.supply;
                supply.count = item.quantity;
                $scope.supplySelected.push(supply);
            })
        }).catch(error => {
            alert("Error load supply room")
            console.log("Error", error);
        })

        //Load supply
        await $http.get("http://localhost:8000/api/supplies").then(resp => {
            $scope.supplys = resp.data;
            $scope.supplys.forEach(item1 => {
                item1.count = 0;
                $scope.supplyRooms.forEach(item2 => {
                    if (item1.id == item2.supply.id) {
                        item1.checked = true;
                        item1.count = item2.quantity;
                    }
                })
            })
        }).catch(error => {
            alert("Error load supply")
            console.log("Error", error);
        })

        //Load bed room
        await $http.get("http://localhost:8000/api/bed-rooms/" + $scope.form.code).then(resp => {
            $scope.bedRooms = resp.data;
            $scope.bedRooms.forEach(item => {
                var bedRoom = item.bedType;
                bedRoom.count = item.quantityBed;
                $scope.bedTypeSelected.push(bedRoom);
            })
        }).catch(error => {
            alert("Error load bed room")
            console.log("Error", error);
        })
        //Load bed type
        await $http.get("http://localhost:8000/api/bed-types").then(resp => {
            $scope.bedTypes = resp.data;
            $scope.bedTypes.forEach(item1 => {
                item1.count = 0;
                $scope.bedRooms.forEach(item2 => {
                    if (item1.id == item2.bedType.id) {
                        item1.checked = true;
                        item1.count = item2.quantityBed;
                    }
                })
            })
        }).catch(error => {
            alert("Error load bed type")
            console.log("Error", error);
        })

        //Load image room
        await $http.get("http://localhost:8000/api/room-images/" + $scope.form.code).then(resp => {
            $scope.imageRoom = resp.data;
            $scope.imageRoom.forEach(item =>{
                $scope.chooseImageRoom.push(item.image.url);
        })
        }).catch(error => {
            alert("Error load bed type")
            console.log("Error", error);
        })
    }

    $scope.supplySearch = function (supply) {
        return $scope.supplySelected.find(item => item.id == supply.id);
    }

    $scope.supplyChanged = async function (supply) {
        const supply2 = $scope.supplySearch(supply);
        if (supply2) {
            const index = $scope.supplySelected.findIndex(item => item.id == supply.id);
            $scope.supplySelected.splice(index, 1);
            if (supply.checked == true) {
                $scope.supplySelected.push(supply);
            }
        } else {
            await $scope.supplySelected.push(supply);
        }
    }

    $scope.bedTypeSearch = function (bedType) {
        return $scope.bedTypeSelected.find(item => item.id == bedType.id)
    }

    $scope.bedTypeChanged = async function (bedType) {
        const bedType2 = $scope.bedTypeSearch(bedType);
        if (bedType2) {
            const index = $scope.bedTypeSelected.findIndex(item => item.id == bedType.id);
            $scope.bedTypeSelected.splice(index, 1);
            if (bedType.checked == true) {
                $scope.bedTypeSelected.push(bedType);
            }
        } else {
            $scope.bedTypeSelected.push(bedType);
        }
        console.log($scope.bedTypeSelected);
    }


    $scope.updateSupplyRoom = async function (room1) {
        if ($scope.bedRooms) {
            await $scope.supplyRooms.forEach(item => {
                $http.delete("http://localhost:8000/api/supply-rooms/" + item.id).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
            })
        }
        var room = room1;
        await $scope.supplySelected.forEach(item => {
            var supply = item;
            var quantity = item.count;
            var supplyRoom = {
                code: "",
                room,
                supply,
                quantity
            }
            console.log(supplyRoom);
            $http.post("http://localhost:8000/api/supply-rooms", supplyRoom).then(resp => {
            }).catch(error => {
                console.log("Error", error);
            })
        });
    }

    $scope.updateBedRoom = async function (room1) {
        if ($scope.bedRooms) {
            await $scope.bedRooms.forEach(item => {
                $http.delete("http://localhost:8000/api/bed-rooms/" + item.id).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
            })
        }

        var room = room1;
        await $scope.bedTypeSelected.forEach(item => {
            var bedType = item;
            var quantityBed = item.count;
            var bedRoom = {
                code: "",
                room,
                bedType,
                quantityBed
            }
            $http.post("http://localhost:8000/api/bed-rooms", bedRoom).then(resp => {
            }).catch(error => {
                console.log("Error", error);
            })
        });
        $scope.reset();
    }

    $scope.uploadImageStorage = function (files) {
        var file = new FormData();
        for (var index = 0; index < files.length; index++) {
            file.append("file", files[index]);
        }
        $http.post("http://localhost:8000/api/storage", file, {
            transformRequest: angular.identity,
            headers: {'Content-Type' : undefined},
            transformResponse: [
                function (file) { 
                    return file; 
                }
            ]
        }).then(resp => {
            $scope.chooseImageRoom.push(resp.data);
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.deleteImageStorage = async function(imageName){
        await $http.delete("http://localhost:8000/api/storage/" + imageName).then(resp => {
            const index = $scope.chooseImageRoom.findIndex(name => name == imageName);
            $scope.chooseImageRoom.splice(index, 1);
            document.getElementById('formrow-image-input').value = null;
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.deleteImage = function() {
        $scope.imageRoom.forEach(item =>{
            $http.delete("http://localhost:8000/api/images/" + item.image.id).then(resp => {
            }).catch(error => {
                console.log("Error", error);
            })
        })
    }

    $scope.deleteImageRoom = function(){
        $scope.imageRoom.forEach(item => {
            $http.delete("http://localhost:8000/api/room-images/" + item.id).then(resp => { 
            }).catch(error => {
                console.log("Error", error);
            })
        })
    }

    $scope.updateImageRoom =function(image, room) {
        var roomImage = {
            code: null,
            image,
            room
        };
        $http.post("http://localhost:8000/api/room-images", roomImage).then(resp =>{
        }).catch(error =>{
            console.log("Error", error);
        })
    }

    $scope.updateImage = async function(room){
        await $scope.deleteImageRoom();
        $scope.deleteImage();
        $scope.chooseImageRoom.forEach(item =>{
            var image = {
                code: null,
                url: item
            }
            $http.post("http://localhost:8000/api/images", image).then(resp =>{
                $scope.updateImageRoom(resp.data, room);
            }).catch(error =>{
                console.log("Error", error);
            })
        })
    }

    $scope.url = function(imageName){
        return `http://localhost:8000/api/storage/${imageName}`;
    }

    //Update room
    $scope.update = function () {
        var room = angular.copy($scope.form);
        $http.put("http://localhost:8000/api/rooms", room).then(resp => {
            $scope.updateSupplyRoom(resp.data);
            $scope.updateBedRoom(resp.data);
            $scope.updateImage(resp.data);
            alert("Update thành công")
            $location.path("/room");
        }).catch(error => {
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
