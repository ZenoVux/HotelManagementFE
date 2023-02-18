app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/views/dashboard.html",
    })
    .when("/account", {
      templateUrl: "/views/account/table.html",
      controller: "accountListCtrl",
    })
    .when("/account/create", {
      templateUrl: "/views/account/form.html",
      controller: "accountFormCtrl",
    })
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});
