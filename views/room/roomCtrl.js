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
                // khởi tạo table id 'datatable-rooms'
                tableInvoiceDetailHistory = $('#datatable-rooms').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json',
                    },
                    dom: 't<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
                });
                // gắn ô tìm kiếm id 'search-datatable-rooms' cho table
                $('#search-datatable-rooms').keyup(function () {
                    tableInvoiceDetailHistory.search($(this).val()).draw();
                });
            });
        }).catch(error => {
            console.log("Error", error);
        })
    }

    // Load data supply room
    $scope.loadSupplyRoom = function (codeRoom) {
        $http.get("http://localhost:8000/api/supply-rooms/" + codeRoom).then(resp => {
            $scope.supplyRooms = resp.data;
        }).catch(error => {
            console.log("Error", error);
        })
    }

    // Load data bed room
    $scope.loadBedRoom = function (codeRoom) {
        $http.get("http://localhost:8000/api/bed-rooms/" + codeRoom).then(resp => {
            $scope.bedRooms = resp.data;
        }).catch(error => {
            console.log("Error", error);
        })
    }

        // Load data image room
        $scope.loadImageRoom = function (codeRoom) {
            $http.get("http://localhost:8000/api/room-images/" + codeRoom).then(resp => {
                $scope.imageRooms = resp.data;
            }).catch(error => {
                console.log("Error", error);
            })
        }

        $scope.url = function(imageName){
            return `http://localhost:8000/images/${imageName}`;
        }

    $scope.initialize();
});

app.controller("roomCreateFormCtrl", function ($scope, $http, $location) {
    $scope.form = {
        number: null,
        price: 3000000,
        maxAdultAdd: 0,
        maxChildAdd: 0,
        area: 60,
        isSmoking: true,
        description: "No",
        floor: {
            id: 1
        },
        roomType: {
            id: 5
        },
        status: true
    };

    $scope.floors = [];

    $scope.supplys = {};
    $scope.supplySelected = [];

    $scope.bedTypes = [];
    $scope.bedTypeSelected = [];

    $scope.chooseImageRooms = [];

    // Load data room
    $scope.initialize = function () {
        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp => {
            $scope.roomTypes = resp.data;
        }).catch(error => {
            console.log("Error", error);
        })
        //Load data floors
        $http.get("http://localhost:8000/api/floors").then(resp => {
            $scope.floors = resp.data;
        }).catch(error => {
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
            if ((bedType2.id == 6 || bedType2.id == 7) && bedType2.count != 1) {
                alert(bedType2.name + " trong phòng chỉ được tối đa 1 cái");
                bedType2.count = 1;
            }else if (bedType2.id == 5 && (bedType2.count < 1 || bedType2.count > 2)) {
                alert(bedType2.name + " trong phòng chỉ được tối thiểu 1 cái hoặc tối đa 2 cái");
                if (bedType2.count < 1) {
                    bedType2.count = 1;
                } else {
                    bedType2.count = 2;
                }
            }else {
                const index = $scope.bedTypeSelected.findIndex(item => item.id == bedType.id);
                $scope.bedTypeSelected.splice(index, 1);
                if (bedType.checked == true) {
                    $scope.bedTypeSelected.push(bedType);
                }
            }
        } else {
            if (bedType.id != 5) {
                $scope.bedTypeSelected.forEach(item =>{
                    if (item.id == 6 || item.id == 7) {
                        alert("Trong phòng chỉ được tối thiểu 1 loại giường đôi");
                        bedType.checked = false;
                    }
                })
            }
            if (bedType.checked) {
                bedType.count = 1;
                $scope.bedTypeSelected.push(bedType);
            }
        }
    }

    $scope.createSupplyRoom = async function (room1) {
        if ($scope.supplySelected) {
            var room = room1;
            $scope.supplySelected.forEach(item => {
                var supply = item;
                var quantity = item.count;
                var supplyRoom = {
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
        
    }

    $scope.createBedRoom = async function (room1) {
        if ($scope.bedTypeSelected) {
            var room = room1;
            room.numAdults = 0;
            room.numChilds = 0;
            $scope.bedTypeSelected.forEach(item => {
                var bedType = item;
                var quantityBed = item.count;
                var bedRoom = {
                    room,
                    bedType,
                    quantityBed
                }
                $http.post("http://localhost:8000/api/bed-rooms", bedRoom).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
                room.numAdults += bedType.maxAdults * quantityBed;
                room.numChilds += bedType.maxChilds * quantityBed;
    
                $http.put("http://localhost:8000/api/rooms", room).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                });
            });
        }
    }

    $scope.uploadImageStorage = function (files) {
        var fileImages = [];
        for (var index = 0; index < files.length; index++) {
            var file = new FormData();
            file.append("file", files[index]);
            fileImages.push(file);
        }
        fileImages.forEach(item => {
            $http.post("http://localhost:8000/api/storage", item, {
                transformRequest: angular.identity,
                headers: {'Content-Type' : undefined},  
                transformResponse: [
                    function (item) { 
                        return item;
                    }
                ]
            }).then(resp => {
                $scope.chooseImageRooms.push(resp.data);
            }).catch(error => {
                console.log("Error", error);
            })
        })
    }

    $scope.test = function (params) {
        console.log(params);
    }
    
    $scope.deleteImageStorage = function(imageName){
        $http.delete("http://localhost:8000/api/storage/" + imageName).then(resp => {
            const index = $scope.chooseImageRooms.findIndex(name => name == imageName);
            $scope.chooseImageRooms.splice(index, 1);
            document.getElementById('formrow-image-input').value = null;
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.url = function(imageName){
            return `http://localhost:8000/images/${imageName}`;
    }

    $scope.createImageRoom = function (room) {
        if ($scope.chooseImageRooms) {
            $scope.chooseImageRooms.forEach(item =>{
                var fileName = item;
                var roomImage = {
                    room,
                    fileName
                };
                $http.post("http://localhost:8000/api/room-images", roomImage).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
            })
        }
    }

    $scope.create = async function () {
        if ($scope.form.status) {
            $scope.form.status = 0;
        }else{
            $scope.form.status = 1;
        }
        var room = angular.copy($scope.form);
        await $http.post("http://localhost:8000/api/rooms", room).then(resp => { 
            $scope.createSupplyRoom(resp.data);
            $scope.createBedRoom(resp.data);
            $scope.createImageRoom(resp.data);
            alert("Create thành công");
            $location.path("/room");
        }).catch(error => {
            alert("Create thất bại")
            console.log("Error", error);
        })
    }

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
                id: 1
            },
            roomType: {
                id: 5
            },
            status: true
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
        $scope.chooseImageRooms = [];
        document.getElementById('formrow-image-input').value = null;
    };
    
    $scope.initialize();
});

app.controller("roomUpdateFormCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.form = {};

    $scope.floors = [];

    $scope.supplys = [];
    $scope.supplyRooms = [];
    $scope.supplySelected = [];

    $scope.bedTypes = [];
    $scope.bedRooms = [];
    $scope.bedTypeSelected = [];

    $scope.imageRooms = [];
    $scope.chooseImageRooms = [];

    // Load data room
    $scope.initialize = async function () {
        //Load room detail
        await $http.get("http://localhost:8000/api/rooms/" + $routeParams.id).then(resp => {
            $scope.form = resp.data;
            if ($scope.form.status == 1) {
                $scope.form.status2 = false;
            } else {
                $scope.form.status2 = true;
            }
        }).catch(error => {
            console.log("Error", error);
        })

        //Load room type
        $http.get("http://localhost:8000/api/room-types").then(resp => {
            $scope.roomTypes = resp.data;
        }).catch(error => {
            console.log("Error", error);
        })

        //Load data floors
        $http.get("http://localhost:8000/api/floors").then(resp => {
            $scope.floors = resp.data;
        }).catch(error => {
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
            console.log("Error", error);
        })

        //Load data floors
        $http.get("http://localhost:8000/api/floors").then(resp => {
            $scope.floors = resp.data;
        }).catch(error => {
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
            console.log("Error", error);
        })

        //Load image room
        await $http.get("http://localhost:8000/api/room-images/" + $scope.form.code).then(resp => {
            $scope.imageRooms = resp.data;
            $scope.imageRooms.forEach(item =>{
                $scope.chooseImageRooms.push(item);
            })
        }).catch(error => {
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
            if ((bedType2.id == 6 || bedType2.id == 7) && bedType2.count != 1) {
                alert(bedType2.name + " trong phòng chỉ được tối đa 1 cái");
                bedType2.count = 1;
            }else if (bedType2.id == 5 && (bedType2.count < 1 || bedType2.count > 2)) {
                alert(bedType2.name + " trong phòng chỉ được tối thiểu 1 cái hoặc tối đa 2 cái");
                if (bedType2.count < 1) {
                    bedType2.count = 1;
                } else {
                    bedType2.count = 2;
                }
            }else {
                const index = $scope.bedTypeSelected.findIndex(item => item.id == bedType.id);
                $scope.bedTypeSelected.splice(index, 1);
                if (bedType.checked == true) {
                    $scope.bedTypeSelected.push(bedType);
                }
            }
        } else {
            if (bedType.id != 5) {
                $scope.bedTypeSelected.forEach(item =>{
                    if (item.id == 6 || item.id == 7) {
                        alert("Trong phòng chỉ được tối thiểu 1 loại giường đôi");
                        bedType.checked = false;
                    }
                })
            }
            if (bedType.checked) {
                bedType.count = 1;
                $scope.bedTypeSelected.push(bedType);
            }
        }
    }

    $scope.updateSupplyRoom = async function (room1) {
        if ($scope.supplyRooms) {
            await $scope.supplyRooms.forEach(item => {
                $http.delete("http://localhost:8000/api/supply-rooms/" + item.id).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
            })
        }
        if ($scope.supplySelected) {
            var room = room1;
            await $scope.supplySelected.forEach(item => {
                var supply = item;
                var quantity = item.count;
                var supplyRoom = {
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
        if ($scope.bedTypeSelected) {
            var room = room1;
            room.numAdults = 0;
            room.numChilds = 0;
            await $scope.bedTypeSelected.forEach(item => {
                var bedType = item;
                var quantityBed = item.count;
                var bedRoom = {
                    room,
                    bedType,
                    quantityBed
                }
                $http.post("http://localhost:8000/api/bed-rooms", bedRoom).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                })
                room.numAdults += bedType.maxAdults * quantityBed;
                room.numChilds += bedType.maxChilds * quantityBed;
    
                $http.put("http://localhost:8000/api/rooms", room).then(resp => {
                }).catch(error => {
                    console.log("Error", error);
                });
            });
        }
    }

    $scope.uploadImageStorage = function (files) {
        var fileImages = [];
        for (var index = 0; index < files.length; index++) {
            var file = new FormData();
            file.append("file", files[index]);
            fileImages.push(file);
        }
        fileImages.forEach(item => {
            $http.post("http://localhost:8000/api/storage", item, {
                transformRequest: angular.identity,
                headers: {'Content-Type' : undefined},
                transformResponse: [
                    function (item) { 
                        return item; 
                    }
                ]
            }).then(resp => {
                var fileName = resp.data;
                var imageRoom = {
                    id: null,
                    room: null,
                    fileName
                };
                $scope.chooseImageRooms.push(imageRoom);
            }).catch(error => {
                console.log("Error", error);
            })
        })
    }

    $scope.deleteImageStorage = async function(imageName){
        await $http.delete("http://localhost:8000/api/storage/" + imageName).then(resp => {
            const index = $scope.chooseImageRooms.findIndex(name => name.fileName == imageName);
            $scope.chooseImageRooms.splice(index, 1);
            document.getElementById('formrow-image-input').value = null;
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.deleteImageRoom = function(){
        if ($scope.chooseImageRooms) {
            $scope.chooseImageRooms.forEach(item1 =>{
                $scope.imageRooms.forEach(item2 =>{
                    if(item1.fileName == item2.fileName){
                        const index1 = $scope.imageRooms.findIndex(name => name.fileName == item1.fileName);
                        $scope.imageRooms.splice(index1, 1);
                        const index2 = $scope.chooseImageRooms.findIndex(name => name.fileName == item2.fileName);
                        $scope.chooseImageRooms.splice(index2, 1);
                    }
                })
            });
        }

        if ($scope.imageRooms) {
            $scope.imageRooms.forEach(item => {
                $http.delete("http://localhost:8000/api/room-images/" + item.id).then(resp => { 
                }).catch(error => {
                    console.log("Error", error);
                })
            })
        }
    }

    $scope.updateImageRoom =function(room) {
        $scope.deleteImageRoom();
        if ($scope.chooseImageRooms) {
            $scope.chooseImageRooms.forEach(item =>{
                var fileName = item.fileName;
                var roomImage = {
                    room,
                    fileName
                };
                $http.post("http://localhost:8000/api/room-images", roomImage).then(resp =>{
    
                }).catch(error =>{
                    console.log("Error", error);
                })
            })
        }
    }

    $scope.url = function(imageName){
        return `http://localhost:8000/images/${imageName}`;
    }

    //Update room
    $scope.update = function () {
        if ($scope.form.status2 && $scope.form.status == 1) {
            $scope.form.status = 0;
        }else if(!$scope.form.status2 && $scope.form.status == 0){
            $scope.form.status = 1;
        }
        var room = angular.copy($scope.form);
        $http.put("http://localhost:8000/api/rooms", room).then(resp => {
            $scope.updateSupplyRoom(resp.data);
            $scope.updateBedRoom(resp.data);
            $scope.updateImageRoom(resp.data);
            alert("Update thành công");
            $location.path("/room");
        }).catch(error => {
            alert("Update không thành công");
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
