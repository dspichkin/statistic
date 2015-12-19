/* global malarkey:false, moment:false, _:false */
(function() {
  'use strict';
  angular
    .module('app')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('_', _)
    .constant('config', {
    	'url_campaigns': 'http://api.tmbuyer.is.everyads.com/api/campaigns/',
    	'url_stat': 'http://api.tmbuyer.is.everyads.com/api/stats/campaigns/'
    });

})();
