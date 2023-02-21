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
    .when("/service", {
      templateUrl: "/views/service/serviceView.html",
      controller: "serviceCtrl",
    })
    .when("/service/type", {
      templateUrl: "/views/service-type/service-typeView.html",
      controller: "service-typeCtrl",
    })
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});
