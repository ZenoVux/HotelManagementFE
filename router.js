app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/views/dashboard.html",
    })
    .when("/account", {
      templateUrl: "/views/account/table.html",
      controller: "accountFormCtrl",
    })
    .when("/account/create", {
      templateUrl: "/views/account/form.html",
      controller: "accountListCtrl",
    })
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});
