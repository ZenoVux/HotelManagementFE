app.controller("service-typeCtrl", function ($scope,$http) {
  $scope.showbut = true;
  $scope.form={}
  $scope.serTypes = [];
  $scope.initialize = function(){
		$http.get("http://localhost:8000/api/service-types").then(resp=>{
			$scope.serTypes = resp.data;
		})
		
	}
	$scope.initialize();

  $scope.create = function(){ //create a new service 
		var item = angular.copy($scope.form);
		$http.post("http://localhost:8000/api/service-types",item).then(resp=>{
			$scope.initialize();
			alert("Adding success !")
			$scope.close();
      $scope.initialize();
		}).catch(error=>{
			alert("Adding failed !")
			console.log("Error",error)
		})
		
	}

	$scope.update = function(){
		var item = angular.copy($scope.form);
		$http.put("http://localhost:8000/api/service-types",item).then(resp=>{
			var index = $scope.serTypes.findIndex(p=>p.id==item.id)
			$scope.serTypes[index] = item;
			alert("Update success!")
			$scope.close();
		}).catch(error=>{
			alert("Update failed!")
			console.log("Error",error)
		})
	}

	$scope.view = function (s) {//update
			const myModal = new bootstrap.Modal('#exampleModal');
            myModal.show();
			$scope.showbut = false;
			$scope.form=angular.copy(s);
    }
	$scope.close = function () {
		var myModalEl = document.getElementById('exampleModal');
		var modal = bootstrap.Modal.getInstance(myModalEl);
		modal.hide();
		$scope.showbut = true;
		$scope.form={}
}
});

