//Author @ccj242 - Christopher Cinq-Mars Jarvis//

angular.module('flare.controllers', ["lbServices", "ngResource"])
    
.controller('LoginCtrl', function($scope, $state, User, Data, $localStorage, $cordovaLocalNotification, $ionicPopup,contacts, EmailDomainWhitelist, $window) {

if($localStorage.email){
    	$scope.reg=false;
    	$scope.credentials = {
	    email: $localStorage.email,
	    password: null,
	};

  }else{
  	$scope.reg=true;
	$scope.credentials = {
	    email: null,
	    password: null
	};
  };

// ------ For Quick Debugging ---------------------

/*
 $scope.reg = false;

    $scope.credentials = {
	"email": "",
	"password": ""
    };
*/

//$state.go("disarm");
// -----------------------------------------------

$scope.loginobj = {};
$scope.loginobj.currentstudent=true;
$scope.loginobj.edu=true;

$scope.faq=function(){
  $window.open('http://www.phoneflare.com/FAQ.html','_system');
}

$scope.accessorylogin=function(){
if (navigator.appVersion.indexOf("iPhone") > 0 ){
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
}
}

$scope.privacy=function(){
  $window.open('http://www.phoneflare.com/privacy.html','_system');
}

$scope.register = function(){
if(!$scope.credentials.email || !$scope.credentials.password){return;}

var emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var eduvalidation= /\.\edu$/;

// Blacklist --------------------

 for (p=0;p<Blacklist.length;p++){

if (($scope.credentials.email.toLowerCase()).includes(Blacklist[p])){
        alert('This domain has been blacklisted');
        return;
     };
};

//-------------------------------


if(!emailvalidation.test($scope.credentials.email)){
var alertPopup = $ionicPopup.alert({
     title: 'Invalid<b>Email</b>',
     subTitle: 'Please ensure you have inputted a valid email address',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
  return;
}

if ($scope.credentials.password.length<5){
  var alertPopup = $ionicPopup.alert({
     title: '<b>Short</b> Password',
     subTitle: 'Your password must be at least 5 characters in length',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
  return;
}

if(!eduvalidation.test($scope.credentials.email)){
$scope.loginobj.currentstudent=false;
$scope.loginobj.edu=false;
}

	 var alertPopup = $ionicPopup.alert({
     title: 'Terms & Conditions',
     subTitle: 'Please read carefully',
      scope: $scope,
     template: '<span style="color:black !important"><b>PhoneFlare</b> accesses your location to send to friends, family and campus safety (if supported). We are volunteer run and pay server costs out of pocket, doing our very best to maintain consistant service. We are in no way responsible for outages or errors. We truly hope this tool can be of help but <b>always have a back-up plan</b>. Anonymous error reporting is shared at our repo to improve stability. <span style="color:blue" ng-click="privacy()"><u><b>Privacy Policy</b></u></span></span><ion-toggle ng-if="loginobj.edu" ng-model="loginobj.currentstudent" style="border-top:2px;color:black;background-color: rgba(0, 0, 0, .0) !important;padding-bottom:5px"><b>Current Student?</b></ion-toggle>',
     buttons: [
   {
        text: '<b>decline</b>',
        onTap: function() {
          
    return;
        }
      },
      {
        text: '<b>AGREE</b>',
        type: 'button-positive',
        onTap: function() {

// -------------LOGIN--------

  if (!$scope.loginobj.currentstudent){
    $localStorage.global.campuscall=false;
    //$localStorage.global.edu=false;
  }


    //--------------- IF we need to restrict to only edu addresses and have non-edu addresses pay with a tweet ------------
/*
    if(!eduvalidation.test($scope.credentials.email)){

    $scope.credentials.email=$scope.credentials.email.toLowerCase();
    $scope.credentials.email=$scope.credentials.email.replace(/\s/g,'');

    var afteratregex = /@(.*)/;
    afterat=$scope.credentials.email.match(afteratregex);

pwaturl='http://www.phoneflare.com/nonEDU/nonedu.php?email='+$scope.credentials.email+'&pass='+$scope.credentials.password;


    EmailDomainWhitelist.find(
    	{filter:
    		{where: {or:
    		[
    			{domain:afterat[1]},
    			{domain:$scope.credentials.email}
    		]
    	}}})
    .$promise
    .then(function(success){
    //console.log(success)
    	if (success.length>0){
    		$scope.registeruser($scope.credentials);
    	}else{
    		$scope.pwatuser(pwaturl);
    }

    },function(error){
    $scope.pwatuser(pwaturl);
     
    })

    }else{
$scope.registeruser($scope.credentials);

    };
    */

    //-------------------------------------------------------------

    $scope.registeruser($scope.credentials); 

        }
      }
    ]
   });


	};

    //--------------- IF we need to restrict to only edu addresses and have non-edu addresses pay with a tweet ------------
/* 
$scope.pwatuser=function(url){

$window.open(url,'_blank');
//alert('pwatuser func')
};
*/
    //-------------------------------------------------------------


$scope.registeruser=function(credentials){
$scope.credentials=credentials;

	 $scope.showloader();

	$scope.credentials.email=$scope.credentials.email.toLowerCase();
	$scope.credentials.email=$scope.credentials.email.replace(/\s/g,'');

	    $scope.credentials.username = $scope.credentials.email;
	    User.create($scope.credentials, function($register_success){

    $scope.hideloader();

		$localStorage.email=$scope.credentials.email;
		$localStorage.name=$scope.credentials.name;
    $localStorage.global.campuscall=false;
    $localStorage.global.edu=false;


var alertPopup = $ionicPopup.alert({
     title: 'Verify<b>Email</b>',
     subTitle: 'One last step!',
     template: '<span style="color:black !important">Please check your email to verify your account. Then login and begin enjoying <b>PhoneFlare</b></span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
		$scope.reg = false;
        }
      }
    ]
   });


	    }, function($register_error){
        $scope.hideloader();
	    	if ($register_error.status==404) {$scope.errorreport($register_error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
	    	else if ($register_error.status==0 || $register_error.status==-1) {$scope.errorreport($register_error,new Error().stack,'Server Error','Please check your internet connection. It is possible we are performing maintenance to the server, thank you for your patience. Check our facebook or twitter for planned maintenance times',true);}
        else if ($register_error.status==422){



    var alertPopup = $ionicPopup.confirm({
     title: 'Account <b>Exists</b>',
     subTitle: 'Login with these credentials?',
     cancelText:'cancel',
    okText:'Login',
    scope: $scope
      })
      alertPopup.then(function(res) {
        if (res){$scope.login()}
      },function(){});
      
  }else {$scope.errorreport($register_error,new Error().stack,'Miscellaneous Registration Error','An error report has been generated',true);}
        
	    });
}


$scope.login = function(){

if(!$scope.credentials.email || !$scope.credentials.password){return;}

if($scope.credentials.email.indexOf("@")<1){return}

$scope.loginobj.edu=false;

var eduvalidation= /\.\edu$/
if(eduvalidation.test($scope.credentials.email)){
$scope.loginobj.edu=true;
};

  $scope.showloader();

	$scope.global=Data.global();

	$scope.credentials.email=$scope.credentials.email.toLowerCase();
  $scope.credentials.email=$scope.credentials.email.replace(/\s/g,'');
	    $scope.credentials.username = $scope.credentials.email;
	    User.login($scope.credentials, function($access_token){
        // $localStorage: access token? 
  	Data.set("id", $access_token.userId);

if ($localStorage.email){
    if ($localStorage.email!==$scope.credentials.email){

        if ($localStorage.UDIDlog){
          $scope.tempUDID=angular.copy($localStorage.UDIDlog);
}else{$scope.tempUDID=false}
      $scope.resetlocalstorage();
      if ($scope.tempUDID){
        $localStorage.UDIDlog=$scope.tempUDID;
      };

    }
}

if ($scope.loginobj.edu){$scope.global.edu=true}else{$scope.global.edu=false;$scope.global.campuscall=false};

		$localStorage.email=$scope.credentials.email;

		$localStorage.password=$scope.credentials.password;

if ($localStorage.global.firstlogin){
  // Popup for sharemeals?
$scope.global.name=$scope.credentials.email;
$scope.global.villages=false;

		}
global=$scope.global;
$localStorage.global=global;

    $scope.hideloader();
		//Data.deescalate_emergency(); // Deprecated
    //$rootScope.$emit("deesc", {});  // Deprecated

    contactsinit();
    $scope.campussafetyquery($scope.credentials.email);

    $state.go("tab.contacts");
	    }, function($error){
        $scope.hideloader();

		if ($error.status==404 || $error.status==-1) {$scope.errorreport($error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
		else if ($error.status==401) {
     
      $scope.errorreport($error,new Error().stack,'<b>Email</b> or <b>Password</b> Incorrect','Please check your login credentials and/or make sure you\'ve verified your email',false);}
	  else if ($error.status==0) {$scope.errorreport($error,new Error().stack,'Server Error','We might be performing maintenance to the server, or your internet connection may be unusable. Thank you for your patience and please check social media for planned outages',true);}
	  else {$scope.errorreport($error,new Error().stack,'Miscellaneous Error','An error report has been generated',true);}
	    });
	}

$scope.regToggle = function(){
	$scope.reg=!$scope.reg;
  /*
	$scope.credentials = {
	    email: null,
	    password: null
	};
  */
};

$scope.emailreturn=function(){
	document.getElementById("passinput").focus();
	return;
if (navigator.appVersion.indexOf("Android") > 0 ){
document.getElementById("passinput").focus();
}else{cordova.plugins.Keyboard.close()}
}

$scope.passwordreturn=function(){
cordova.plugins.Keyboard.close();
  if (!$scope.reg){$scope.login()}else{$scope.register()}
}

$scope.hideloader();

    })



.controller('StandardCtrl', function($scope, $ionicSideMenuDelegate, $http, $state, $ionicHistory, $ionicPopup, $ionicPlatform, $localStorage, User, alarms, Data, $window, $cordovaLocalNotification, $cordovaSocialSharing, $timeout, $ionicLoading, University,$cordovaBluetoothLE, $location, $rootScope, $cordovaFlashlight, $interval) {

$scope.initfunc=function(){

$scope.global=Data.global();

if (typeof $localStorage.UniversityInfo === "undefined"){
  $localStorage.UniversityInfo={};
}
if ($localStorage.UniversityInfo.schoolstatus){
  if ($localStorage.UniversityInfo.schoolstatus=='emergency'){
$scope.campusstatus='green'
  }else if ($localStorage.UniversityInfo.schoolstatus=='non-emergency'){
$scope.campusstatus='yellow'
}else{$scope.campusstatus='red'}
}else{
$scope.campusstatus='n/a';
};

if ($localStorage.UDIDlog){}else{
$localStorage.UDIDlog=[];
}
};

$scope.returnkeyclose=function($event){
if($event.keyCode==13){cordova.plugins.Keyboard.close()}

}

$scope.updatecampusstate=function(string){
$scope.campusstatus=string;
}

$scope.resetlocalstorage=function(){

$localStorage.$reset();

var global = {

torch:true,
audioalarm:true,
audiorec:false,
MCdisarm:false,
color:null,
campuscall:true,
edu:true
}
$localStorage.global=global;

}

$scope.campussafetyquery=function(email){
var edustrip=/@(.*?)\.\edu$/;

if (edustrip.exec(email)){
  edu_prefix=edustrip.exec(email)[1];
}else{
  $scope.campusstatus='n/a'
  return;
}

// Color that corresponds to the dispatch available at your university
University.find({filter:{where: {"edu prefix":edu_prefix}}})
.$promise
.then(function(success){

  if (success.length==0){
    $scope.updatecampusstate('NOT');
    $scope.errorreport(edu_prefix,'Add EDU address to Database','University not in Database','We have notified ourselves to add your university to our database. All other features will coninue to function normally',true);
    return;
  }

if (success[0].Status=='non-emergency'){$scope.updatecampusstate('yellow')}
else if (success[0].Status=='emergency'){$scope.updatecampusstate('green')}
else {$scope.updatecampusstate('red')};

UniversityInfo={
schoolname:success[0].Name,
schoolstatus:success[0].Status,
schoolnumber:success[0].Phone,
centergeo:{lat: success[0].Latitude, lng:success[0].Longitude},
boundsgeo:{

  north:success[0].North,
  south:success[0].South,
  east:success[0].East,
  west:success[0].West,

}
}

$localStorage.UniversityInfo=UniversityInfo;

}, function($error){

if ($error.status==404 || $error.status==-1) {$scope.errorreport($error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
    else if ($error.status==0) {$scope.errorreport($error,new Error().stack,'Server Error','We might be performing maintenance to the server, or your internet connection may be unusable. Thank you for your patience and please check social media for planned outages',true);}
    else {$scope.errorreport($error,new Error().stack,'Miscellaneous University Database Error','An error report has been generated',true);}
})

};


nocontacts=function(bool){
  $scope.nocontacts=bool;
}

multiinfo=false;
lastinfo=false;
emerinfo=false;

$scope.lastinfo=function(){
lastinfo=true;
$state.go('info');
}

$scope.villages=function(emer,lat,long){
  if (typeof $localStorage.global.villagesName === "undefined"|| $localStorage.global.villagesName==''){
      $localStorage.global.firstlogin=true;
   return; 
  };

// Code to call twilio for the villages, redacted for protection

}

  $scope.showloader = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };

  $scope.hideloader = function(){
        $ionicLoading.hide();
  };

  $scope.emeremail = function(sit){

    // Function to email user for reminders, redacted for protection
  }

  $scope.udidemail = function(){

    var alertPopup = $ionicPopup.confirm({
     title: 'Email <b>UDIDs</b>?</b>',
     template: '<span style="color:black !important">Tap send to email yourself a the full log of UDIDs captured by PhoneFlare</span>',
     cancelText:'cancel',
    okText:'Send',
    scope: $scope
      })
      alertPopup.then(function(res) {
        if (res){

 if ($localStorage.UDIDlog.length==0){
  alert("No UDID logs found");
return;
}
// Email UDIDs to user, redacted for protection
        }
      },function(){});

  }


if (navigator.appVersion.indexOf("iPhone") > 0 ){
  $scope.iOS=true;
}

$scope.facebook=function(){
  $window.open('https://www.facebook.com/phoneflare','_system');
}

$scope.twitter=function(){
  $window.open('https://twitter.com/phoneflare','_system');
}

$scope.stumbleupon=function(){
  $window.open('https://plus.google.com/116227023571985953355/about','_system');
}

$scope.volunteer=function(){
  $window.open('http://www.phoneflare.com/contribute.html','_system');
  $scope.socialsharing();
}

$scope.github=function(){
  $window.open('https://github.com/ccj242/PhoneFlare-Free-Campus-Safety-App','_system');
}

$scope.watchvideo=function(){
  $window.open('https://www.youtube.com/embed/R1QeJGYVC5s?VQ=HD1080&autoplay=1','_system');
}

$scope.errorreport=function(log,stack,title,body,send){

  versionnum=$localStorage.build;
  errornum='';

  if (typeof log === 'undefined'){log={}}

  if (log.status){errornum=log.status}

  var alertPopup = $ionicPopup.alert({
     title: title+' '+errornum, 
     template: '<span style="color:black !important">'+body+'</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {

        }
      }
    ]
   });

  log=JSON.stringify(log);


  if (send){

    // Email error reports to user, redacted for protection, - if you would like to recieve error reports, please contact me on github @ccj242

  }

console.log('stack trace: '+stack)
console.log('message: '+JSON.stringify(log));

}


$scope.bluetoothprompt=function(){

if (navigator.appVersion.indexOf("Android") > 0 ){
//auto turn on bluetooth
 $cordovaBluetoothLE.enable(function(){},function(){return});
 bluetoothdisabled=false;
}

}


$scope.campussafety=function(){

  if($scope.campusstatus=='NOT'){

    $scope.errorreport(edu_prefix,'Add EDU address to Database','University not in Database','We have notified ourselves to add your university to our database. All other features will coninue to function normally',true);

    return;
  }

	if ($localStorage.email){
$scope.campussafetyquery($localStorage.email);
}

$state.go('campus');

}

$scope.socialsharing=function(){

  var alertPopup = $ionicPopup.confirm({
     title: '<b>Share</b> PhoneFlare?',
     subTitle: 'One moment of your time makes an <b>enormous</b> difference',
     template: '<span style="color:black !important">Please consider rating or sharing <b>PhoneFlare</b> on social media - it is a <b>huge</b> help to our cause. Thank you!</span>',

     buttons: [
     { text: 'No Thanks',
       onTap: function() {  
          }
      },
      {
        text: '<b>Share</b>',
        type: 'button-positive',
        onTap: function(res) {

$cordovaSocialSharing
    .share("a free, open-source and non-profit app that keeps you and your campus safer", "PhoneFlare: A Free Safety App", "http://www.phoneflare.com/logo.png", "http://www.phoneflare.com") // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });

        }
        }
      
    ]
   });
}

 //Flare.initialize(function(){}, function(){});

$scope.alarmpref=function(){
if (!$localStorage.global.audioalarm){
Flare.disarm_alarm(function(){},function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Disarm','An error report has been created on this issue',true);})
}else{Flare.arm_alarm(function(){},function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Arm','An error report has been created on this issue',true);})	
}

//Flare.is_alarm_armed(function(rez){alert(rez)},function(){alert('could not determine')})

}



$scope.lspurge=function(){

var alertPopup = $ionicPopup.confirm({
     title: 'Purge <b>Data</b>',
     subTitle: 'Are you sure you want to purge your local storage and logout?',
     buttons: [
     { text: 'Cancel' },
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
           $scope.resetlocalstorage();
           $scope.logout();
        }
      }
    ]
   });

 }

iscontactsglobal = function(bool) {
	$scope.emershowcont=bool;

}

$scope.feedback = function() {

  $scope.temppopup={};

  var alertPopup = $ionicPopup.confirm({
     title: 'Bug <b>Report</b> or <b>Comment</b>',
     cssClass: "higher_popup",
     subTitle: 'Please describe your issue or provide feedback below. <b>Thank you</b>!',
     template: '<textarea rows="7" autofocus ng-keydown="returnkeyclose($event)" type="text" ng-model="temppopup.bugreport" style="background:transparent;font-size:20px;margin-bottom:12px;padding-left:7px;color:#545454"></textarea>',
     cancelText:'cancel',
    okText:'Send',
    scope: $scope
      })
      alertPopup.then(function(res) {
        if (res){
          if ($scope.temppopup.bugreport.length){
    $scope.errorreport($scope.temppopup.bugreport,'User Bug Report','User Feedback','Your Report has been sent! Thank you for using PhoneFlare!',true);
          }
        }
      },function(){});
}


$scope.gpsfeedback = function() {

  $scope.temppopup={};

  var alertPopup = $ionicPopup.confirm({
     title: '<b>Edu</b> Database Error',
     subTitle: 'Please let us know what information is incorrect and we will update <b>asap</b>',
     template: '<textarea rows="7" autofocus ng-keydown="returnkeyclose($event)" type="text" ng-model="temppopup.bugreport" style="background:transparent;font-size:20px;margin-bottom:12px;padding-left:7px;color:#545454"></textarea>',
     cancelText:'cancel',
    okText:'Send',
    scope: $scope
      })
      alertPopup.then(function(res) {
        if (res){
          
    $scope.errorreport($scope.temppopup.bugreport,'University Table Report','User Bug Report','Your Report has been sent!',true);

        }
      },function(){});
}

deescalateLocally=function(){

if(typeof EmerLoop !=='undefined'){
$interval.cancel(EmerLoop);
}

$rootScope.$emit("deesc", {});

 var alertPopup = $ionicPopup.alert({
     title: 'Emergency <b>Stopped</b>',
     subTitle: 'Your emergency was resolved <b>remotely</b> or you\'ve attempted to trigger <b>another</b> emergency too <b>quickly</b>. Emergencies must be at <b>least</b> 30 seconds apart',
    // template: '<span style="color:black !important">Location Services <b>must</b> be enabled and set to <b>"always"</b> for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

}


var success = function(message){
	    alert("Success: " + message);
	}

	var error = function(log,stack,title,body,send){
 
    $scope.errorreport(log,stack,title,body,send);

	}

  // Error report method from services.js
globalerror=function(log,stack,title,body,send){
  $scope.errorreport(log,stack,title,body,send);
}

$scope.debug=function() {
  //iOS 10 needs notification work

var now = new Date().getTime(),
_ten_sec_from_now = new Date(now + 10 * 1000);

var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

  $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Headpone Alarm Triggered',
        text: 'You have 10 seconds before your contacts are notified! ',
        sound: sound,
        at: _ten_sec_from_now
      }).then(function () {});

}; 


	$scope.debugupdate=function(){
//alert(Data.get("id"))

		User.findById(Data.get("id"))
 				.$promise
            .then(function(record){
           console.log(record)
            },function($err){
            
            });
	};

$scope.stopSOStorch=function(){

if(typeof $scope.timeoutSOS === 'undefined'){return}

if ($scope.timeoutSOS){
$timeout.cancel($scope.timeoutSOS)
$cordovaFlashlight.switchOff();
};

}

/*
$scope.stoplocaltimers = function(){

if(typeof mytimeout === 'undefined'){return}

if (mytimeout){$timeout.cancel(mytimeout)};
//if (mytimeouttwo){$timeout.cancel(mytimeouttwo)};
}
*/
$scope.settimer = function(){  // Master function to remove past timers, and consistantly update for the next timer to fire

/*
if (navigator.appVersion.indexOf("Android") < 1 && navigator.appVersion.indexOf("iPhone") < 1){
    return;
}
*/

if(!TetherEmergency && !DirectEmergency && !CheckInEmergency && !emergencystate){

$scope.alarms = alarms.all();

Flare.stop_timer(function(){}, function(rez){if (rez!==-101){$scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Timer','An error report has been created on this issue',true);return;}});

//$scope.stoplocaltimers();

	if ($scope.alarms.length>0){
		var dateNOW = new Date(); // plus 5 min grace period

//------------Remove Past Timers--------------

		for (i=0;$scope.alarms.length>i;i++){
		var dateI = new Date($scope.alarms[i].end)

		if(dateI.getTime()<dateNOW.getTime()){
      difference=dateNOW.getTime()-dateI.getTime();

//------------------CHECK REPEAT -----------------------
	if($scope.alarms[i].repeat=="no"){
		    alarms.removeindex(i);
        return;
        $scope.settimer();
        
		    }else if($scope.alarms[i].repeat=="daily"){
			$scope.temptime = dateI.setHours(dateI.getHours()+24)
			alarms.removeindex(i);
			$scope.alarms.push(
			{end:$scope.temptime, repeat:"daily"});
			$localStorage.alarms=$scope.alarms;
      return;
        $scope.settimer();

		    }else if($scope.alarms[i].repeat=="weekly"){
			$scope.temptime = dateI.setHours(dateI.getHours()+168)
			alarms.removeindex(i);
			$scope.alarms.push(
			{end:$scope.temptime, repeat:"weekly"});
			$localStorage.alarms=$scope.alarms;
      return;
        $scope.settimer();

		    };

//------------------------------------------

if (difference<500000){$state.go('disarm')};

		}
				
		};

$scope.alarms = alarms.all();


if (typeof $scope.alarms[0] === 'undefined'){
 $scope.settimer(); 
return;
}

//------------------------------------------
		soonestEnd=$scope.alarms[0].end;

		for (i=1;$scope.alarms.length>i;i++){

			if (soonestEnd>$scope.alarms[i].end){
				
				soonestEnd=$scope.alarms[i].end;

			};
		};

var EndDate = new Date(soonestEnd);
//alert(EndDate)

if($localStorage.soonestEnd){
	if ($localStorage.soonestEnd==EndDate){return}
}

$localStorage.soonestEnd=EndDate;

var now = dateNOW.getTime();

$localStorage.activecheckin=true;

countdown=Math.floor((EndDate.getTime()-now)/1000)// in sec

var CheckInTime = new Date(now + countdown * 1000);

      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Time to Check-In!',
        text: 'You have 5 minutes before your contacts are notified',
        at: CheckInTime
      }).then(function () {});

var nother = new Date(now + ((countdown+240) * 1000));


      $cordovaLocalNotification.schedule({
        id: 2,
        title: 'Check-In!',
        text: 'You have 1 minute before your contacts are notified',
        at: nother
      }).then(function () {});

//realcountdown=countdown+300; // 5min grace +270
        
Flare.disarm_alarm(function(){},function(){});

Flare.start_timer(String(countdown), function(ret){
  if (ret==101){
    Flare.arm_alarm(function(){},function(){});

    CheckInEmergency=true;
    $localStorage.CheckIn=true;
    $scope.emeremail(2);
    //$scope.FiveMinGrace(realcountdown);
    lastview="tab.checkin";
    $state.go('disarm');

    Flare.start_timer(String('276'), function(ret){
      if (ret==101){
        Flare.start_vibrating("999", function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Vibrating','An error report has been created on this issue',true);});
        if ($localStorage.global.audioalarm){
            Flare.sound_alarm(function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Alarm','An error report has been created on this issue',true);});
        } 
      emergencystate=true;
      $localStorage.emergency=true;
      $state.go('disarm');

      //Flare.stop_timer(function(){}, function(rez){if (rez!==-101){$scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Timer','An error report has been created on this issue',true);return;}});
      Flare.start_timer('34', function(ret){
        if (ret==101){
          //updateemergencystate();
          EmergencyFire();
          $rootScope.$emit("pushemer", {}); // to update check in disarm to emergency          
          }

        }, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Timer','An error report has been created on this issue',true);});
      }    
    }, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Timer','An error report has been created on this issue',true);});
  }
}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Timer','An error report has been created on this issue',true);});

	}else{
		$localStorage.activecheckin=false;
	}
}

}

$scope.email=$localStorage.email;


$scope.bluetoothsnoop=function(){   // Bluetooth Sniffer

$scope.UDIDs=[];

if (navigator.appVersion.indexOf("Android") > 0 ){ //auto turn on bluetooth

$cordovaBluetoothLE.enable(function(){},function(){});
 //bluetoothdisabled=false;
}      
          $cordovaBluetoothLE.initialize({request:false}).then(null,
          function(obj) {
          console.log('Unable to initialize bluetooth');
          return;
          },
          function(obj) {
          //  alert('success@init?')
          }
        );

$cordovaBluetoothLE.startScan({services:[]}).then(null,
    function(obj) {
      console.log('Bluetooth Scan Error: '+obj.message);
     return;
    },
    function(obj) {
      if (obj.status == "scanResult")
      {
        $scope.UDIDs.push(obj)
        $scope.output=$scope.output+JSON.stringify(obj)+' ';
      }
      else if (obj.status == "scanStarted")
      {
     
      }
    }
  );

        $timeout(function() {
        if ($scope.UDIDs.length>0){
            snapshot={date:new Date(),data:$scope.UDIDs};
            $localStorage.UDIDlog.push(snapshot);
            }
            $scope.UDIDs=[];

          $cordovaBluetoothLE.stopScan().then(function(obj) {
     // Log.add("Stop Scan Success : " + JSON.stringify(obj));
    }, function(obj) {
     // Log.add("Stop Scan Error : " + JSON.stringify(obj));
    });

        }, 3000); // scan for 3 seconds

}



EmergencyFire=function(type){  // MASTER EMERGENCY FUNCTION
// type parameter is in case we want to distinguish between the types of emergencies in the future.
$localStorage.emergency=true;

var now = new Date().getTime();
var TenSecondsFromNow = new Date(now + 1000);

      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'PhoneFlare Emergency',
        text: 'Your contacts are being notified',
        at: TenSecondsFromNow
      }).then(function () {});


if (typeof $localStorage.justyourself === 'undefined'){$localStorage.justyourself=false}

callcampus=$localStorage.global.campuscall && !$localStorage.justyourself;
Data.alert_emergency(callcampus,1);

EmerLoop=$interval(function(){

Data.alert_emergency(callcampus,1)

},10000);


Flare.start_vibrating("999", function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Timer','An error report has been created on this issue',true);});

if ($localStorage.global.audioalarm){
 Flare.sound_alarm(function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Alarm','An error report has been created on this issue',true);});
}

if ($localStorage.global.audiorec){
Flare.start_recording(function(){},function(rez){
  if (rez!==-400){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Start Recording','An error report has been created on this issue',true);
}
}

  );
}		    

if ($localStorage.global.villages && !$localStorage.justyourself){

navigator.geolocation.getCurrentPosition(function($position){
  $scope.villages(true,$position.coords.latitude,$position.coords.longitude);
},function($error){
	console.log($error);
},{timeout: 10000, enableHighAccuracy: true});

}

if ($localStorage.global.torch){
	$scope.SOSLight();
}
emergencystate=true;

$scope.emeremail(1);

$scope.bluetoothsnoop();

		    $state.go('disarm');

};


$scope.SOSLight=function(){ // window.plugins more or less stable? Test. 

$cordovaFlashlight.available().then(function(isAvailable) {
			
      	if (isAvailable) {

$scope.timee=0;
$scope.SOScounterShort=0;
$scope.SOScounterLong=0;
$scope.SOScounterThree=false;
startSOStimer();


    function startSOStimer() {

if ($scope.SOScounterLong==4){
$scope.SOScounterShort=0;
$scope.SOScounterLong=0;
$scope.SOScounterThree=true;
}

if ($scope.timee%2==0){ 
$cordovaFlashlight.switchOn();
if($scope.SOScounterShort==3){
$scope.timee=$scope.timee+1;
$scope.timeoutSOS = $timeout(startSOStimer, 1200);
return;
}
      }else{
$cordovaFlashlight.switchOff();
if ($scope.SOScounterShort<3){
$scope.SOScounterShort=$scope.SOScounterShort+1;
}
if($scope.SOScounterShort==3){

if ($scope.SOScounterThree){

$scope.SOScounterShort=0;
$scope.SOScounterLong=0;
$scope.SOScounterThree=false;
$scope.timee=$scope.timee+1;
$scope.timeoutSOS = $timeout(startSOStimer, 4200);
return;

}


$scope.timee=$scope.timee+1;
$scope.timeoutSOS = $timeout(startSOStimer, 1000);
$scope.SOScounterLong=$scope.SOScounterLong+1;
return;
}

      }

    $scope.timee=$scope.timee+1;
    $scope.timeoutSOS = $timeout(startSOStimer, 500);
    
  };

				} else {
				    $scope.errorreport(rez,new Error().stack,'Error: Flashlight Inaccessible','Please verify your model has a compatible flash.',false);
				}
			    });
}

//---------------------------------------------------------

$scope.disarm = function() {
	    $state.go('disarm');
    }
	
$scope.logout=function() {
$scope.showloader();
User.logout()
            .$promise
            .then(function(){
            	alarms.clear();
                $state.go("login");
                $scope.hideloader()
            },function($error){
$scope.hideloader()
if ($error.status==404 || $error.status==0) {
$localStorage.nologin=true;
  $state.go("login");
	return;}
else {
  $scope.hideloader()
  if ($error.status!==-1){
  $scope.errorreport($error,new Error().stack,'Logout Error','An error report has been generated',true);
}
}
            	$state.go("login");
            
            });

	};

  $scope.checklocservices=function(){

    Flare.check_locservices(function(rez){
  if(!rez){

  var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Services</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Services <b>must</b> be enabled and set to <b>"always"</b> for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          cordova.plugins.settings.open(function(){}, function(){});
          $scope.checklocservices();
        }
      }
    ]
   });
}

}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Check Location Services','An error report has been created on this issue',true);});

  }


  $scope.androidlocservices=function(){ // check location services available / LG phones error

    if (androidcheck || navigator.appVersion.indexOf("Android") < 0){return};

    androidcheck=true;

navigator.geolocation.getCurrentPosition(function(){},function($error){

if(String($error)=='[object PositionError]' || $error.code==2){
        
     var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Services</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Services <b>must</b> be enabled for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          androidcheck=false;
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });

      }else if ($error.code==1){

     var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Permission</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Permission <b>must</b> be given for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          androidcheck=false;
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });

    }else{
         $scope.errorreport(rez,new Error().stack,'Error: Could Not Initialize Location Services','An error report has been created on this issue',true)
        }


},{timeout: 10000});


  }


//------------PLATFORM FUNCTIONS-------------------

$ionicPlatform.on('pause', function(){
 // $scope.alarms = alarms.all();

if ($localStorage.emergency || $localStorage.activecheckin || tetherarmstate==true || CheckInEmergency==true || TetherEmergency==true || DirectEmergency==true || emergencystate==true){

if (navigator.appVersion.indexOf("iPhone") > 0){
  Flare.start_silent_player(function(){},function(){});
}
}else{
  if (navigator.appVersion.indexOf("iPhone") > 0){
  Flare.stop_silent_player(function(){},function(){});
}

}

})

$ionicPlatform.on('resume', function(){

  if (CheckInEmergency==true || TetherEmergency==true || DirectEmergency==true || emergencystate==true || $localStorage.emergency || $localStorage.CheckIn){
        $state.go('disarm');return;
      }
      if (tetherarmstate==true){
        $state.go('tab.tether');
      }
      if ($localStorage.activecheckin){
      	$state.go('tab.checkin');
      }

if (navigator.appVersion.indexOf("iPhone") > 0){
Flare.stop_silent_player(function(){},function(){});
}

if (navigator.appVersion.indexOf("iPhone") > 0 && $state.current.url!=='/login'){
   Flare.is_emergency(function(res){
      if (res==true){$state.go('disarm');return;}
     }, function(rez){
      $scope.errorreport(rez,new Error().stack,'Error: Could Not Check Emergency State','An error report has been created on this issue',true);
     });

navigator.geolocation.getCurrentPosition(function(){},function(rez){
  if (rez.code!==1){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Initialize Location Services','An error report has been created on this issue',true);
    }
}
  );

$scope.checklocservices();
navigator.geolocation.clearWatch(function(rez){alert('cleared'+rez)},function(rez){alert('not cleared'+rez)})
}

$scope.settimer();

User.emergencies({id: Data.get("id"), filter: {where: {active: true}}})
.$promise
    .then(function($res){
if ($res.length!==0){
  emergencystate=true;
$state.go('disarm');
  }else{
    
  }
    },function($error){
//$scope.errorreport($error,new Error().stack,'Error: Could Not Connect to Server','An error report has been created on this issue',true)
    });

User.getCurrent(function($debug){
    
},function(err){

    
//revoked access token || not logged in // AUTO login
if(err.status==401){

if($localStorage.password && $localStorage.email && User.isAuthenticated){

  credentials = {"email":$localStorage.email,"password":$localStorage.password}
     
 User.login(credentials, function($access_token){
    Data.set("id", $access_token.userId);
      }, function($error){
       $location.path("/login");
      });

}

        
$location.path("/login");
 

// not Connected to the internet
  }else if(err.status==0){

       if($localStorage.email || User.isAuthenticated){
            // go to app without internet, load local storage options, alarms and contacts
          }else{
            //registration screen
            $location.path("/login");
          };
  };
});

	});

//-------------------------------------------------------------
	
	$scope.infobutton=function() {
    // $scope.debug() // temporary debug function
	    $state.go('info') // go to the relevant info page? Using lastview?
  }
	
	
	$scope.toggleLeft = function() {
            secondlastview=$ionicHistory.currentStateName(); // consolidate double back function
            lastview=$ionicHistory.currentStateName();
            $ionicSideMenuDelegate.toggleLeft();
	};
	
	
	$scope.back = function() {

		if (lastview=="tab.tether") {
		    $state.go('tab.tether');
		    $scope.tetherarmstate=tetherarmstate;
		}else if (lastview=="tab.checkin") {$state.go('tab.checkin');
						}else{$state.go('tab.contacts')}
        }
    })


.controller('TabCtrl', function($scope, $ionicPopup, $state, $localStorage, contacts, $cordovaLocalNotification, $cordovaAppRate,$cordovaBluetoothLE,$ionicPlatform) {

ionic.Platform.ready(function(){
//document.addEventListener("deviceready", function () {

if (typeof $localStorage.build === "undefined" || $localStorage.build!==$localStorage.currentbuild){
$localStorage.build=$localStorage.currentbuild;
if(typeof $localStorage.global !== "undefined"){
  $localStorage.global.firstlogin=false;
};
}

if (CheckInEmergency==true || TetherEmergency==true || DirectEmergency==true || emergencystate==true || $localStorage.emergency){
        emergencystate=true;
        $state.go('disarm');
        return;
   }
 
if (!$localStorage.global.edu && $localStorage.global.firstlogin){

navigator.geolocation.getCurrentPosition(function($position){

if ($position.coords.latitude>28.2 && $position.coords.latitude<28.98 && $position.coords.longitude>-82.04 && $position.coords.longitude<-81.95){

$scope.temppopup={}
var alertPopup = $ionicPopup.confirm({
     title: '<b>Villages</b> Resident?',
     subTitle: 'Enter your <b>name</b> on the first line and <b>ID#</b> on the second. ID# can be found on your Villages Resident card',
     template: '<input type="text" ng-model="temppopup.name" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:7px;color:#545454"><input type="number" ng-model="temppopup.id" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:7px;color:#545454"></div>',
     scope: $scope,
     buttons: [
     { text: 'No',
       onTap: function() {
            $localStorage.global.firstlogin=false;
          }
      },
      {
        text: '<b>Submit</b>',
        type: 'button-positive',
        onTap: function(res) {
if($scope.temppopup.ul){
        	$scope.temppopup.ul=$scope.temppopup.ul.replace(/\./g,'');
//res.preventDefault();

}

if (false){
	(alert('Invalid U/L#'))
	res.preventDefault();
	

}else if (Number($scope.temppopup.id)=='NaN'||String($scope.temppopup.id).length!==6){
        		alert('invalid ID#')
        		res.preventDefault();
        		
        }else{
$scope.temppopup.ul=null;
$localStorage.global.villages=true;
$localStorage.global.villagesUL=$scope.temppopup.ul;
$localStorage.global.villagesID=$scope.temppopup.id;
$localStorage.global.villagesName=$scope.temppopup.name;
        }
           // $scope.temppopup.id
        }
        }
      
    ]
   });

}
$localStorage.global.firstlogin=false; 
		}, function($error){
          if (androidcheck || navigator.appVersion.indexOf("Android") < 0){return};

    androidcheck=true;

      if(String($error)=='[object PositionError]' || $error.code==2){
        
     var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Services</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Services <b>must</b> be enabled for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          androidcheck=false;
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });

      }else if ($error.code==1){

     var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Permission</b> 1652',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Permission <b>must</b> be given for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          androidcheck=false;
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });

    }else{
				 $scope.errorreport(rez,new Error().stack,'Error: Could Not Initialize Location Services','An error report has been created on this issue',true)
	      }
		},{timeout: 10000});
}

// Load sharemeals and/or Birds Upstairs prompts? 

	AppRate.preferences.storeAppURL.ios = '1068075904';
	AppRate.preferences.storeAppURL.android = 'market://details?id=com.jarvisfilms.phoneflare';
	AppRate.preferences.usesUntilPrompt = 11;

    $cordovaAppRate.promptForRating(false).then(function (result) {
        // success
    });

      $cordovaBluetoothLE.initialize({request:false}).then(null,
          function(obj) {
            bluetoothdisabled=false;
          },
          function(obj) {
            //alert(JSON.stringify(obj))
            if(obj.status=='enabled'){
                bluetoothdisabled=false;
            }
            
            if(obj.status=='disabled'){
                bluetoothdisabled=true;
            }
          }
        );


  });


$scope.showConfirm = function() {
$scope.contacts=contacts.all();

if (navigator.appVersion.indexOf("iPhone") > 0 ){
$scope.checklocservices();
$cordovaLocalNotification.promptForPermission(function () {});
}

if($scope.contacts.length>0){
	    var confirmPopup = $ionicPopup.confirm({
    title:'<b>Emergency</b>',
		template: '<span style="color:black;font-size:16px"><b>Notify</b> your contacts you are in trouble and need help? </span>',
		cancelText:'no',
		//cancelType:'button-balanced',
		okText:'YES',
		okType:'button-assertive'

	    });

	    confirmPopup.then(function(res) {
		if (res){
	DirectEmergency==true;
  emergencystate=true;
	EmergencyFire();
		}
	    });
	 }else{
	 	//alert('Need at least one contact')
			$state.go("tab.contacts")

	};
	};

    })



    .controller('TetherCtrl', function($scope, $state, contacts, $localStorage, $cordovaLocalNotification,$ionicPopup,$cordovaBluetoothLE) { // servercomm,

if (navigator.appVersion.indexOf("iPhone") > 0 ){
$scope.checklocservices();
$cordovaLocalNotification.promptForPermission(function () {
    });
}


$scope.tetherarmrouter=function(){

	$scope.contacts=contacts.all()
			if($scope.contacts.length>0){
	    if ($scope.tetherarmstate==true) {
/*
if (navigator.appVersion.indexOf("iPhone") > 0 ){
Flare.check_locservices(function(rez){alert(rez)}, function(rez){alert('er'+rez)});
}
*/

Flare.stop_listening(function(){},function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Disarm','An error report has been created on this issue',true);});
	//$scope.$apply(function(){
				$scope.tetherarmstate = false;
        tetherarmstate=false;
	//});

	    }else{

if (navigator.appVersion.indexOf("iPhone") > 0 ){
$scope.checklocservices();

cordova.plugins.notification.local.registerPermission(function (ren) {
		if(!ren){
	
var alertPopup = $ionicPopup.alert({
     title: 'Notifications<b>Required</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Tether with PhoneFlare require notifications to be active</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });
	return
		}
	},function(){});
}else{$scope.androidlocservices()}

		Flare.listen_for_headphones(
		    function(response){

			if (response == Flare.HEADPHONES_LISTENING) {

			    tetherarmstate=true;
			    $scope.$apply(function(){
				$scope.tetherarmstate = true;
			    });


$cordovaBluetoothLE.initialize({request:false}).then(null,
          function(obj) {
            bluetoothdisabled=false;
          },
          function(obj) {
            if(obj.status=='enabled'){
                bluetoothdisabled=false;
            }
            
            if(obj.status=='disabled'){
                bluetoothdisabled=true;
            }
          }
        );

          if(typeof bluetoothdisabled==='undefined'){
            bluetoothdisabled=false;
          }
          $scope.bluetoothdisabled=bluetoothdisabled;			    
			}

			if (response == Flare.HEADPHONES_TRIGGERED) {

var now = new Date().getTime();
var TenSecondsFromNow = new Date(now + 1000);

      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Headpone Alarm Triggered',
        text: 'You have 10 seconds before your contacts are notified! ',
        at: TenSecondsFromNow
      }).then(function () {});

Flare.arm_alarm(function(){},function(){});
Flare.start_vibrating("999", function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Vibrating','An error report has been created on this issue',true);});
				if ($localStorage.global.audioalarm){
 Flare.sound_alarm(function(){}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Alarm','An error report has been created on this issue',true);});
}

Flare.stop_timer(function(){}, function(rez){if (rez!==-101){$scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Timer','An error report has been created on this issue',true);return;}});


  Flare.start_timer('19',function(res){ // Delay before contacts are notified, make option?
			    	if (res == 100) {
			  
  		  TetherEmergency=true;
			  lastview="Tether";
			  tetherarmstate=false;  
				$scope.tetherarmstate = false;
				emergencystate=true;
				$state.go('disarm');
			    	};

			    	if (res==101) {
			    		EmergencyFire()};
			    }, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Start Timer','An error report has been created on this issue',true);});		    
			}
	},
		    function(response){
		    	if (response == -202) {
    var alertPopup = $ionicPopup.alert({
     title: 'Headphone <b>Port</b>',
     subTitle: 'Port not engaged',
     template: '<span style="color:black !important">Please be sure to plug in your accessory before arming PhoneFlare.</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

}else{
$scope.errorreport(response,new Error().stack,'Headphone Port Error','An error report has been created on this issue',true);
}
});

	    }
	    }else{
	    	//alert('Need at least one contact') // Prompt user? 
			$state.go("tab.contacts")

	};
	};

})


.controller('CheckinCtrl', function($scope, $state, $timeout, $ionicPopup, alarms, User, Data, $localStorage, contacts, $cordovaLocalNotification, $interval) {

$scope.accessorycheckin=function(){
  if (navigator.appVersion.indexOf("iPhone") > 0 ){
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
}
$scope.settimer();
}

	$scope.Math = window.Math;
	$scope.temppopup = {};

	$scope.alarms = alarms.all();


if (navigator.appVersion.indexOf("iPhone") > 0 ){
$scope.checklocservices();
$cordovaLocalNotification.promptForPermission(function () {
    });
}else{$scope.androidlocservices()};

$scope.addalarm = function(){

$scope.contacts=contacts.all();
if ($scope.alarms.length<5){
if($scope.contacts.length>0){

if (navigator.appVersion.indexOf("iPhone") > 0 ){
		Flare.check_locservices(function(rez){
			if(rez){

					cordova.plugins.notification.local.registerPermission(function (ren) {
		if(ren){

				$scope.alarmpopup();			
}
		if(!ren){

  var alertPopup = $ionicPopup.alert({
     title: 'Notifications<b>Required</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Check-ins with PhoneFlare require notifications to be active</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
    cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });

    };
})

			};

			if(!rez){
$scope.checklocservices();
  return;

      }

}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Check Location Services','An error report has been created on this issue',true);});


}else {  //for android
$scope.androidlocservices();
$scope.alarmpopup()
} 


		}else{

  var alertPopup = $ionicPopup.alert({
     title: 'Need One <b>Contact</b>',
     template: '<span style="color:black !important">You must have at least one contact to use PhoneFlare</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          $state.go("tab.contacts");
        }
      }
    ]
   });
			$state.go("tab.contacts")
		};		

}else{

  var alertPopup = $ionicPopup.alert({
     title: 'Maximum Check-Ins',
     template: '<span style="color:black !important">You may not have more than five check-ins at once.</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
};

}

	$scope.alarmpopup = function(tim) {
	
		$scope.temppopup.when="today";
		$scope.temppopup.repeat="no";
	    var dateToday = new Date();
	    $scope.temppopup.time = new Date(dateToday.setHours(dateToday.getHours()+1)&&dateToday.setSeconds(0)&&dateToday.setMilliseconds(0));
   
if (navigator.appVersion.indexOf("Android") > 1 || navigator.appVersion.indexOf("iPhone") > 1){
          datePicker.show({date:$scope.temppopup.time,mode:'time'}, function(date){
          	if(date){
          	$scope.$apply(function(){$scope.temppopup.time=date})
          	}else{confirmPopup.close()}
          }, function(){});

   }

	 var confirmPopup = $ionicPopup.confirm({
		title:'Confirm <b>Check-In</b>',
    cssClass: "higher_popup",
		subTitle: 'Set when you want to <b>check back</b> in with PhoneFlare',
		template: '<input autofocus type="time" ng-model="temppopup.time" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:10px;color:#545454"><div class="Date checkinbck"><label class="item item-input item-select"><div class="input-label">When?</div><select ng-model="temppopup.when"><option value="today">Today</option><option value="tomorrow">Tomorrow</option></select></label></div><div class="Repeat checkinbck"><label class="item item-input item-select"><div class="input-label">Repeat?</div><select ng-model="temppopup.repeat"><option value="no" selected>No</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select></label></div>',
		cancelText:'cancel',
		okText:'Ok',
		okType:'button-balanced',
		scope: $scope
	    })
	    confirmPopup.then(function(res) {
		if(res) {


if($scope.temppopup.when=="tomorrow"){

$scope.temppopup.time = $scope.temppopup.time.setHours($scope.temppopup.time.getHours()+24)

};

var todaydate = new Date();

var fivemindate = new Date(todaydate.setMinutes(todaydate.getMinutes()+5))

if (fivemindate>$scope.temppopup.time){

        var alertPopup = $ionicPopup.alert({
     title: 'Invalid <b>Check-In</b>',
     template: '<span style="color:black !important">You cannot set a check-in alarm for before five minutes from now</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
  return; //remove to debug ()()()
}

for (i=0;$scope.alarms.length>i;i++){

compdate= new Date($scope.alarms[i].end)
fivebefore = new Date(compdate.setMinutes(compdate.getMinutes()-5))
fiveafter = new Date(compdate.setMinutes(compdate.getMinutes()+10))
if(fiveafter>$scope.temppopup.time && fivebefore<$scope.temppopup.time){alert('Check-Ins must be at least 5 minutes apart');return;}

}



$scope.alarms.push(
	{end:$scope.temppopup.time, repeat:$scope.temppopup.repeat}
	);
$localStorage.alarms=$scope.alarms;

$scope.settimer();
if (typeof bluetoothdisabled === 'undefined'){bluetoothdisabled=false}
$scope.bluetoothdisabled=bluetoothdisabled;


/* // ---------------IF WE WANT TO HANDLE TIMERS ONLINE ----------------
		    User.timers.create({id: Data.get("id")}, {end: $scope.temppopup.time})
			.$promise
			.then(function($timer){
			    alarms.add({
				end: $scope.temppopup.time,
				id: $timer.id});
			$localStorage.alarms=$scope.alarms;
			},
			      function($error){
				  alert('Alarm could not be added, Check Internet Connection')
			      });
*/

	}
	    });
	}

	$scope.remove = function(alarm) {
alarms.remove(alarm);
cordova.plugins.notification.local.cancelAll(function() {}, function() {});
$localStorage.alarms=$scope.alarms;
$scope.settimer();
	}


	$scope.editAlarm = function(index) {

		$scope.temppopup.repeat=$scope.alarms[index].repeat;
	    $scope.temppopup.time = $scope.alarms[index].end;
	    $scope.temppopup.time=new Date($scope.alarms[index].end);
datePicker.show({date:$scope.temppopup.time,mode:'time'}, function(date){$scope.$apply(function(){$scope.temppopup.time=date})}, function(){});
      var confirmPopup = $ionicPopup.confirm({
		title:'Edit Check-In Alarm',
    cssClass: "higher_popup",
		subTitle: 'Set when you want to check back in with PhoneFlare',
		template: '<input autofocus type="time" ng-model="temppopup.time" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:10px;color:#545454"><div class="Date"></div><div class="Repeat checkinbck"><label class="item item-input item-select"><div class="input-label">Repeat?</div><select ng-model="temppopup.repeat"><option value="no" selected>No</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select></label></div>',
		cancelText:'Check-In',
		okText:'Ok',
		okType:'button-balanced',
		scope: $scope
	    })
	    confirmPopup.then(function(res) {
		if(res) {


var todaydate = new Date();
if (todaydate>$scope.temppopup.time){alert('You cannot set a check-in alarm for before the current time');return;}
var fivemindate = new Date(todaydate.setMinutes(todaydate.getMinutes()+5))
if (fivemindate>$scope.temppopup.time){alert('Check-In must be at least 5 minutes from now');return;}

for (i=0;$scope.alarms.length>i;i++){
  if(i==index){continue};

compdate= new Date($scope.alarms[i].end)
fivebefore = new Date(compdate.setMinutes(compdate.getMinutes()-5))
fiveafter = new Date(compdate.setMinutes(compdate.getMinutes()+10))
if(fiveafter>$scope.temppopup.time && fivebefore<$scope.temppopup.time){alert('Check-Ins must be at least 5 minutes apart');return;}

}

	alarms.remove(index);
	cordova.plugins.notification.local.cancelAll(function() {}, function() {});

$scope.alarms.push(
	{end:$scope.temppopup.time, repeat:$scope.temppopup.repeat}
	);

$localStorage.alarms=$scope.alarms;

		$scope.settimer();
		}else if (!res){

			if($scope.temppopup.repeat=="no"){
		    alarms.remove(index);
		    }
		    if($scope.temppopup.repeat=="daily"){
			$scope.temppopup.time = $scope.temppopup.time.setHours($scope.temppopup.time.getHours()+24)
			alarms.remove(index);
			$scope.alarms.push(
			{end:$scope.temppopup.time, repeat:"daily"});
			$localStorage.alarms=$scope.alarms;
		    };
		    if($scope.temppopup.repeat=="weekly"){
			$scope.temppopup.time = $scope.temppopup.time.setHours($scope.temppopup.time.getHours()+168)
			alarms.remove(index);
			$scope.alarms.push(
			{end:$scope.temppopup.time, repeat:"weekly"});
			$localStorage.alarms=$scope.alarms;
		    };
cordova.plugins.notification.local.cancelAll(function() {}, function() {});
		$localStorage.alarms=$scope.alarms;
		$scope.settimer();
		};
	    });
	}

    })


//  CONTACTS CONTROLLER
.controller('ContactsCtrl', function($scope, $ionicPopup, contacts, Data, User, Contact, $localStorage, $ionicPlatform, $state) {

ionic.Platform.ready(function(){

User.emergencies({id: Data.get("id"), filter: {where: {active: true}}})
.$promise
    .then(function($res){
if ($res.length!==0){ 
emergencystate=true;
$state.go('disarm');
  }else{
  }
    },function($error){
$scope.errorreport($error,new Error().stack,'Error: Could Not Connect to Server','An error report has been created on this issue',true)
});

if (navigator.appVersion.indexOf("iPhone") > 0 ){

navigator.geolocation.getCurrentPosition(function(){},function(rez){
  if (rez.code!==1){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Initialize Location Services','An error report has been created on this issue',true);
}
});

     Flare.is_emergency(function(res){
      if (res==true){$state.go('disarm');}else{$scope.checklocservices()}
     }, function(rez){
      $scope.errorreport(rez,new Error().stack,'Error: Could Not Check Emergency State','An error report has been created on this issue',true);
     });

}else if ($localStorage.global.edu || !$localStorage.global.firstlogin){
  $scope.androidlocservices();
}

})

$scope.contacts=contacts.all();

 if ($scope.contacts.length==0 && !localStorage.contacts){$scope.animation=true}else{$scope.animation=false};


$scope.remove = function($contact) {
    $scope.showloader();
	
			if($scope.contacts.length>1){ // ~0 or 1

	    Contact.prototype$updateAttributes({id: $contact.id}, {active: false})
		.$promise
		.then(function(){

		    for(var i = 0; i < $scope.contacts.length ; i++){
			if ($scope.contacts[i]["id"] === $contact.id){
			    $scope.contacts.splice(i, 1);

			}
		    }
$scope.hideloader();

		},function($error){
$scope.hideloader();
    if ($error.status==404 || $error.status==-1) {$scope.errorreport($error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
    else if ($error.status==0) {$scope.errorreport($error,new Error().stack,'Server Error','We might be performing maintenance to the server, or your internet connection may be unusable. Thank you for your patience and please check social media for planned outages',true);}
    else {$scope.errorreport($error,new Error().stack,'Error: Could Not Delete Contact from Server','An error report has been created on this issue',true);}

    });
		$localStorage.contacts = $scope.contacts

	if ($scope.contacts.length==0){
    nocontacts(true);
		iscontactsglobal(false); // save to local storage here?
}else{iscontactsglobal(true)}
	  }else{
      $scope.hideloader();
        var alertPopup = $ionicPopup.alert({
     title: 'Need One <b>Contact</b>',
     template: '<span style="color:black !important">You must have at least one contact to use PhoneFlare</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

    }; 
	};
	


$scope.pluscontact = function(){

if ($scope.contacts.length<5){
			$scope.contactpicker();	
}else{

    var alertPopup = $ionicPopup.alert({
     title: 'Max # of <b>Contacts</b>',
     template: '<span style="color:black !important">You may not have more than five contacts using PhoneFlare</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
};

}


	$scope.contactpicker = function(contact){

  // hardcode contact add
  //$scope.contactpopup('1234567','John',"img/empty_avatar.png",'Testing');return

navigator.contacts.pickContact(function(contact){

var temp=null;  
var name=null;
var lastname=null;

if (contact.name==null){

  var alertPopup = $ionicPopup.alert({
     title: 'Contact <b>Invalid</b>',
     subTitle: 'Contact Needs a Name',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

return;
}
//Extract First and last name
if(contact.name.familyName){lastname=' ' + contact.name.familyName}else{lastname=''}
name=contact.name.givenName + lastname;
//alert(JSON.stringify(contact)+' '+name);

if (name=='null'){

  if (contact.emails[0]){

        name=contact.emails[0].value;

  }else{

      var alertPopup = $ionicPopup.alert({
     title: 'Contact <b>Invalid</b>',
     subTitle: 'Contact Needs a Name',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

return;
}

}
//-----------------------------------
if (contact.photos == null) {
        avatar = "img/empty_avatar.png";
    }else{
        avatar=contact.photos[0].value;
    }


if (contact.phoneNumbers==null){
$scope.contactpopup('',name,avatar,'No Phone Number')

}else{

		if (contact.phoneNumbers.length>1){
		
     for (i=0;i<contact.phoneNumbers.length;i++){
		    
		    if (contact.phoneNumbers[i].type == "iPhone") {temp=contact.phoneNumbers[i].value;break};
			if (contact.phoneNumbers[i].type == "mobile") {temp=contact.phoneNumbers[i].value;break};    
			temp=contact.phoneNumbers[0].value;
		 }

		}else{temp=contact.phoneNumbers[0].value}

tempTEST=temp.replace(/\D/g,'');
if (tempTEST.length>10){
tempTEST=tempTEST.substr(tempTEST.length - 10);
}
if (tempTEST.length==7) {$scope.contactpopup(temp,name,avatar,'Area code absent?');return;}
if (tempTEST.length<10) {$scope.contactpopup(temp,name,avatar,'illegal phone number');return;}

var yourself=false; // Detect if you add yourself

if (contact.emails){
  for (i=0;i<contact.emails.length;i++){

    if (contact.emails[i].value==$localStorage.email){
      yourself=true;
    };

  }
};

$scope.addcontact(temp,name,avatar,yourself);

}

	    },function(err){
        if (err==20){
var alertPopup = $ionicPopup.alert({
     title: 'Contact <b>Settings</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Contact access <b>must</b> be enabled for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });
        }else if(err!==6){
$scope.errorreport($error,new Error().stack,'Problem Accessing Contacts','An error report has been generated',true);
        }

      });

	};

$scope.addyourself=function(yourself){

if (yourself && $scope.contacts.length==1){
$localStorage.justyourself=true;

}else{
$localStorage.justyourself=false;
};
}

$scope.contactpopup=function(temp,name,avatar,message){
tempTEST=temp.replace(/\D/g,'');
if (tempTEST.length>10){
tempTEST=tempTEST.substr(tempTEST.length - 10);
}

if (tempTEST.length>6){
tempTEST='('+tempTEST.substring(0,3)+')'+tempTEST.substring(3,6)+'-'+tempTEST.substring(6,10);
}else if(tempTEST.length>2){
tempTEST='('+tempTEST.substring(0,3)+')'
}



$scope.temppopup={};
$scope.temppopup.mobile=tempTEST;
$scope.name=name;

$scope.verified=false;

$scope.telinput=function(){
$scope.temppopup.mobile=$scope.temppopup.mobile.replace(/\D/g,'');

if ($scope.temppopup.mobile.length<10){$scope.verified=false}
if ($scope.temppopup.mobile.length>10){
  $scope.temppopup.mobile=$scope.temppopup.mobile.slice(0,-1);
}

if ($scope.temppopup.mobile.length==10){
$scope.temppopup.mobile='('+$scope.temppopup.mobile.substring(0,3)+') '+$scope.temppopup.mobile.substring(3,6)+'-'+$scope.temppopup.mobile.substring(6,10);
$scope.verified=true;
}

};
name=name.trim();
name=name.replace(/\s.+\s/g,' ');

var alertPopup = $ionicPopup.confirm({
     title: 'Mobile <b>Number</b>',
     subTitle: message,
     template: '<div style="text-align:center"><span style="color:black">Enter a number for <b>{{name}}</b>:</span></div><input autofocus type="tel" ng-change="telinput()" ng-model="temppopup.mobile" style="background:transparent;font-size:20px;text-align:center;padding-left:7px;color:black"></div>',
     cancelText:'cancel',
    okText:'Next',
    scope: $scope,
    buttons: [
    { text: 'Cancel' },
    {
        text: '<b>Next</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.verified){
           e.preventDefault();
           alert("not a valid number")
           return;
          }
          temp=$scope.temppopup.mobile;

  $scope.addcontact(temp,name,avatar);

        }
      }
    ]

      })

};

	

$scope.addcontact=function(temp,name,avatar,yourself){

tempTEST=temp.replace(/\D/g,'');
if (tempTEST.length>10){
tempTEST=tempTEST.substr(tempTEST.length - 10);
}
console.log((typeof temp)+' '+temp);

for (i=0;i<$scope.contacts.length;i++){

    if ($scope.contacts[i].phone==tempTEST){
     var alertPopup = $ionicPopup.alert({
     title: 'Contact <b>Added</b>',
     subTitle: 'Contact is already a PhoneFlare Friend',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
     return;

        }
      }
      
$scope.animation=false;

$scope.showloader();


    Contact.add({
        data: {
      userId: Data.get("id"),
      name: name,
      phone: temp,
      photo: avatar,
      active: true
        }
    })
        .$promise
        .then(function($add_success){

if ($add_success.twilio_response){
       if ($add_success.twilio_response.status==400){
        $scope.hideloader();
                alert("Twilio cannot verify this phone number. Keep in mind int'l numbers are not yet supported but we hope to soon");
                return;
       }
       }


    nocontacts(false);

    $scope.hideloader();
  $scope.contacts.push($add_success.contact);
  
  $scope.addyourself(yourself); // Check to see if you've only added yourself

         iscontactsglobal(true)
      
        },function($error){
$scope.hideloader();
    if ($error.status==404) {$scope.errorreport($error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
    else if ($error.status==0) {$scope.errorreport($error,new Error().stack,'Server Error','We might be performing maintenance to the server, or your internet connection may be unusable. Thank you for your patience and please check social media for planned outages',true);}
    else { $scope.errorreport($error,new Error().stack,'Error: Could Not Add Contact to Server','An error report has been created on this issue',true);}

        });

   $localStorage.contacts = $scope.contacts
}


})


.controller('CampusCtrl', function($scope,$localStorage,$compile, Data) {

$scope.global=Data.global();

if (!$scope.global.campuscall){

 var alertPopup = $ionicPopup.confirm({
     title: 'Activate<b>Feature</b>',
     subTitle: 'If you are a current student we strongly suggest you turn on campus notification',
     buttons: [
     { text: 'Cancel',
       onTap: function() {
            $scope.back();
          }
      },
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
              alert('turn back on')
        }
      }
    ]
   });

}

$scope.schoolname=$localStorage.UniversityInfo.schoolname;
$scope.schoolstatus=$localStorage.UniversityInfo.schoolstatus;
$scope.schoolnumber=$localStorage.UniversityInfo.schoolnumber;
$scope.centergeo=$localStorage.UniversityInfo.centergeo;


$scope.mapinit=function(){
  var myLatlng = $localStorage.UniversityInfo.centergeo;
  //var myLatlng = new google.maps.LatLng(41,-74);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    bounds: $localStorage.UniversityInfo.boundsgeo
  });

$scope.map=map;
}
    })



.controller('InfoCtrl', function($scope, $ionicSlideBoxDelegate,$timeout) {

$scope.initinfo=function(){

$timeout(function(){
vid = document.getElementById("video-player"); 
vid.play();

document.getElementById("video-player").addEventListener('ended',myHandler,false);
    function myHandler(e) {
        $scope.nextslide();
    }

},200);

};


$scope.infoback=function(){
  vid.pause();
  $scope.back();
};

$scope.vidctrl=function($index){
  if ($index==1){vid.pause()};
  if ($index==0){vid.play()};
}

      $scope.nextslide=function(){   
        $ionicSlideBoxDelegate.next()
      }
      $scope.previousslide=function(){
        $ionicSlideBoxDelegate.previous()
      }



      if (emerinfo){
             $timeout(function() {
  $ionicSlideBoxDelegate.slide(2,300);
}, 100);
     emerinfo=false;
      }
      if (lastinfo){
     $timeout(function() {
  $ionicSlideBoxDelegate.slide(5,300);
}, 100);
     lastinfo=false;

      }

     if (multiinfo){
     $timeout(function() {
  $ionicSlideBoxDelegate.slide(4,300);
}, 100);
     multiinfo=false;
     }

    })
  
.controller('ProjectsCtrl', function($scope, $window) {

if (navigator.appVersion.indexOf("Android") > 0 ){
$scope.SMSTactics=true;
}else{
	$scope.SMSTactics=false;
}

$scope.synonymy=function(){
  if (navigator.appVersion.indexOf("Android") > 0 ){
  $window.open("http://play.google.com/store/apps/details?id=air.com.jarvisfilms.synonymylite");
}else{
  $window.open('http://itunes.apple.com/us/app/synonymy-lite/id938998017?ls=1&mt=8', '_blank', 'location=yes');
}

}

$scope.cinq=function(){
  $window.open('http://www.cinqmarsmedia.com','_system');
}

$scope.credits=function(){
  $window.open('http://www.phoneflare.com/credits.html','_system');
}

$scope.birds=function(){
  $window.open('https://www.youtube.com/embed/2rI_em4MscE?VQ=HD1080&autoplay=1','_system');
}

$scope.smstactics=function(){
  $window.open('https://play.google.com/store/apps/details?id=com.jarvisfilms.smstactics&hl=en','_blank');

}

$scope.wordunk=function(){
  if (navigator.appVersion.indexOf("Android") > 0 ){
  $window.open('https://play.google.com/store/apps/details?id=com.jarvisfilms.wordunknown&hl=en','_blank');
}else{
  $window.open('https://itunes.apple.com/de/app/word-unknown/id1064901570?l=en&mt=8','_blank');
}
}

$scope.iconic=function(){
  if (navigator.appVersion.indexOf("Android") > 0 ){
  $window.open('https://play.google.com/store/apps/details?id=com.ionicframework.menu656740&hl=en','_blank');
}else{
  $window.open('https://itunes.apple.com/de/app/iconic-passwords/id1042191398?l=en&mt=8','_blank');
}
}

$scope.tmm=function(){
  $window.open('http://www.typemymusic.com','_system');
}

$scope.me=function(){
  $window.open('http://www.jarvisfilms.com','_system');
}

$scope.jon=function(){
  $window.open('http://jonathanchin.com','_system');
}

$scope.michelle=function(){
  $window.open('http://www.imdb.com/name/nm0005502/','_system');
}

})


.controller('OptionsCtrl', function($scope, $ionicSideMenuDelegate, $localStorage, Data, $ionicPopup, User, $state,$cordovaBluetoothLE) {
$scope.global=Data.global();

$scope.torchwarn=function(){
if ($scope.global.torch){
      
if (navigator.appVersion.indexOf("Android") > 0 ){

   var alertPopup = $ionicPopup.alert({
     title: 'Feature Still in <b>Beta</b>',
     subTitle: 'This feature is <b>disabled</b> by default because we have had reports it crashes some versions of the Android OS. We are hard at work on a fix. In the meantime, please use at your own risk.',
    // template: '<span style="color:black !important">Location Services <b>must</b> be enabled and set to <b>"always"</b> for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

}else{

   var alertPopup = $ionicPopup.alert({
     title: 'Feature <b>Caveat</b>',
     subTitle: 'Please keep in mind that this feature currently <b>only</b> works in the <b>foreground</b> on iOS. We are looking into a solution for future updates.',
    // template: '<span style="color:black !important">Location Services <b>must</b> be enabled and set to <b>"always"</b> for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

}

  }
}


$scope.multiinfo=function(){
multiinfo=true;
$state.go('info');
}
$scope.emerinfo=function(){
emerinfo=true;
$state.go('info');
}


	if (!$scope.global.color){$scope.global.MCdisarm=false;};

$scope.dispatchalert=function(){

  if (!$scope.global.campuscall){

var alertPopup = $ionicPopup.alert({
     title: 'Are you sure?',
     subTitle: 'Please reconsider',
      scope: $scope,
     template: '<span style="color:black !important">Most colleges have "good samaritan" laws where minor infractions (including underage drinking and drug use) are excused in situations that are in the interest of pubic safety. Our volunteers want to help you utilize the resources of your university and are here to allay any concerns you might have. Please contact us.',
     buttons: [
   {
        text: '<b>Cancel</b>',
        onTap: function() {
          $scope.global.campuscall=true;
        }
      },
      {
        text: '<b>Confirm</b>',
        type: 'button-positive',
        onTap: function() {


     }
      }
    ]
   });
}
}


  $scope.popupforgetpass=function(){
      // Send password to users email using PHP script? 

      var alertPopup = $ionicPopup.alert({
     title: 'Forgot <b>Password</b>',
     subTitle: 'Confirm you own your Email',
     template: '<span style="color:black !important">Send us an email at "accounts@phoneflare.com" from your registered account address with the subject line: "Forgot Password".</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
    //alert('onTap')
        }
      }
    ]
   });

  };

  $scope.passwordupdate=function(){
$scope.temppopup={};
   var alertPopup = $ionicPopup.confirm({
     title: 'Change <b>Password</b>',
     subTitle: 'Enter your old password',
     template: '<input autofocus type="password" ng-model="temppopup.oldpass" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:7px;color:#545454"></div>',
     cancelText:'cancel',
    okText:'Next',
    scope: $scope
      })
      alertPopup.then(function(res) {
    if(res) {
      if ($scope.temppopup.oldpass==$localStorage.password){
        
        var alertPopup = $ionicPopup.confirm({
     title: 'New <b>Password</b>',
     subTitle: 'Enter new password',
     template: '<input autofocus type="password" ng-model="temppopup.newpass" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:7px;color:#545454"></div>',
     cancelText:'cancel',
    okText:'Next',
    scope: $scope
      })
      alertPopup.then(function(res) {
    if(res) {

var alertPopup = $ionicPopup.confirm({
     title: 'Verify <b>Password</b>',
     subTitle: 'Re-Enter your new password',
     template: '<input autofocus type="password" ng-model="temppopup.verifynew" style="background:transparent;font-size:30px;text-align:center;margin-bottom:10px;padding-left:7px;color:#545454"></div>',
     cancelText:'cancel',
    okText:'Next',
    scope: $scope
      })
      alertPopup.then(function(res) {
    if(res) {
      if ($scope.temppopup.newpass==$scope.temppopup.verifynew){
        $scope.showloader();
      User.prototype$updateAttributes({id:Data.get("id")},{password: $scope.temppopup.newpass})
    .$promise
    .then(function(){
      $scope.hideloader();

        $localStorage.password=$scope.temppopup.newpass;

    var alertPopup = $ionicPopup.alert({
     title: 'Password <b>Changed</b>',
     subTitle: 'Your password was successfully changed.',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

    },function($error){
$scope.hideloader();
    if ($error.status==404) {$scope.errorreport($error,new Error().stack,'Connection Error','Please verify you are connected to the internet',false);}
    else if ($error.status==0) {$scope.errorreport($error,new Error().stack,'Server Error','We might be performing maintenance to the server, or your internet connection may be unusable. Thank you for your patience and please check social media for planned outages',true);}
    else {$scope.errorreport($error,new Error().stack,'Error: Could Not Change Password on Server','An error report has been created on this issue',true);}
    });
 
      }else{
        
     var alertPopup = $ionicPopup.alert({
     title: 'Mismatched <b>Passwords</b>',
     subTitle: 'Your new passwords did not match. <b>Changes not saved</b>.',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });
      }
      }
    },function(){});
 
      }
    },function(){});

      }else{

     var alertPopup = $ionicPopup.alert({
     title: 'Incorrect <b>Password</b>',
     subTitle: 'That password was not correct <b>Changes not saved</b>.',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
        }
      }
    ]
   });

      }
      }
    },function(){});
};

  $scope.recpref=function(){
    if (!$localStorage.rectoggled){

Flare.start_recording(function(rez){},function(rez){});
Flare.stop_recording(function(rez){},function(rez){});

      $localStorage.rectoggled=true;
    }
  };

		$scope.multicolorselect=function(){

if (typeof myPopup !== 'undefined'){myPopup.close()}; // 

if (!$scope.global.MCdisarm){
$scope.global.color=null;
global=$scope.global;
$localStorage.global=global;
}
if($scope.global.MCdisarm){

//%&&&%&&%&%%&%&%&%&%&%&%&%&%&%&%%&%&%&%&
	 myPopup = $ionicPopup.show({
	
    template: '<button ng-click="greenselect()" class="button button-block button-balanced">Green</button><button ng-click="yellowselect()" class="button button-block button-energized">Yellow</button><button ng-click="purpleselect()" class="button button-block button-royal">Purple</button>',
    title: 'Choose a Color',
    subTitle: '<b>Do not forget your color!</b> If you select the wrong one, a silent emergency takes place and you will <b>need</b> to disarm online at <b>www.phoneflare.com</b>',
    scope: $scope

  });
}

};

$scope.greenselect=function(){myPopup.close();$scope.confirmcolor("green")};
$scope.yellowselect=function(){myPopup.close();$scope.confirmcolor("yellow")};
$scope.purpleselect=function(){myPopup.close();$scope.confirmcolor("purple")};

$scope.confirmcolor=function(col){

	var confirmPopup = $ionicPopup.confirm({
		title:'Confirm <b>Multi</b>-Disarm?',
		template: '<span style="color:black;font-size:12px"><b>Be sure to remember your color.</b> If you select incorrectly, it will appear as though the device is disarmed, but help will be on the way. You will ultimately need to disarm online at <b>www.phoneflare.com</b></span>',
		cancelText:'cancel',
		//cancelType:'button-balanced',
		okText:'<b>Yes</b>',
		okType:'button-positive'

	    });

	    confirmPopup.then(function(res) {
		if (res){
$scope.global.color=col;
global=$scope.global;
$localStorage.global=global;
		}else{$scope.global.MCdisarm=false;
global=$scope.global;
$localStorage.global=global;
		}

	    });
	 }

    })

    .controller('DisarmCtrl', function($scope, $ionicPopup, Data, User, $localStorage, alarms, $rootScope, $interval) {

$rootScope.$on("pushemer", function(){
    //$scope.$apply(function(){
        $scope.emergencycase = true;
    //});
});

$rootScope.$on("deesc", function(){
    $scope.deescalate();
});


$scope.initiate=function(){
  if($localStorage.emergency){
    emergencystate=true;
  }
  $scope.global=Data.global();
  $scope.emergencycase=emergencystate;
  $scope.fake=$scope.global.MCdisarm;

}

$scope.checkinprompt=function(){
  document.getElementById("holder").className = "animated pulse infinite";
}

$scope.disarprompt=function(){
    document.getElementById("disarholder").className = "animated pulse infinite";
  }

	$scope.green=function(){
		if ($scope.global.color == "green"){$scope.deescalate()}else{$scope.turnoff()};

	}
	$scope.purple=function(){
		if ($scope.global.color == "purple"){$scope.deescalate()}else{$scope.turnoff()};
	}
	$scope.yellow=function(){
		if ($scope.global.color == "yellow"){$scope.deescalate()}else{$scope.turnoff()};
	}

	$scope.UpgradeEmergency=function(){
		emergencystate=true;
		$scope.emergencycase=true;
	  EmergencyFire();

}

$scope.deescalate = function() {
Data.deescalate_emergency();
if(typeof EmerLoop !=='undefined'){
$interval.cancel(EmerLoop);
}

if ($localStorage.emergency){
	$scope.emeremail(0);
}

/*
 if (navigator.appVersion.indexOf("iPhone") > 0 ){
//Flare.stop_posting_location(function(){}, function(){});
}
*/

	$scope.turnoff();

	if ($localStorage.global.villages){
  	$scope.villages(false,null,null);

  		}
  //$scope.stoplocaltimers()

	}

$scope.turnoff=function(){

emergencystate=false;
$scope.emergencystate=false;
CheckInEmergency=false;
TetherEmergency=false;
DirectEmergency=false;
$localStorage.emergency=false;
$localStorage.CheckIn=false;

$scope.stopSOStorch();

Flare.stop_vibrating(function(){}, function(rez){
  if (rez!==-501){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Vibrating','An error report has been created on this issue',true);
}
});

Flare.stop_alarm(function(){},function(rez){
  if (rez!==-300){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Alarm','An error report has been created on this issue',true);
}
});


Flare.stop_timer(function(){}, function(rez){
  if (rez!==-101){
    $scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Timer','An error report has been created on this issue',true);
    }
});

//STOP audio RECORDING
Flare.stop_recording(function(){},function(rez){
  if (rez!==-401){
  $scope.errorreport(rez,new Error().stack,'Error: Could Not Stop Recording','An error report has been created on this issue',true);
}
});

$scope.settimer();
cordova.plugins.notification.local.cancelAll(function(){}, function(){});
cordova.plugins.notification.local.clearAll(function(){}, function(){});


if (navigator.appVersion.indexOf("iPhone") > 0 ){

Flare.check_locservices(function(rez){
if(!rez){
  var alertPopup = $ionicPopup.alert({
     title: 'Location <b>Services</b>',
     subTitle: 'Settings must be changed',
     template: '<span style="color:black !important">Location Services <b>must</b> be enabled and set to <b>"always"</b> for PhoneFlare to function</span>',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          cordova.plugins.settings.open(function(){}, function(){});
        }
      }
    ]
   });
}

}, function(rez){$scope.errorreport(rez,new Error().stack,'Error: Could Not Check Location Services','An error report has been created on this issue',true);});

}
				$scope.back();

	}
    });
