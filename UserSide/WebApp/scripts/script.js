
var app = angular.module('app', ['ngRoute']);

// var API = 'http://localhost:8000';
// var order = {
//   quantity: null,
//   grind: null,
//   total: null
// };
// var address = {
//   name: null,
//   address: null,
//   address2: null,
//   city:null,
//   state: null,
//   zipCode: null,
//   deliveryDate: null
// };
// var credentials = {
//   username: null,
//   pswd: null
// };

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

    .when('/submit', {
      controller:  'submitController',
      templateUrl: 'submit.html'
    })
    .when('/succesfullSubmit',{
      controller: 'succesfullSubmitController',
      templateUrl: 'succesfullSubmit.html'
    });
});


app.controller('MainController', function($scope, $location){
  $scope.search = function(){
    $location.path('/search');
  };
});
app.controller('searchController', function($scope,$location){
  $scope.search = function(){
    $location.path('/submit');
  };
});
app.controller('submitController', function($scope, $location){
  $scope.search = function(){
    $location.path('/succesfullSubmit');
  };
});
app.controller('succesfullSubmitController', function($scope, $location){
  $scope.search = function(){
    $location.path('/');
  };
});
