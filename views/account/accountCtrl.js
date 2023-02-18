app.controller("accountFormCtrl", function ($scope) {
  $scope.submit = function () {
    alert("submit")
  };
});
app.controller("accountListCtrl", function ($scope) {
    $scope.view = function () {
        (function ($) {
            $('.fade bs-example-modal-center').modal('show');
        })
    }
});
