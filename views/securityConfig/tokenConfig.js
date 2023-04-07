app.factory('tokenConfig', function ($q, $location, $injector){
    return {
        'request': function (config) {
          var AuthService = $injector.get('authService');
          var token = AuthService.getToken(); 
          if (config.url.indexOf('http://localhost:8000/auth/login') === -1 && config.url.indexOf('http://localhost:8000/reset-password') === -1) {
            config.headers.Authorization = 'Bearer ' + token; 
          }
          return config || $q.when(config);
        }
        // ,
        // 'responseError': function(response) {
        //   if (response.status === 401) { // nếu bị lỗi 401
        //     var AuthService = $injector.get('authService');
        //     AuthService.clearToken(); // xoá token cũ
        //     $location.path('/login'); // chuyển hướng đến trang đăng nhập
        //   }
        //   return $q.reject(response);
        // }
      };

})
