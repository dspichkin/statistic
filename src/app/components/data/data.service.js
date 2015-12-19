(function() {
  'use strict';

  angular
    .module('app')
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

        $http.get(url).success(function(data, status) {
            //console.log(data)
            callback(data);
            }).error(function(data, status) {
           $log.error("Ошиба получения campaigns", data);
           alert("Ошиба получения списка компаний");
        });
        /* getting campaigns
        url: /api/campaigns
            [{
            'id': ..    
            'name': ...
            'status': ...,  # active, deleted, blocked
            'datetime': ...,  # когда создан
            }]
        */
        /*
        var _data = [
            {
                'id': 5501,        
                'name': 'deleted Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'deleted',  
                'datetime': '01.01.2014'
            }, {
                'id': 5601,        
                'name': 'blocked Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'blocked',  
                'datetime': '01.10.2014'
            },  {
                'id': 5696,        
                'name': 'Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'active',  
                'datetime': '01.01.2015'
            }, {
                'id': 5693,        
                'name': 'Dota и LOL VK.Storm Fall:Rise of blue - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'active',  
                'datetime': '01.5.2015'
            }, {
                'id': 5695,        
                'name': 'mmorg вся Россия - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'active',  
                'datetime': '15.11.2015'
            }, {
                'id': 5697,        
                'name': 'США, Канада, Великобретания mmorg вся Россия - Игры вся Россия и Украина. Storm b tot rffdsdf',
                'status': 'active',  
                'datetime': '1.12.2015'
            }
        ];
        */
        //callback(_data);
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


        $http.get(url).success(function(data, status) {
             for (var i = 0; i < data.length; i++) {
                data[i].income = parseFloat(data[i].revenue) - parseFloat(data[i].costs);
            }

            callback(data);
                }).error(function(data, status) {
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
        