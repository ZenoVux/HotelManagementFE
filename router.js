app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/views/dashboard.html",
    })
    .when("/bookings", {
      templateUrl: "/views/booking/booking.html",
      controller: "bookingCtrl",
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
    .when("/login", {
      templateUrl: "/views/login.html",
    })
    .otherwise({
      templateUrl: "/views/404.html",
    });
});
