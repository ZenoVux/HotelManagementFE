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
    .when("/customers", {
      templateUrl: "/views/customers/table.html",
      controller: "customerCtrl",
    })
    .when("/customers/edit/:customerId", {
      templateUrl: "/views/customers/form.html",
      controller: "customerEditCtrl",
    })
    .when("/customers/types", {
      templateUrl: "/views/customers/type.html",
      controller: "customerTypeCtrl",
    })
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});
