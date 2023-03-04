app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/views/dashboard.html",
    })
    .when("/accounts", {
      templateUrl: "/views/account/table.html",
      controller: "accountListCtrl",
    })
    .when("/accounts/create", {
      templateUrl: "/views/account/create.html",
      controller: "accountCreateCtrl",
    })
    .when("/accounts/update/:id", {
      templateUrl: "/views/account/update.html",
      controller: "accountUpdateCtrl",
    })
    .when("/accounts/role", {
      templateUrl: "/views/account/role.html",
      controller: "accountRoleCtrl",
    })
    .when("/hotel-room", {
      templateUrl: "/views/hotel-room/list.html",
      // controller: "accountUpdateCtrl",
    })
    .when("/service", {
      templateUrl: "/views/service/serviceView.html",
      controller: "serviceCtrl",
    })
    .when("/service/type", {
      templateUrl: "/views/service-type/service-typeView.html",
      controller: "service-typeCtrl",
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
    .when("/payment", {
      templateUrl: "/views/payment/table.html",
      controller: "paymentListCtrl",
    })
    .when("/payment/create", {
      templateUrl: "/views/payment/create.html",
      controller: "paymentCreateCtrl",
    })
    .when("/payment/update/:id", {
      templateUrl: "/views/payment/update.html",
      controller: "paymentUpdateCtrl",
    })
    //
    .when("/supply", {
      templateUrl: "/views/supply/table.html",
      controller: "supplyCtrl",
    })
    .when("/supply/create", {
      templateUrl: "/views/supply/createSupply.html",
      controller: "supplyCreateCtrl",
    })
    .when("/supply/update/:id", {
      templateUrl: "/views/supply/updateSupply.html",
      controller: "supplyUpdateCtrl",
    })
    //
    .when("/supply/type", {
      templateUrl: "/views/supply/tableType.html",
      controller: "supply-typeCtrl",
    })
    .when("/supply/createType", {
      templateUrl: "/views/supply/createType.html",
      controller: "supplyCreate-typeCtrl",
    })
    .when("/supply/updateType/:id", {
      templateUrl: "/views/supply/updateType.html",
      controller: "supplyUpdate-typeCtrl",
    })
    //
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      templateUrl: "/views/404.html",
    });
});
