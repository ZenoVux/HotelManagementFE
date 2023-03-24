app.factory('authService' ,function(){
    var authService = {}
    authService.hasRole = function(roleName){
        var token = localStorage.getItem('token');
        if(!token){
            //nguoi dung chua dang nhap
            return false;
        }
        	var tokenPayload = JSON.parse(atob(token.split('.')[1]));
			var role = tokenPayload.roles;
			// var username = tokenPayload.sub; 
            return role.indexOf(roleName) !== -1; // kiem tra role co trung khop voi role cua token hay khong
    };
    authService.getToken = function () {
        // Lấy token từ local storage hoặc cookie
        return localStorage.getItem('token');
      };
      authService.clearToken = function () {
        localStorage.setItem('token','');
      };
    return authService;
});