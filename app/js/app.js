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
  'angular-images-loaded'
];

var App = angular.module('App', nglibs);
App.constant('Modernizr', Modernizr);

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
    $locationProvider.html5Mode(false);
    //$urlRouterProvider.otherwise("/");
    localStorageServiceProvider.setPrefix("MaytagQualifier_");

    $stateProvider
      .state('loading', {
        templateUrl: 'views/loading.html',
        controller: 'LoadingCtrl'
      }) 
      .state('print', {
        templateUrl: 'views/print.html',
        url : "/print/:sku",
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
    console.log(items);
      if (typeof items === 'undefined') return;
      var temp = items[0];
      items[0] = items[1];
      items[1] = temp;     
      if (items[0].price > items[2].price) {
        temp = items[0].price;
        items[0].price = items[2].price;
        items[2].price = temp;
        items[2].price = temp;
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

App.filter('assignScore', function() {
  return function(items, appliance) {
      angular.forEach(items, function(item) {
        if (item.featureKey in appliance) {
          if (!!appliance[item.featureKey]) {
            item.score = 2;
          } else if (!!item.top3) {
            item.score = 1;
          }
        } else if (!!item.top3) {
          item.score = 1;
        } else {
          item.score = 0;
        }
      });          
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
    if (!$rootScope.questionsData.scoringQuestions) return;
    var l = $rootScope.objSize($rootScope.questionsData.scoringQuestions)
    angular.forEach($rootScope.questionsData.scoringQuestions, function (item, k) {
      if (item.order == l) {
        t = item
      }
    })
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

App.run(['$rootScope', '$state', "$resource", 'localStorageService', 'Modernizr', '$location', function ($rootScope, $state, $resource, localStorageService, Modernizr, $location) {

    $state.go('loading');
    localStorageService.clearAll();

    $rootScope.resultsTouched = false;

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
    
    $rootScope.locale = 'en_CA';
    $rootScope.isEnglish = $rootScope.locale == 'en_CA';
    $rootScope.isFrench = $rootScope.locale == 'fr_CA';
    $rootScope.brand = "maytag";
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

          $resource("http://mymaytag.wpc-stage.com/api/public/wpq/product-list/index/brand/"+$rootScope.brand+"/locale/"+$rootScope.locale).get({}, function (res, headers) {
                $rootScope.appliances = res.products;

                var relcodes = {
                  'M1' : 'DC',
                  'WH' : 'DW'
                }
                angular.forEach( $rootScope.appliances, function (item, key) { 
                  if ($rootScope.brand == "maytag") {
                      if ($rootScope.appliances[key].appliance == "Laundry") {

                        $rootScope.appliances[key].sku = $rootScope.appliances[key].washerSku + "/" + $rootScope.appliances[key].dryerSku
                        for (var i in item.colours) {
                          //$rootScope.appliances[key].colours[i].image = setColourURL($rootScope.appliances[key].appliance,$rootScope.appliances[key].image, $rootScope.appliances[key].colours[i].colourCode);
                          $rootScope.appliances[key].colours[i].colourCode = $rootScope.appliances[key].colours[i].code;
                          if ($rootScope.appliances[key].image.search(relcodes[$rootScope.appliances[key].colours[i].colourCode]) != -1) {
                            $rootScope.appliances[key].colours[i].image = $rootScope.appliances[key].image
                          } else {
                            $rootScope.appliances[key].colours[i].image = "digitalassets/No%20Image%20Available/Standalone_1100X1275.png"
                          }
                          $rootScope.appliances[key].colours[i].prices = {}
                          $rootScope.appliances[key].colours[i].prices.CAD = parseFloat(item.colours[0].dryerPrices.CAD) + parseFloat(item.colours[0].washerPrices.CAD)
                          $rootScope.appliances[key].colours[i].sku = $rootScope.appliances[key].colours[i].washerSku
                        }
                        $rootScope.appliances[key].price = parseFloat(item.colours[0].dryerPrices.CAD) + parseFloat(item.colours[0].washerPrices.CAD)
                      } else {
                        $rootScope.appliances[key].price = parseFloat(item.colours[0].prices.CAD)
                      }


                      if ($rootScope.appliances[key].appliance == "Laundry") {
                          $rootScope.appliances[key].capacity = Math.min($rootScope.appliances[key].washerCapacity,$rootScope.appliances[key].dryerCapacity)

                          if (parseFloat($rootScope.appliances[key].dryerCycleOptions) <= 10) {
                            $rootScope.appliances[key].minCycles = true
                          } else {
                            $rootScope.appliances[key].maxCycles = true
                          }

                          if (parseFloat($rootScope.appliances[key].capacity) >= 6.1) {
                            $rootScope.appliances[key].largestCapacity = true
                          } 
                          if (parseFloat($rootScope.appliances[key].capacity) >= 5.2) {
                            $rootScope.appliances[key].largerCapacity = true
                          }
                          if (parseFloat($rootScope.appliances[key].capacity) >= 5) {
                            $rootScope.appliances[key].largeCapacity = true
                          }
                          if (parseFloat($rootScope.appliances[key].capacity) >= 4.8) {
                            $rootScope.appliances[key].mediumCapacity = true
                          }                    
                          if (parseFloat($rootScope.appliances[key].capacity) >= 4.2) {
                            $rootScope.appliances[key].smallCapacity = true
                          }

                      } else if ($rootScope.appliances[key].appliance == "Dishwashers") {
                        $rootScope.appliances[key]["placeSettings"+$rootScope.appliances[key].placeSettings.toString()] = true
                        $rootScope.appliances[key].quiet = false
                        if (parseFloat($rootScope.appliances[key].decibels) <= 47) {
                          $rootScope.appliances[key].quiet = true
                        }
                      } else if ($rootScope.appliances[key].appliance == "Fridges") {
                        if ($rootScope.appliances[key].height <= 66) {
                          $rootScope.appliances[key]["height66"] = true
                        } else if ($rootScope.appliances[key].height <= 67) {
                          $rootScope.appliances[key]["height67"] = true
                        } else if ($rootScope.appliances[key].height <= 68) {
                          $rootScope.appliances[key]["height68"] = true
                        } else if ($rootScope.appliances[key].height <= 69) {
                          $rootScope.appliances[key]["height69"] = true
                        } else if ($rootScope.appliances[key].height <= 70) {
                          $rootScope.appliances[key]["height70"] = true
                        } else if ($rootScope.appliances[key].height <= 71) {
                          $rootScope.appliances[key]["height71"] = true
                        }
                        if ($rootScope.appliances[key].width <= 30) {
                          $rootScope.appliances[key]["width30"] = true
                        } else if ($rootScope.appliances[key].width <= 31) {
                          $rootScope.appliances[key]["width31"] = true
                        } else if ($rootScope.appliances[key].width <= 32) {
                          $rootScope.appliances[key]["width32"] = true
                        } else if ($rootScope.appliances[key].width <= 33) {
                          $rootScope.appliances[key]["width33"] = true
                        } else if ($rootScope.appliances[key].width <= 34) {
                          $rootScope.appliances[key]["width34"] = true
                        } else if ($rootScope.appliances[key].width <= 35) {
                          $rootScope.appliances[key]["width35"] = true
                        } else if ($rootScope.appliances[key].width <= 36) {
                          $rootScope.appliances[key]["width36"] = true
                        }
                      } else if ($rootScope.appliances[key].appliance == "Cooking") {
                        if ($rootScope.appliances[key].type == "Ovens") {
                          if ($rootScope.appliances[key].width <= 27) {
                            $rootScope.appliances[key]["width27"] = true
                          } else if ($rootScope.appliances[key].width <= 30) {
                            $rootScope.appliances[key]["width30"] = true
                          } 
                        } 
                        else if ($rootScope.appliances[key].type == "Ranges") {
                          if (parseFloat($rootScope.appliances[key].capacity) >= 6.7) {
                            $rootScope.appliances[key].largestCapacity = true
                          } 
                          if (parseFloat($rootScope.appliances[key].capacity) >= 6.4) {
                            $rootScope.appliances[key].largerCapacity = true
                          }
                          if (parseFloat($rootScope.appliances[key].capacity) >= 6.2) {
                            $rootScope.appliances[key].largeCapacity = true
                          }
                          if (parseFloat($rootScope.appliances[key].capacity) >= 5.8) {
                            $rootScope.appliances[key].mediumCapacity = true
                          }                    
                        }
                      } 
                    } else if ($rootScope.brand == "kitchenaid") {

                    }
                })
                $rootScope.hasanswers = {};
                var httpparams = (decodeURI($location.$$absUrl)).replace(/\+/g, ' ').split("?");
                if (1 in httpparams) {
                  var loophttpparams = httpparams[1].split("&");
                  for (var l in loophttpparams) {
                    var inst = loophttpparams[l].split("=");
                    $rootScope.hasanswers[inst[0]] = inst[1];
                  }
                }
                  if ('sku' in $rootScope.hasanswers) {
                    $state.go('print',{"sku": $rootScope.hasanswers['sku']});
                  } else {
                    $state.go('main.questions');
                  }
          }, function () {
              $rootScope.errorMessage = "We're having connectivity issues. Please reload."
          });
    }, function () {
      $rootScope.errorMessage = "We're having connectivity issues. Please reload."
    });
  }]);

//angular.bootstrap(document, ["App"]);
