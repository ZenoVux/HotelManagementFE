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
        }else  {
		var item = angular.copy($scope.form);
		$http.post("http://localhost:8000/api/promotions", item).then(resp => {
			$scope.initialize();
			alert("Adding success !");
			$scope.clear();
		}).catch(error => {
			alert("Adding failed !")
			console.log("Error", error)
		})

	}}

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
        } else  {
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
	}}

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

