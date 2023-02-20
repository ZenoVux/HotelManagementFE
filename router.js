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
      templateUrl: "/views/account/create.html",
      controller: "accountCreateCtrl",
    })
    .when("/account/update/:id", {
      templateUrl: "/views/account/update.html",
      controller: "accountUpdateCtrl",
    })
    .when("/hotel-room", {
      templateUrl: "/views/hotel-room/list.html",
      // controller: "accountUpdateCtrl",
    })
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      templateUrl: "/views/404.html",
    });
});
