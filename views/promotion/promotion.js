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
		var item = angular.copy($scope.form);
		$http.post("http://localhost:8000/api/promotions", item).then(resp => {
			$scope.initialize();
			alert("Adding success !");
			$scope.close();
		}).catch(error => {
			alert("Adding failed !")
			console.log("Error", error)
		})

	}

	$scope.update = function () {
		var item = angular.copy($scope.form);
		$http.put("http://localhost:8000/api/promotions", item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id)
			$scope.items[index] = item;
			alert("Update success!");	
			$scope.close();
		}).catch(error => {
			alert("Update failed!")
			console.log("Error", error)
		})
	}

	$scope.view = function (s) {//update
		const myModal = new bootstrap.Modal('#exampleModal');
		myModal.show();
		$scope.showbut = false;
		$scope.form = angular.copy(s);
	}
	$scope.close = function () {
		var myModalEl = document.getElementById('exampleModal');
		var modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();
		$scope.form = {}
		$scope.showbut = true;
	}
});

