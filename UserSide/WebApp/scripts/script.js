var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider

    .when('/', {
      controller: 'MainController',
      templateUrl: 'home.html'
    })

    .when('/search', {
      controller:  'searchController',
      templateUrl: 'search.html'
    })

    .when('/review', {
      controller:  'reviewController',
      templateUrl: 'review.html'
    })
    .when('/succesfullSubmit',{
      controller: 'succesfullSubmitController',
      templateUrl: 'succesfullSubmit.html'
    });
});


app.controller('MainController', function($scope, $location){
  $scope.gotToSearch = function(){
    $location.path('/search');
  };
});
app.controller('searchController', function($scope,$location){
  $scope.gotToReview = function(){
    $location.path('/review');
  };
});
app.controller('reviewController', function($scope, $location){
  $scope.gotToSumbit = function(){
    $location.path('/succesfullSubmit');
  };
});
app.controller('succesfullSubmitController', function($scope, $location){
  $scope.search = function(){
    $location.path('/');
  };
});
