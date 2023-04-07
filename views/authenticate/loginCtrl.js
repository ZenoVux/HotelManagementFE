app.controller("loginCtrl", function ($scope, $http,$routeParams,$location,authService,$timeout) {
	$scope.form = {};
	$scope.loading=false;
	$scope.myEmail = {}
	$scope.Pass = {token:$routeParams.token}
	$scope.initialize = function () {
	}
	$scope.initialize();


	$scope.authenticate = function () { 
		$scope.loading = true;
		$timeout(function() {
		  var item = angular.copy($scope.form);
		  $http.post("http://localhost:8000/auth/login", item).then(resp => {
			localStorage.setItem('token', resp.data.token);
			$scope.loading=false;
			if(authService.hasRole('ADMIN')){
			  $location.path('/');
			}else{
			  $location.path('/bookings');
			}
		  }).catch(error => {
			alert("Login failed !")
			console.log("Error", error)
		  });
		}, 1500); 
	  }
	  
	$scope.close = function () {
		var myModalEl = document.getElementById('exampleModal');
		var modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();
	}

	$scope.send = function () { 
		var item = angular.copy($scope.myEmail); 
		$http.post("http://localhost:8000/reset-password", item).then(resp => {
			alert("We have sent please check your email!")
			$scope.close()
		}).catch(error => {
			alert("Your email doesn't match!")
			console.log("Error", error)
		})

	}

	$scope.resetPass = function () { 
		if($scope.Pass.newPassword!=$scope.repassword){
			alert("Password and confirm password doesn't match!")
			return
		}
		var item = angular.copy($scope.Pass); 
		$http.post("http://localhost:8000/reset-password/done", item).then(resp => {
			alert("Oke!")
			$location.path("/")
		}).catch(error => {
			alert("Error changes password!")
			console.log("Error", error)
		})

	}
	
});

