var key = "eb771b4e-dfa1-4e6f-a039-226552a84b6e";
angular.module('ChampApp')

.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('outside.findteam');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: '',
    role:''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

.controller('TeamCtrl', function($scope, AuthService, API_ENDPOINT, $http, $ionicPopup, $state) {
  $scope.team = {
    name: ''
  };
  $http.get(API_ENDPOINT.url + '/findteams').then(function(result) {
      $scope.Tdata = result.data;
      console.log($scope.Tdata);
    });
  /// adds team to db
  $scope.addTeam = function() {
    AuthService.addTeam($scope.team).then(function() {
      $state.go('inside');

      var alertPopup = $ionicPopup.alert({
        title: 'Team successfully added!'
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Failed to add team!',
        template: errMsg
      });
    });console.log($scope.team);
  };
})
///////////////////////HUB CONTROLLERs////////////////////////////
.controller('HubCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    $http.get(API_ENDPOINT.url + '/userinfo').then(function(result) {
      // $scope.memberinfo = result.data.msg;
      $scope.data = result.data;
      console.log($scope.data);
    });
    $http.get(API_ENDPOINT.url + '/findteams').then(function(result) {
      $scope.Tdata = result.data;
      console.log($scope.Tdata);
    });
    $scope.key = {
      key:''
    };
  $http.get(API_ENDPOINT.url + '/getkey').then(function(result) {
      $scope.Keydata = result.data;
      $scope.Keydata[0].key = key;
      console.log(key);
    });

  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('ListController',['$scope','$http', 'AuthService', 'API_ENDPOINT','$stateParams', '$ionicLoading' ,function($scope,$http, AuthService, API_ENDPOINT, $stateParams, $ionicLoading){
  $http.get(API_ENDPOINT.url + '/getkey').then(function(result) {
      $scope.Keydata = result.data;
      // console.log($scope.Keydata[0].key);
    });
      $http.get(API_ENDPOINT.url + '/champions').then(function(result) {
      $scope.data = result.data.data;
      // console.log($scope.data.Aatrox);
    });

//   $scope.loadChamp = function(){
//     $scope.clearSearch = function() {
//     $scope.search = '';
//     };
//     $ionicLoading.show();
//     $http.get("https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags,image&api_key="+key)
//             // $http.get("https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell?api_key="+key)])
//     .success(function(response){
//   // console.log(response);
//     $scope.data = response.data;
//     $ionicLoading.hide();
//     })
// .finally(function(){
//   $scope.$broadcast('scroll.refreshComplete');

// });
// };
  // $scope.loadChamp();
}]);

ChampApp.controller('DetailsController',['$scope','$http', 'AuthService', 'API_ENDPOINT','$stateParams', '$ionicLoading' ,function($scope,$http, AuthService, API_ENDPOINT, $stateParams, $ionicLoading)
{
  $ionicLoading.show();
    //  $http.get(API_ENDPOINT.url + '/champions/:id').then(function(result) {
    //   $scope.data = result.data;
    // });

   $ionicLoading.hide();

   $http.post('/championDetails', {
    msg: $scope.championId,
   })
   .success(function(response){
    $scope.data = response;
    console.log(response);
    console.log($scope.data);
   })
 
   

}]);

ChampApp.controller('SkinsController',['$scope','$http', '$stateParams', '$ionicLoading' ,function($scope,$http, $stateParams, $ionicLoading)
{
  var url="https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/"+$stateParams.itemId+"?champData=skins&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e";

  $ionicLoading.show();console.log(url);
  $http.get(url)
  
  .success(function(response){
    $scope.data = response;
    console.log(response);
    // $scope.name = response.data[$stateParams.itemId].name;
    // $scope.name = response[$stateParams.itemId].name;
    // $ionicLoading.hide();
    $scope.name = response.name;
    $ionicLoading.hide();
  });
}])

.controller('PlayerController',['$scope','$http', 'AuthService', 'API_ENDPOINT','$stateParams', '$ionicLoading' ,function($scope,$http, AuthService, API_ENDPOINT, $stateParams, $ionicLoading)
{
  $http.get(API_ENDPOINT.url + '/userinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $scope.Pdata = result.data;
      console.log($scope.Pdata);
    });
  $http.get('champion.json')
  .success(function(response){
    $scope.Cdata = response; 
    console.log($scope.Cdata.data['25'].key);
  });
    $http.get(API_ENDPOINT.url + '/getkey').then(function(result) {
      $scope.Keydata = result.data;
      console.log($scope.Keydata[0].key);
    });
  // $http.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/LemonBeard?api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e')
  // .success(function(response){
  //   $scope.Pdata = response; 
  //   console.log($scope.Cdata.data['25'].key);
  // });
  //DAVID
  var url="https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/59971/ranked?season=SEASON2016&api_key"+key
  $http.get(url)
    .success(function(response){
    $scope.data = response;  
  });
  // PETER
   // $http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/212967/ranked?season=SEASON2016&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e')
  // .success(function(response){
  //   $scope.Maradoc = response; 
  //   console.log($scope.Maradoc);
  // });
  // Carrie
   // $http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/30532112/ranked?season=SEASON2016&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e')
  // .success(function(response){
  //   $scope.carzie = response; 
  // });
   // Griz
   // $http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/22661749/ranked?season=SEASON2016&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e')
  // .success(function(response){
  //   $scope.griz = response; 
  // });
     // Dyrus
   // $http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/5908/ranked?season=SEASON2016&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e')
  // .success(function(response){
  //   $scope.dyrus = response; 
  // });

}])

.controller('MHController',['$scope','$http', '$stateParams',function($scope,$http, $stateParams)
{
  var url="https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/59971?rankedQueues=TEAM_BUILDER_DRAFT_RANKED_5x5&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e"
  $http.get('champion.json')
  .success(function(response){
    $scope.Cdata = response;
    });

  $http.get(url)
  .success(function(response){
    $scope.data = response;
    console.log($scope.data.matches[0].champion);
  });

  $http.get("https://na.api.pvp.net/api/lol/na/v2.2/match/2154179349?api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e")
  .success(function(response){
    $scope.data = response;
    
  });
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
}])

.controller('TCController',['$scope','$http', '$stateParams', '$ionicLoading' ,function($scope,$http, $stateParams, $ionicLoading)
{
  // var url="https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/59971?rankedQueues=TEAM_BUILDER_DRAFT_RANKED_5x5&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e"
  $ionicLoading.show();
  $http.get('champion.json')
  .success(function(response){
    $scope.Cdata = response; 
  });
    $ionicLoading.hide();
  // );
}])

.controller('MapController', function($scope) {
    var canvas = document.getElementById('signatureCanvas');
    var signaturePad = new SignaturePad(canvas,{
    minWidth: 0.8,
    maxWidth: 0.8,
    penColor: "white"
});
 
    $scope.clearCanvas = function() {
        signaturePad.clear();
    }
 
    $scope.saveCanvas = function() {
        signaturePad.toDataURL();
    }

    $scope.makeRed = function() {
        signaturePad.penColor="red";
    }
    $scope.makeBlue = function() {
        signaturePad.penColor="blue";
    }
    $scope.makeGreen = function() {
        signaturePad.penColor="green";
    }
     $scope.makeWhite = function() {
        signaturePad.penColor="white";
    }
});

ChampApp.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});

