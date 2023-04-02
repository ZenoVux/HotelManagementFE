app.directive('snackbar', function($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="snackbar" class="alert alert-success" role="alert">{{message}}!</div>',
      link: function(scope, element, attrs) {
        $rootScope.$on('showSnackbar', function(event, message) {
          scope.message = message;
          element.addClass('show');
          $timeout(function() {
            element.removeClass('show');
          }, 3000);
        });
      }
    };
  });

  app.directive('errorbar', function($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="snackbar" class="alert alert-danger" role="alert">{{message}}!</div>',
      link: function(scope, element, attrs) {
        $rootScope.$on('showErrorbar', function(event, message) {
          scope.message = message;
          element.addClass('show');
          $timeout(function() {
            element.removeClass('show');
          }, 3000);
        });
      }
    };
  });

 
  