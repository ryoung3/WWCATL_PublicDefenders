/* stripe keys
1 - sk_test_YDRmKlCdVAFP4dj3KiV8nJXE
2 - pk_test_R7IWp6geD8n6y0y4yqavGC5L
*/

var app = angular.module('app', ['ngRoute','ngCookies']);

var API = 'http://localhost:8000';
var order = {
  quantity: null,
  grind: null,
  total: null
};
var address = {
  name: null,
  address: null,
  address2: null,
  city:null,
  state: null,
  zipCode: null,
  deliveryDate: null
};
var credentials = {
  username: null,
  pswd: null
};

app.config(function($routeProvider){
    $routeProvider

    .when('/', {
      controller: 'MainController',
      templateUrl: 'home.html'
    })

    .when('/options', {
      controller:  'OptionsController',
      templateUrl: 'options.html'
    })

    .when('/delivery', {
      controller:  'deliveryController',
      templateUrl: 'delivery.html'
    })

    .when('/payment', {
      controller:  'paymentController',
      templateUrl: 'payment.html'
    })
    .when('/thankyou', {
      controller: 'thankyouController',
      templateUrl: 'thankyou.html'
    })
    .when('/login',{
      controller: 'loginController',
      templateUrl: 'login.html'
    })
    .when('/register',{
      controller: 'registerController',
      templateUrl: 'register.html'
    })
    .when('/succesfullLogin',{
      controller: 'succesfullLoginController',
      templateUrl: 'succesfullLogin.html'
    });
});

/* Login Restrictions and Auto-Redirect */
app.run(function($rootScope, $location, $cookies){
  $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl){
    // holds page name for the url the user is trying to navigate to, ex /options
    // retruns an array want the item in the positon 1
    var pageName = nextUrl.split("#");
    var url = pageName[1];
    var restrictedPages = ['/options', '/delivery', '/payment'];

    if(url === restrictedPages[0] || url === restrictedPages[1] || url === restrictedPages[2]){
      if(!$cookies.get('token')){
        // sendMeHere is the name of the cookie that stores the page where the user was trying to get to but needed to login to be granted access
        $cookies.put('sendMeHere',url);
        $location.path('/login');
      }
    }
  });
});


app.controller('MainController', function($scope){

});

app.controller('OptionsController', function($scope, $http, $location){
  $http.get(API+'/options')
    .success(function(options){
      $scope.options = options.grind;

      //console.log(options);
    });

    $scope.goToDelivery = function(grind, qty, total){
      // saves the vaule the user selected to the order ojbect
      order.grind = grind;
      order.quantity = qty;
      order.total = total;

      $location.path('/delivery');
    };
});

// on the delivery page when the user clicks the submit btn save the order and address information to the database
app.controller('deliveryController', function($scope, $http, $location){
   $scope.name = address.name ;
   $scope.address = address.address ;
   $scope.address2 = address.address2 ;
   $scope.city = address.city ;
   $scope.state = address.state ;
   $scope.zipCode = address.zipCode ;
  //  $scope.deliveryDate = address.deliveryDate ;

  $scope.goToPayment = function(){
    address.name = $scope.name;
    address.address = $scope.address;
    address.address2 = $scope.address2;
    address.city = $scope.city;
    address.state = $scope.state;
    address.zipCode = $scope.zipCode;
    address.deliveryDate = $scope.deliveryDate.toDateString();

    $location.path('/payment');
  };
});

app.controller('paymentController', function($scope, $http, $location){
// getting the infomraiton from the global var and displaying it on the page
   $scope.name = address.name;
   $scope.address = address.address;
   $scope.address2 = address.address2;
   $scope.city = address.city;
   $scope.state = address.state;
   $scope.zipCode = address.zipCode;
   $scope.deliveryDate = address.deliveryDate;
   $scope.grind = order.grind;
   $scope.quantity = order.quantity;
   $scope.total = order.total;

   $scope.showPayment = function(){
     var handler = StripeCheckout.configure({
       // testing public key
       key: 'pk_test_R7IWp6geD8n6y0y4yqavGC5L',
       locale: 'auto',

       // once the credit card is validated this function will be called
      token:function(token){
        // make a request to the backend to actually make the charge
        // this is the token representing the validated credit card
        var stripeToken = token.id;
        $http.post(API+'/charge',{total:order.total*100, token:stripeToken})
          .success(function(data){
            $location.path('/thankyou');
            console.log(data);
          })
          .catch(function(err){
            console.log(err.failure_message);
          });
      }
    });
    // open the handler - this will open a dialog
    // with a form with it to prompt for credit card
    // information from the user
    handler.open({
      name: "Credit Card Info",
      description: 'DC Coffee',
      amount: order.total*100
    });
  }; // end showPayment
});

app.controller('thankyouController', function($scope, $http){

});

app.controller('loginController', function($scope, $http, $location, $cookies){
  $scope.login = function(){
    var credentials = {
      username: "",
      password:""
    };

    credentials.username = $scope.username;
    credentials.password = $scope.password;

    $http.post(API+"/login", credentials)
      .success(function(data){
        console.log(data);
        $cookies.put("token",data.token);
        if($cookies.get("sendMeHere")){
          $location.path($cookies.get("sendMeHere"));
        }else{
          $location.path('/');
        }

    })
    .catch(function(err){
      $scope.errorMessage = err.data.message;
      console.log(err.data.message);
    });
  };
});

app.controller('registerController', function($scope, $http, $location){

  $scope.register = function(){
    // want to pass the username to the db
    // want encrypt the pswd - pass it to the db

// setting global var from user input
    credentials.username = $scope.username;
    credentials.password = $scope.password;

    $http.post(API + '/signup',credentials)
      .success(function(){
        //account created message and prompt them to go the the login back
        // $location.path('/succesfullLogin');
        $location.path('/succesfullLogin');
      })
      .catch(function(err){
        console.log(err.message);
      });

  };
});

app.controller('succesfullLoginController', function($scope, $http, $location){
  $scope.goToLoginPage = function(){
    $location.path('/login');
  };
});
