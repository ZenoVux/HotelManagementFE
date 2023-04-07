app.controller("promotionCtrl", function ($scope, $http) {
	$scope.showbut = true;
	$scope.items = [];
	$scope.form = {};
	$scope.initialize = function () {

		$http.get("http://localhost:8000/api/promotions").then(resp => {
			$scope.items = resp.data;
		})
	}
	$scope.initialize();

	$scope.create = function () { //create a new service 
		var today = new Date();
		if ($scope.form.startedDate == null || $scope.form.endedDate == null) {
			alert('Hãy chọn ngày bắt đầu, kết thúc!.');
			return
		} else if ($scope.form.startedDate < today.setDate(today.getDate() - 1)) {
			alert('Ngày bắt đầu phải được tính từ ngày hôm nay.');
			return
		} else if ($scope.form.endedDate < $scope.form.startedDate) {
			alert('Ngày kết thúc phải sau ngày bắt đầu.');
			return
		} else {
			var item = angular.copy($scope.form);
			$http.post("http://localhost:8000/api/promotions", item).then(resp => {
				$scope.initialize();
				alert("Adding success !");
				$scope.clear();
			}).catch(error => {
				alert("Adding failed !")
				console.log("Error", error)
			})

		}
	}

	$scope.update = function () {

		var today = new Date();
		if ($scope.form.startedDate == null || $scope.form.endedDate == null) {
			alert('Hãy chọn ngày bắt đầu, kết thúc!.');
			return
		} else if ($scope.form.startedDate < today.setDate(today.getDate() - 1)) {
			alert('Ngày bắt đầu phải được tính từ ngày hôm nay.');
			return
		} else if ($scope.form.endedDate < $scope.form.startedDate) {
			alert('Ngày kết thúc phải sau ngày bắt đầu.');
			return
		} else {
			var item = angular.copy($scope.form);
			$http.put("http://localhost:8000/api/promotions", item).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id)
				$scope.items[index] = item;
				alert("Update success!");
				$scope.clear();
			}).catch(error => {
				alert("Update failed!")
				console.log("Error", error)
			})
		}
	}

	$scope.view = function (s) {//details
		const myModal = new bootstrap.Modal('#exampleModal');
		myModal.show();
		$scope.showbut = false;
		$scope.form = angular.copy(s);
	}

	$scope.edit = function (s) {//edit
		$scope.showbut = false;
		$scope.form = angular.copy(s);
	}

	$scope.clear = function (s) {//clear
		$scope.showbut = true;
		$scope.form = {};
	}

	$scope.close = function () {
		var myModalEl = document.getElementById('exampleModal');
		var modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();
		$scope.form = {}
		$scope.showbut = true;
	}
});

app.controller("promotionRoomCtrl", function ($scope, $http) {
	$scope.loading = false;
	$scope.roomTypes = [];
	$scope.rooms = [];
	$scope.promotions = [];
	$scope.proRooms = [];
	$scope.init = async function () {
		$scope.loading = true;
		await $scope.loadRoomType();
		await $scope.loadPromotion();
		await $scope.loadPromotionRoom();
	}

	$scope.loadRoomType = async function () {
		await $http.get("http://localhost:8000/api/room-types")
			.then(resp => {
				if (resp.status == 200) {
					$scope.roomTypes = resp.data;
				}
			});
		await $http.get("http://localhost:8000/api/rooms")
			.then(resp => {
				if (resp.status == 200) {
					$scope.rooms = resp.data;
				}
			});
	}

	$scope.loadPromotion = async function () {
		await $http.get("http://localhost:8000/api/promotions")
			.then(resp => {
				if (resp.status == 200) {
					resp.data.forEach(promotion => {
						if (promotion.type === false) {
							$scope.promotions.push(promotion);
						}
					});
				}
			});
	}

	$scope.filterRoomsByRoomType = function (roomTypeId) {
		const filteredRooms = $scope.rooms.filter(room => room.roomType.id === roomTypeId);
		return filteredRooms;
	}



	$scope.loadPromotionRoom = function () {
		$http.get("http://localhost:8000/api/promotion-rooms")
			.then(resp => {
				if (resp.status == 200) {
					$scope.proRooms = resp.data;
				}
			});
			$scope.loading = false;
	}

	$scope.proRoomOf = function (room, pro) {
		return $scope.proRooms.find(proRooms => proRooms.room.id == room.id && proRooms.promotion.id == pro.id);
	}

	let count = 0;

	$scope.proRoomChanged = (room, pro) => {
		const proRoom = $scope.proRoomOf(room, pro);
		if (proRoom) {
			$scope.revokeProRoom(proRoom);
		} else {
			const activePromotion = $scope.proRooms.find(promo => promo.room.id == room.id && promo.promotion.status == true);
			if (activePromotion) {
				alert("Phòng này đang được áp dụng khuyến mại bởi mã khác!");
				return;
			}
			$scope.grantProRoom({
				room: room,
				promotion: pro
			});
		}
		count++;

		if ($scope.timeout) {
			clearTimeout($scope.timeout);
		}

		$scope.timeout = setTimeout(() => {
			if (count > 1) {
				alert("Áp dụng nhiều phòng thành công!");
			} else {
				alert("Áp dụng thành công!");
			}
			count = 0;
		}, 1500);
	};





	$scope.grantProRoom = function (proRoom) {

		$http.post("http://localhost:8000/api/promotion-rooms", proRoom).then(resp => {
			$scope.proRooms.push(resp.data);
		}, error => {
			alert("Áp dụng thất bại!");
		});
	}


	$scope.revokeProRoom = function (proRoom) {
		$http.delete("http://localhost:8000/api/promotion-rooms/" + proRoom.id).then(resp => {
			const index = $scope.proRooms.findIndex(item => item.id == proRoom.id);
			$scope.proRooms.splice(index, 1);
		}, error => {
			alert("Áp dụng thất bại!");
		});
	}


	$scope.init();
});


