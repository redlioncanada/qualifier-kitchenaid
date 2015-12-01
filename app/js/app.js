//'use strict';

var nglibs = [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ngTouch',
  'pasvaz.bindonce',
  'LocalStorageModule',
  'ui.bootstrap',
  'ui.sortable',
  'angularAwesomeSlider',
  'ngAnimate',
  'AppstateService',
  'djds4rce.angular-socialshare',
  'ApplianceDataDecoratorService',
  'TestsService'
];

var App = angular.module('App', nglibs);
App.constant('Modernizr', Modernizr);

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
    $locationProvider.html5Mode(false);
    //$urlRouterProvider.otherwise("/");
    localStorageServiceProvider.setPrefix("KitchenaidQualifier_");

    $stateProvider
      .state('loading', {
        templateUrl: 'views/loading.html',
        controller: 'LoadingCtrl'
      }) 
      .state('print', {
        templateUrl: 'views/print.html',
        url : "/print/:sku&:color",
        controller: 'PrintCtrl'
      }) 
      .state('main', {
        templateUrl: 'views/main.html'
      }) 
      .state('main.questions', {
        url : "/questions/:questionName",
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl'
      })
      .state('main.results', {
        url : "/results",
        templateUrl: 'views/results.html',
        controller: 'ResultsCtrl'
      });

  }]);

App.directive('resize', function($rootScope, $window) {
  return {
    link: function() {
      angular.element($window).on('resize', function(e) {
        // Namespacing events with name of directive + event to avoid collisions
        $rootScope.$broadcast('resize::resize');
      });
    }
  }
});

App.filter('orderByOrder', function() {
  return function(items) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered[parseInt(item.order)] = item;
    });
    return filtered;
  };
});

App.filter('rearrange', function() {
  return function(items, num) {
      if (typeof items === 'undefined') return;
      var temp = items[0];
      items[0] = items[1];
      items[1] = temp;     

      if (parseFloat(items[0].colours[items[0].colours.length-1].prices.CAD) > parseFloat(items[2].colours[items[2].colours.length-1].prices.CAD)) {
        temp = items[0];
        items[0] = items[2];
        items[2] = temp;
      }
      return items;
  };
});

App.filter('after', function() {
  return function(items, num) {  
      items.splice(0,num)
      return items
  };
});

App.filter('assignScore', function($rootScope) {
  return function(items, appliance) {
      angular.forEach(items, function(item) {
        if (item.featureKey in appliance) {
          if (!!appliance[item.featureKey]) {
            if (item.featureKey in $rootScope.questionsData.currentScore && !!$rootScope.questionsData.currentScore[item.featureKey]) {
              item.score = $rootScope.questionsData.currentScore[item.featureKey] + 3;
            } else {
              item.score = 2;
            }
          } else if (!!item.top3) {
            item.score = 1;
          }
        } else if (!!item.top3) {
          item.score = 1;
        } else {
          item.score = 0;
        }
      });          
      //console.log(items);
      return items;
  };
});

App.filter('nextQuestions', function($rootScope, $filter) {
  return function(items) {
    var getNext = function (q) {
      var r = false
      angular.forEach(q.text[0].answers, function (item, k) {
        if ('next' in item && item.answer == true) {
          r = item
        }
      })
      return r
    }
    var nextQuestions = []
    var t = null
    var l = !$rootScope.questionsData ? 0 : $rootScope.objSize($rootScope.questionsData.scoringQuestions);
    if (l) {
      angular.forEach($rootScope.questionsData.scoringQuestions, function (item, k) {
        if (item.order == l) {
          t = item
        }
      })
    }
    while (!!t) {
      var nn = null
      if ('next' in t) {
        nn = t.next
      } 
      else if (!!getNext(t)) {
        nn = getNext(t).next
      } 
      else {
        t = null
      }
      if (!!t) {
        nextQuestions.push($rootScope.questionsData.questions[nn])          
        t = $rootScope.questionsData.questions[nn]
      }
    }
    return nextQuestions

  };
});

App.filter('byPrice', function($rootScope) {
  return function(items, price) {
    var inside = [];
    var outside = [];
    if (typeof price === 'undefined') return;
    var range = price.split(";")
    range[0] = parseFloat(range[0])
    range[1] = parseFloat(range[1])    

    angular.forEach(items, function(appliance) {
        var ins = false
        angular.forEach(appliance.colours, function(colour) {
           var p = parseFloat(colour.prices.CAD)
           if (p >= range[0] && p <= range[1] && ins == false) {
            inside.push(appliance)
            ins = true
            if (!!('picker' in appliance)) {
              if (appliance.picker.prices.CAD < range[0] && appliance.picker.prices.CAD > range[1]) {
                appliance.picker=colour;
              }
            }
           }
        });        
        if (ins == false) {
          outside.push(appliance)
        }
    });
    if (inside.length < 3) {
        if (range[1] + $rootScope.resultsOptions.step <= $rootScope.resultsOptions.to) {
          range[1] += $rootScope.resultsOptions.fakestep
        } else {
          range[0] -= $rootScope.resultsOptions.fakestep
        }
        $rootScope.controls.price = range.join(";")
    }
    $rootScope.safeApply();
    return inside.concat(outside);
  };
});

// New byPrice works by re-ranking the results, prices within the range are ranked, then prices without

App.run(['$rootScope', '$state', "$resource", 'localStorageService', 'Modernizr', '$location', '$appstate', '$dataDecorator', '$tests', '$FB', function ($rootScope, $state, $resource, localStorageService, Modernizr, $location, $appstate, $dataDecorator, $tests, $FB) {
    $location.path('');
    $FB.init('919321591436851');
    $state.go('loading');

    $rootScope.resultsTouched = false;

    $rootScope.atResultsPage = false;
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.atResultsPage = toState.name.indexOf('results') != -1;
    });

    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $rootScope.objSizeClean = function (obj) {
      for (var i in obj) {
        if (!obj[i]) {
          obj.splice(i,1);
        }
      }
      if (!!obj) {
        return Object.keys(obj).length;
      } else {
        return 0;
      }
    }
    $rootScope.objSize = function (obj) {
      if (!!obj) {
        return Object.keys(obj).length;
      } else {
        return 0;
      }
    }
    $rootScope.getFirstObjectProperty = function (obj) {
      for (var p in obj) {
        return obj[p]
      }
    }
    $rootScope.log = function (log) {
      console.log(log);
    }

    $rootScope.isTabletWidthOrLess = window.innerWidth < 1024;
    $rootScope.$on('resize::resize', function() {
      $rootScope.isTabletWidthOrLess = window.innerWidth < 1024;
    });
    
    $rootScope.locale = $('html').attr('lang') + '_CA';
    $rootScope.isEnglish = $rootScope.locale == 'en_CA';
    $rootScope.isFrench = $rootScope.locale == 'fr_CA';
    $rootScope.brand = "kitchenaid";
    $rootScope.isMobile = Modernizr.mobile;
    $rootScope.showTooltip = false;

    $resource("config/"+$rootScope.brand+"-"+$rootScope.locale+".json").get({}, function (res, headers) {
          $rootScope.brandData = res

          angular.forEach( $rootScope.brandData.questions, function (item, key) { 
              $rootScope.brandData.questions[key].name = key
          })
          var manifest = [
            "img/slider-pointer.png"
          ];

          // @if ENV='development'
          var host = "http://mykitchenaid.wpc-stage.com";
          // @endif
          // @if ENV='production'
          var host = $appstate.host();
          // @endif
          $resource(host+"/api/public/wpq/product-list/index/brand/"+$rootScope.brand+"/locale/"+$rootScope.locale).get({}, function (res, headers) {
                $rootScope.appliances = $dataDecorator(res.products);

                
                
// $appstate.clear();
                $appstate.restore();
                $tests.init($rootScope.appliances,$rootScope.brandData.questions);

                // console.log($rootScope.questionsData);
          }, function () {
              $rootScope.errorMessage = "We're having connectivity issues. Please reload."
          });
    }, function () {
      $rootScope.errorMessage = "We're having connectivity issues. Please reload."
    });
  }]);

//angular.bootstrap(document, ["App"]);
