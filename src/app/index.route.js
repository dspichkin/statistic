(function() {
  'use strict';

  angular
    .module('statistic')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
            url: "/",
            templateUrl: "app/main/main.html",
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('login', {
            url: "/login/",
            templateUrl: "app/main/login.html",
            controller: 'LoginController',
            controllerAs: 'login'
        });

    $urlRouterProvider.otherwise('/');
    /*
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
       return {
           'request': function (config) {
               config.headers = config.headers || {};
               if ($localStorage.token) {
                   config.headers.Authorization = 'Bearer ' + $localStorage.token;
               }
               return config;
           },
           'responseError': function (response) {
               if (response.status === 401 || response.status === 403) {
                   $location.path('/login/');
               }
               return $q.reject(response);
           }
       };
    }]);
    */

  }

})();
