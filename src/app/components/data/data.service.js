(function() {
  'use strict';

  angular
    .module('statistic')
    .factory('$data', data);
  
  function data($http, $log, config) {     
    var _campaigns = function(params, callback) {
        var url = config.url_campaigns;
        if (params) {
            var url_parms = Object.keys(params).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            }).join('&');
            url = config.url_campaigns + '?' + url_parms;
        }

        $http.get(url).success(function(data) {
            //console.log(data)
            callback(data);
            }).error(function(data) {
           $log.error("Ошиба получения campaigns", data);
           alert("Ошиба получения списка компаний");
        });
    };

    var _get_stats = function(params, callback) {
        /*
            param = {
                ids: _ids,
                startDate: _start_data_string,
                endDate: _end_data_string
            };
            111;222/01.11.2015-02.11.2015
        */
        
        var url = config.url_stat;
        var _ids;
        
        if (params) {
            if (params.ids) {
                _ids = params.ids.join();
            }
            url = config.url_stat + _ids + '/?date_from=' + params.startDate + '&date_to=' + params.endDate;
        }


        $http.get(url).success(function(data) {
             for (var i = 0; i < data.length; i++) {
                data[i].income = parseFloat(data[i].revenue) - parseFloat(data[i].costs);
            }

            callback(data);
                }).error(function(data) {
               $log.error("Ошиба получения campaigns", data);
               alert("Ошиба получения списка компаний");
        });

       
    };

    
    return {
        get_campaigns: function(params, callback) {
            _campaigns(params, callback);
        },
        get_stats: function(params, callback) {
            _get_stats(params, callback);
        }
    };
  }

})();
        