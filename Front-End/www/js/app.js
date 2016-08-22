//Author @ccj242 - Christopher Cinq-Mars Jarvis//

angular.module('flare', ['ionic', 'flare.controllers', 'flare.services','ngStorage', 'ngCordova','ngLetterAvatar','PhoneFlareFilters','templates','ngCordovaBluetoothLE'])

.config(function($compileProvider,$ionicConfigProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//); //iOS fix  
    $ionicConfigProvider.views.transition('none'); //removes all transitions

//if (ionic.Platform.isAndroid()) {
$ionicConfigProvider.scrolling.jsScrolling(false); //supposed to help android performance?
//}
        })

    .run(function($ionicPlatform, $location, User, $localStorage, Data, LoopBackAuth,$ionicLoading) {


	LoopBackAuth.setUser(LoopBackAuth.accessTokenId, LoopBackAuth.currentUserId);
	LoopBackAuth.save();
	Data.set("id", LoopBackAuth.currentUserId);

	
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
      //StatusBar.backgroundColorByName("red"); test during emergencies changing the status bar
    }

  });

  if($localStorage.nologin){
    $localStorage.nologin=false;
    $location.path("/login");
  }else{

User.getCurrent(function($debug){
  // Still logged in
},function(err){

//revoked access token || not logged in // AUTO login
if(err.status=401){

if($localStorage.password && $localStorage.email && User.isAuthenticated){

  credentials = {"email":$localStorage.email,"password":$localStorage.password}
     
$ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

 User.login(credentials, function($access_token){
    Data.set("id", $access_token.userId);
    $ionicLoading.hide();
      }, function($error){
        $ionicLoading.hide();
       $location.path("/login");
      });

}

$location.path("/login");
 


  }else if(err.status=0){    // not Connected to the internet

       if($localStorage.email || User.isAuthenticated){
            // go to app without internet, load local storage options, alarms and contacts? // Not now, god forbid it confuses someone. 
          }else{
            $location.path("/login");
          };
  };
});


}

})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

$ionicConfigProvider.tabs.position('bottom');

$stateProvider

  // setup an abstract state for the tabs directive
	.state('tab', {
	    url: "/tab",
	    abstract: true,
	    templateUrl: "templates/tabs.html",
	    controller: 'TabCtrl',
	    cache: false // Helps with ng-class
	})
    
	.state('login', {
	    url: '/login',
	    templateUrl: 'templates/login.html',
	    controller: 'LoginCtrl'
	})


    .state('campus', {
            url: '/campus',
            templateUrl: 'templates/campus.html',
            controller: 'CampusCtrl'  
  })

    
	.state('info', {
            cache:false, // helps with video
            url: '/info',
            templateUrl: 'templates/info.html',
            controller: 'InfoCtrl'  
	})

	.state('disarm', {
            url: '/disarm',
            templateUrl: 'templates/disarm.html',
            controller: 'DisarmCtrl'  
	})
    
    
	.state('options', {
	    url: '/options',
            templateUrl: 'templates/options.html',
            controller: 'OptionsCtrl' 
	    
	})

    .state('projects', {
      url: '/projects',
            templateUrl: 'templates/projects.html',
            controller: 'ProjectsCtrl' 
      
  })
    
      
	.state('tab.tether', {
	    url: '/tether',
	    views: {
		'tab-tether': {
		    templateUrl: 'templates/tab-tether.html',
		    controller: 'TetherCtrl'
		    
		}
	    }
  })
    
	.state('tab.checkin', {
	    url: '/checkin',
	    views: {
		'tab-checkin': {
		    templateUrl: 'templates/tab-checkin.html',
		    controller: 'CheckinCtrl'
        }
	    }
	})
    
	.state('tab.contacts', {
	    url: '/contacts',
	    views: {
		'tab-contacts': {
		    templateUrl: 'templates/tab-contacts.html',
		    controller: 'ContactsCtrl'
		}
    }
	});
    
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/contacts');

});

angular.module('templates',[]); // For crosswalk and android performance

angular.module('PhoneFlareFilters', []) // Directives

//------------------- Courtesy of @joshbuchea on GitHub

.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
})

//--------------------------------------------------------------

.filter('expfirst', function () {
   return function (name) {
if (!name) { return ''}
//if (!(name.match(/\s/i)){return ''}
return name.replace(/\s.+/i,'')+' '
 
   }
})

.filter('explast', function () {
     return function (name) {
if (!name) { return ''}

return name.replace(/^.+\s/i,'')

   }
   
})

//------------------- Courtesy of @BobNisco on GitHub

.directive('onLongPress', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elm, $attrs) {
      $elm.bind('touchstart', function(evt) {

        // Locally scoped variable that will keep track of the long press
        $scope.longPress = true;
        // We'll set a timeout for 600 ms for a long press
        $timeout(function() {

          if ($scope.longPress) {
            // hide modal or whatever that keeps you touching. 
            // If the touchend event hasn't fired,
            // apply the function given in on the element's on-long-press attribute
            $scope.$apply(function() {
              $scope.$eval($attrs.onLongPress)
            });
          }
        }, 1300);
      });

      $elm.bind('touchend', function(evt) {

        // Prevent the onLongPress event from firing
        $scope.longPress = false;
        // If there is an on-touch-end function attached to this element, apply it
        if ($attrs.onTouchEnd) {
          $scope.$apply(function() {
            $scope.$eval($attrs.onTouchEnd)
          });
        }
      });
    }
  };
})

//------------------- Courtesy of @ashconnell on GitHub

.directive('input', function($timeout){
     return {
         restrict: 'E',
         scope: {
             'onReturn': '&'
        },
        link: function(scope, element, attr){
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.onReturn){
                        $timeout(function(){
                            scope.onReturn();
                        });                        
                    }
                } 
            });   
        }
    }
});




