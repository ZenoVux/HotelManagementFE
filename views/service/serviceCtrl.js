app.controller("serviceCtrl", function ($scope, $http) {
	$scope.showbut = true;
	$scope.form = {
		status:false,
		serviceType: { id: 1 }
	};
	$scope.items = [];
	$scope.serTypes = [];
	$scope.initialize = function () {

		$http.get("http://localhost:8000/api/service-rooms").then(resp => {
			$scope.items = resp.data;
		})

		$http.get("http://localhost:8000/api/service-types").then(resp => {
			$scope.serTypes = resp.data;
		})

	}
	$scope.initialize();

	$scope.create = function () { //create a new service 
		var item = angular.copy($scope.form);
		$http.post("http://localhost:8000/api/service-rooms", item).then(resp => {
			alert("Adding success !")
			$scope.initialize();
		}).catch(error => {
			alert("Adding failed !")
			console.log("Error", error)
		})

	}

	$scope.update = function () {
		var item = angular.copy($scope.form);
		$http.put("http://localhost:8000/api/service-rooms", item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id)
			$scope.items[index] = item;
			alert("Update success!")
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
		$scope.showbut = true;
		$scope.form = {}
	}
});

