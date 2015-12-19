(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $scope, $timeout, webDevTec, toastr, $location, $log, _, moment, $data ) {
    var vm = this;
    var monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ];

    
    $rootScope.user = $rootScope.user || {
        loaded: false
    };
    

    $rootScope.user.username = $rootScope.user.username || 'guest';
    $rootScope.user.is_authenticated = $rootScope.user.is_authenticated || false;
        

    $rootScope.go_home_page = function() {
        $location.path('/');
    };

    $rootScope.go_login = function() {
        $location.path('/login/');
    };

    if (!$rootScope.user || !$rootScope.user.is_authenticated) {
        //$rootScope.go_login();
    }

    // для подствеки меню выборо компани по статусу
    // варианты: lasted, active, blocked, all, deleted
    vm.menu_status = 'lasted';

    vm.datePicker = {
        options: {
            locale: {
                format: 'DD.MM.YYYY',
                "applyLabel": "Выбрать",
                "cancelLabel": "Отмена",
                "fromLabel": "От",
                "toLabel": "До",
                "daysOfWeek": [
                    "Вт",
                    "Пн",
                    "Вт",
                    "Ср",
                    "Чт",
                    "Пт",
                    "Сб"
                ],
                "monthNames": monthNames,
                "firstDay": 1
            },
            eventHandlers: {
                'apply.daterangepicker': function(ev) {
                    // выбор иннервала дат
                    
                    if (ev.model && ev.model.startDate && ev.model.endDate) {
                        vm.startDate = ev.model.startDate.toDate();
                        vm.endDate = ev.model.endDate.toDate();
                        
                        getDateRangeStatistic();
                        // запуск запроса в соотвествие с выбранной данной
                    }
                }
            }
        }
    };
    vm.datePicker.date = {};
    // списки компаний и статистики
    vm.campaigns = [];
    vm.statistic = [];
    // количество последних компаний
    vm.number_lasted = 3;

    // количество всего компаний
    vm.number_campaigns = 0; 

    // Даты для интервала выбора дат
    vm.startDate = null;
    vm.endDate = null;

    // для подсчета суммарной статистики
    vm.sumStatistic = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        costs: 0,
        revenue: 0,
        income: 0
    };

    // поля и направление сортировки
    vm.sort_fields = [];
    
    var now = moment();
    vm.past_month = monthNames[now.month() - 1].toLowerCase();
    vm.current_month = monthNames[now.month()].toLowerCase();
    
    function reset() {

        vm.sort_fields = [];
        vm.sumStatistic = {
            shows: 0,
            clicks: 0,
            conversions: 0,
            costs: 0,
            revenue: 0,
            income: 0
        };
    }

    vm.getStatAll = function(callback) {
        reset();
        get_campaigns(function(data) {

            vm.campaigns = data;

            if (data.length > 0) {
                // готовим даты для отображения
                vm.datePicker.date.startDate = moment(data[0].last_updated, "DD.MM.YYYY").toDate();
                vm.startDate = moment(data[0].last_updated, "DD.MM.YYYY").toDate();
                vm.datePicker.date.endDate = moment(data[data.length - 1].last_updated, "DD.MM.YYYY").toDate();
                vm.endDate = moment(data[data.length - 1].last_updated, "DD.MM.YYYY").toDate();
                // считаем количество компаний по разным статусам;
                vm.number_blocked = 0;
                vm.number_active = 0;
                vm.number_deleted = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status == 'active') {
                        vm.number_active += 1;
                    }
                    if (data[i].status == 'deleted') {
                        vm.number_deleted += 1;
                    }
                    if (data[i].status == 'blocked') {
                        vm.number_blocked += 1;
                    }
                }
                get_statistic(data, function() {
                    vm.menu_status = 'all';
                    if (callback) {
                        callback();
                    }
                });

            }
        });
    };

    
    vm.getStatLasted = function() {
        /*
        получение статистики по последним компаниям
        */
        reset();
        //get_campaigns(function(data) {
        //    vm.campaigns = data;
            var count = vm.campaigns.length;
            // если количество последних компаний меньше чем количество всех компаний
            // запрашиваем послений иначе запрашиваем все
            if (vm.number_lasted < count) {
                
                var _last_compaigns = [];
                for (var i = 1; i <= vm.number_lasted; i++) {
                    _last_compaigns.push(vm.campaigns[vm.campaigns.length - i]);
                }
                get_statistic(_last_compaigns, function() {
                    vm.menu_status = 'lasted';
                });
            } else {
                vm.getStatAll(function() {
                     vm.menu_status = 'all';
                });
            }
        //});
    };

    /*
    получений компаний по статусу
    */
    vm.getStatByStatus = function(status) {
        reset();
        var _data = [];

        get_campaigns_bystatus(status, function(data) {
            vm.campaigns = data;
            /*
            for (var i = 0; i < vm.campaigns.length; i++) {
                if (vm.campaigns[i].status == status) {
                    _data.push(vm.campaigns[i]);
                }
            }
            */
            // запрашиваем статистику по запрошенным компаниям
            get_statistic(data, function() {
                vm.menu_status = status;
            });
        });
    };

    vm.getCampaignsByStatus = function(status) {
        reset();
        get_campaigns(function(data) {
            vm.campaigns = data;
            var _campaigns = [];
            if (status == 'today') {
                vm.menu_status = 'today';
                for (var i = 0; i < vm.campaigns.length; i++) {
                    if (vm.campaigns[i].last_updated == moment().format('DD.MM.YYYY')) {
                        _campaigns.push(vm.campaigns[i]);
                    }
                }
                vm.campaigns = _campaigns;
            }
            if (status == 'yesterday') {
                vm.menu_status = 'yesterday';
                for (var i1 = 0; i1 < vm.campaigns.length; i1++) {
                    if (vm.campaigns[i1].last_updated == moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).millisecond(0).format('DD.MM.YYYY')) {
                        _campaigns.push(vm.campaigns[i1]);
                    }
                }
            }

            if (status == 'week') {
                vm.menu_status = 'week';
                var from = moment().day("Monday").hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                var to = moment().day("Monday").add(6, 'days').hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                for (var i2 = 0; i2 < vm.campaigns.length; i2++) {
                    var _d = moment(vm.campaigns[i2].last_updated, 'DD.MM.YYYY').toDate();
                    if (_d >= from && _d <= to) {
                        _campaigns.push(vm.campaigns[i2]);
                    }
                }
            }

            if (status == 'current_month') {
                vm.menu_status = 'current_month';
                var from1 = moment().date(1).hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                var to1 = moment().endOf("month").hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                for (var i3 = 0; i3 < vm.campaigns.length; i3++) {
                    var _d1 = moment(vm.campaigns[i3].last_updated, 'DD.MM.YYYY').hours(0).minutes(0).seconds(0).toDate();
                    if (_d1 >= from1 && _d1 <= to1) {
                        _campaigns.push(vm.campaigns[i3]);
                    }
                }
            }

            if (status == 'past_month') {
                vm.menu_status = 'past_month';
                var from2 = moment().subtract(1, 'month').date(1).hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                var to2 = moment().endOf("month").hours(0).minutes(0).seconds(0).millisecond(0).toDate();
                for (var i4 = 0; i4 < vm.campaigns.length; i4++) {
                    var _d2 = moment(vm.campaigns[i4].last_updated, 'DD.MM.YYYY').toDate();
                    if (_d2 >= from2 && _d2 <= to2) {
                        _campaigns.push(vm.campaigns[i4]);
                    }
                }
               
            }
            vm.campaigns = _campaigns;

            $timeout(function() {
                vm.campaigns = _campaigns;
                get_statistic(vm.campaigns);
            });
        });

    };


    vm.sortStatistic = function(field) {
        /*
        сортировка статистики
        */
        if (field == 'impressions') {
            var index_shows = _.findIndex(vm.sort_fields, {'field': 'total.impressions'});
            if (index_shows > -1) {
                vm.sort_fields[index_shows].order = !vm.sort_fields[index_shows].order;
            } else {
                vm.sort_fields.push({'field': 'total.impressions', 'order': true});
            }
        }
        if (field == 'clicks') {
            var index_clicks = _.findIndex(vm.sort_fields, {'field': 'total.clicks'});
            if (index_clicks > -1) {
                vm.sort_fields[index_clicks].order = !vm.sort_fields[index_clicks].order;
            } else {
                vm.sort_fields.push({'field': 'total.clicks', 'order': true});
            }
        }
        if (field == 'conversions') {
            var index_conversions = _.findIndex(vm.sort_fields, {'field': 'total.conversions'});
            if (index_conversions > -1) {
                vm.sort_fields[index_conversions].order = !vm.sort_fields[index_conversions].order;
            } else {
                vm.sort_fields.push({'field': 'total.conversions', 'order': true});
            }
        }
        if (field == 'costs') {
            var index_costs = _.findIndex(vm.sort_fields, {'field': 'total.costs'});
            if (index_costs > -1) {
                vm.sort_fields[index_costs].order = !vm.sort_fields[index_costs].order;
            } else {
                vm.sort_fields.push({'field': 'total.costs', 'order': true});
            }
        }
        if (field == 'revenue') {
            var index_revenue = _.findIndex(vm.sort_fields, {'field': 'total.revenue'});
            if (index_revenue > -1) {
                vm.sort_fields[index_revenue].order = !vm.sort_fields[index_revenue].order;
            } else {
                vm.sort_fields.push({'field': 'total.revenue', 'order': true});
            }
        }
        if (field == 'income') {
            var index_income = _.findIndex(vm.sort_fields, {'field': 'total.income'});
            if (index_income > -1) {
                vm.sort_fields[index_income].order = !vm.sort_fields[index_income].order;
            } else {
                vm.sort_fields.push({'field': 'total.income', 'order': true});
            }
        }




        var fields = [];
        var order = [];
        _.each(vm.sort_fields, function(obj){
            fields.push(obj.field);
            if (obj.order === true) {
                order.push('asc');
            } else {
                order.push('desc');
            }
        });
        vm.statistic = _.sortByOrder(vm.statistic, fields, order);
    };



    vm.getSortNumber = function(type) {
        /*
        отображение номера последовательности сортировки
        */
        var index_income;
        if (type == 'impressions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.impressions'});
        }
        if (type == 'clicks') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.clicks'});
        }
        if (type == 'conversions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.conversions'});
        }
        if (type == 'costs') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.costs'});
        }
        if (type == 'revenue') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.revenue'});
        }
        if (type == 'income') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.income'});
        }
        if (index_income > -1) {
            return index_income + 1;
        }

    };

    vm.getSortNumberOrder = function(type) {
        /*
        отображение порядка сортировки
        */
        var order, index_income;
        if (type == 'impressions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.impressions'});
        }
        if (type == 'clicks') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.clicks'});
        }
        if (type == 'conversions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.conversions'});
        }
        if (type == 'costs') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.costs'});
        }
        if (type == 'revenue') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.revenue'});
        }
        if (type == 'income') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.income'});
        }
        if (index_income > -1) {
            order = vm.sort_fields[index_income].order;
            if (order === true) {
                return 'asc';
            } else {
                return 'desc';
            }
        }
    };

    vm.deleteSort = function(type) {
        /*
        удаляем тип сортировки
        */
        var index_income;
        if (type == 'impressions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.impressions'});
        }
        if (type == 'clicks') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.clicks'});
        }
        if (type == 'conversions') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.conversions'});
        }
        if (type == 'costs') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.costs'});
        }
        if (type == 'revenue') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.revenue'});
        }
        if (type == 'income') {
            index_income = _.findIndex(vm.sort_fields, {'field': 'total.income'});
        }
        if (index_income > -1) {
            vm.sort_fields.splice(index_income, 1);
            vm.sortStatistic();
        }
    };

    function get_campaigns(callback) {
        reset();

        $data.get_campaigns(null, function(data) {
            vm.campaigns = data;
            vm.number_campaigns = vm.campaigns.length;

            callback(data);
        });
    }
    function get_campaigns_bystatus(status, callback) {
        reset();
        var params = {
            status: status
        };
        $data.get_campaigns(params, function(data) {
            vm.campaigns = data;
            //vm.number_campaigns = vm.campaigns.length;

            callback(data);
        });
    }


    function get_stat_data(id, data) {
        for (var i = 0,len = data.length; i < len; i++) {
            if (data[i].id == id) {

                return  data[i];
            }
        }
    }
    function get_statistic(campaigns, callback) {
        // формируем запрос по расширенной статистики
        // data - компании
        var _ids = [];
        for (var i = 0; i < campaigns.length; i++) {
            _ids.push(campaigns[i].id);
        }
        

        if (campaigns.length > 0) {
            for (var j = 0; j < campaigns.length; j++) {
                campaigns[j].datetime = moment(campaigns[j].last_updated)
            }
            campaigns = _.sortBy(campaigns, function(item) {
                return item.datetime;
            });
            console.log('campaigns', campaigns)
            var data_param = {
                ids: _ids,
                startDate: moment(campaigns[0].last_updated).format("YYYY-MM-DD"),
                endDate: moment(campaigns[campaigns.length - 1].last_updated).format("YYYY-MM-DD")
            };
            $data.get_stats(data_param, function(_data) {
                for (var i = 0, len = campaigns.length; i < len; i++) {
                    campaigns[i].total = get_stat_data(campaigns[i].id, _data);
                }

                vm.statistic = campaigns;
                if (callback) {
                    callback();
                }
                calculateSumStatistic();
                
            });

        } else {
            vm.statistic = [];
            calculateSumStatistic();
        }
    }

    
    function calculateSumStatistic() {
        // Считаем суммарной статистику
        vm.sumStatistic = {
            total: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                costs: 0,
                revenue: 0,
                income: 0
            }
        };

        for (var i = 0; i < vm.statistic.length; i++) {
            if (vm.statistic[i].total && vm.statistic[i].total.clicks) {
                vm.sumStatistic.total.clicks += parseFloat(vm.statistic[i].total.clicks);
            }
            if (vm.statistic[i].total && vm.statistic[i].total.impressions) {
                vm.sumStatistic.total.impressions += parseFloat(vm.statistic[i].total.impressions);
            }
            if (vm.statistic[i].total && vm.statistic[i].total.conversions) {
                vm.sumStatistic.total.conversions += parseFloat(vm.statistic[i].total.conversions);
            }
            if (vm.statistic[i].total && vm.statistic[i].total.costs) {
                vm.sumStatistic.total.costs += parseFloat(vm.statistic[i].total.costs);
            }
            if (vm.statistic[i].total && vm.statistic[i].total.revenue) {
                vm.sumStatistic.total.revenue += parseFloat(vm.statistic[i].total.revenue);
            }
            if (vm.statistic[i].total && vm.statistic[i].total.income) {
                vm.sumStatistic.total.income += parseFloat(vm.statistic[i].total.income);
            }
            
        }
        
    }

    function getDateRangeStatistic() {
        var _compaigns = [];

        for (var i = 0; i < vm.campaigns.length; i++) {
            if (moment(vm.campaigns[i].last_updated, "DD.MM.YYYY").toDate() >= vm.startDate &&
                moment(vm.campaigns[i].last_updated, "DD.MM.YYYY").toDate() <= vm.endDate) {

                _compaigns.push(vm.campaigns[i]);
            }
        }

        $timeout(function() {
            vm.campaigns = _compaigns;
            get_statistic(vm.campaigns);
        });
    }



    // Начало
    vm.getStatAll(function() {
        vm.getStatLasted();
    });
  }
})();
