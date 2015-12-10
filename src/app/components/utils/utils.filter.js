(function() {
  'use strict';

  angular
    .module('app')
    .filter('numberWithCommas', numberWithCommas);
  
  function numberWithCommas() {
    return function (text) {
      if (text && angular.isNumber(text)) {
        return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      return text;
    };
  }

})();
        