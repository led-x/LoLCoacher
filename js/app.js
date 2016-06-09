var ChampApp = angular.module('ChampApp', ['ionic','ui.router'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

ChampApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('outside.findteam', {
  url: '/findteam',
  templateUrl: 'templates/findteam.html',
  controller: 'TeamCtrl'
  })
  .state('outside.create', {
  url: '/create',
  templateUrl: 'templates/create.html',
  controller: 'TeamCtrl'
  })
    .state('list',{
    url:'/list',
    controller: 'ListController',
    templateUrl: 'templates/list.html'
  })
   .state('hub',{
    //:playerId or use id will need to be passed here
    url:'/hub',
    controller: 'HubCtrl',
    templateUrl: 'templates/inside.html'
  })
  .state('players',{
    //:playerId or use id will need to be passed here
    url:'/players',
    controller: 'PlayerController',
    templateUrl: 'templates/players.html'
  })
  .state('matchhistory',{
    //:playerId or use id will need to be passed here
    url:'/matchhistory',
    controller: 'MHController',
    templateUrl: 'templates/matchhistory.html'
  })
  .state('teamcomp',{
    //:playerId or use id will need to be passed here
    url:'/teamcomp',
    controller: 'TCController',
    templateUrl: 'templates/teamcomp.html'
  })
  .state('map',{
    //:playerId or use id will need to be passed here
    url:'/map',
    controller: 'MapController',
    templateUrl: 'templates/map.html'
  })
.state('details',{
    url:'/details/:itemId',
    controller: 'DetailsController',
    templateUrl: 'templates/details.html'
  })
 .state('skins',{
    url:'/skins/:itemId',
    controller: 'SkinsController',
    templateUrl: 'templates/skins.html'
  });

  $urlRouterProvider.otherwise('/outside/login');
})

ChampApp.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
