(function() {
  'use strict';

  angular
    .module('app')
    .factory('$data', data);
  
  function data() {     
    var _campaigns = function(callback) {
        /* getting campaigns
        url: /api/campaigns
            [{
            'id': ..    
            'name': ...
            'status': ...,  # active, deleted, blocked
            'datetime': ...,  # когда создан
            }]
        */
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
        callback(_data);
    };

    var _get_stats = function(param, callback) {
        /*
            param = {
                ids: _ids,
                startDate: _start_data_string,
                endDate: _end_data_string
            };
            111;222/01.11.2015-02.11.2015
        */
        var data = [
            {
                object: {
                    id: 5501,
                    name: 'deleted Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'blocked'
                },
                total: {
                    shows: 1127,
                    clicks: 290,
                    conversions: 15,
                    costs: "110.00",
                    revenue: "201.00"
                },
                detailed: [
                    {
                        date: '01.01.2014',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '01.02.2014',
                        shows: 100,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }, {
                object: {
                    id: 5601,
                    name: 'blocked Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'blocked'
                },
                total: {
                    shows: 1032,
                    clicks: 19,
                    conversions: 12,
                    costs: "104.00",
                    revenue: "203.00"
                },
                detailed: [
                    {
                        date: '01.10.2014',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '08.12.2014',
                        shows: 100,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }, {
                object: {
                    id: 5696,
                    name: 'Интресы - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'active'
                },
                total: {
                    shows: 450,
                    clicks: 60,
                    conversions: 9,
                    costs: "103.00",
                    revenue: "207.00"
                },
                detailed: [
                    {
                        date: '01.01.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '08.02.2015',
                        shows: 100,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }, {
                object: {
                    id: 5693,
                    name: 'Dota и LOL VK.Storm Fall:Rise of blue - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'active'
                },
                total: {
                    shows: 1020,
                    clicks: 101,
                    conversions: 9,
                    costs: "105.00",
                    revenue: "220.00"
                },
                detailed: [
                    {
                        date: '01.5.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '02.5.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '05.5.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }, {
                object: {
                    id: 5695,
                    name: 'mmorg вся Россия - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'active'
                },
                total: {
                    shows: 1000,
                    clicks: 131,
                    conversions: 9,
                    costs: "170.00",
                    revenue: "300.00"
                },
                detailed: [
                    {
                        date: '15.11.2015',
                        shows: 100,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '18.11.2015',
                        shows: 400,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '20.11.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }, {
                object: {
                    id: 5697,
                    name: 'США, Канада, Великобретания mmorg вся Россия - Игры вся Россия и Украина. Storm b tot rffdsdf',
                    status: 'active'
                },
                total: {
                    shows: 1000343,
                    clicks: 110,
                    conversions: 6,
                    costs: "700.00",
                    revenue: "20.00"
                },
                detailed: [
                    {
                        date: '1.12.2015',
                        shows: 100,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '2.12.2015',
                        shows: 400,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }, {
                        date: '3.12.2015',
                        shows: 500,
                        clicks: 50,
                        conversions: 3,
                        costs: "50.00",
                        revenue: "100.00"
                    }
                ]
            }
        ];

        for (var i = 0; i < data.length; i++) {
            data[i].total.income = parseFloat(data[i].total.revenue) - parseFloat(data[i].total.costs);
        }


        // готовим данный для отображение
        var _ids_data = [];
        if (param.ids.length > 0) {
            // берем тольк id из ids
            for (var i1 = 0; i1 < param.ids.length; i1++) {
                for (var j = 0; j < data.length; j++) {
                    if (param.ids[i1] == data[j].object.id) {
                        _ids_data.push(data[j]);
                    }
                }
            }
        } else {
            _ids_data = data;
        }
        // из полученных собираем только тех которые попадают в указанный промежуток времени

        callback(_ids_data);
    };

    
    return {
        get_campaigns: function(callback) {
            _campaigns(callback);
        },
        get_stats: function(param, callback) {
            _get_stats(param, callback);
        }
    };
  }

})();
        