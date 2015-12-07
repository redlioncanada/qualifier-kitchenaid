'use strict';

angular.module('App')
    .controller('ResultsCtrl', function ($scope, $rootScope, $state, $location, $timeout, $modal, $appstate, $element) {
    $timeout(function() {
      $('#results').removeClass('hiddenViaOpacity')
    },500);

    if (window.innerWidth < 1024){
            $scope.useMobileTemplates = true;
        }else{
            $scope.useMobileTemplates = false;
        }
    
    $rootScope.$on('resize::resize', function() {
        if (window.innerWidth < 1024){
            $scope.$apply(function(){
                $scope.useMobileTemplates = true;
                console.log('usemobiletemplates');
            });
        }else{
            $scope.$apply(function(){
                $scope.useMobileTemplates = false;
            });
        }
      });

    $scope.$on('$locationChangeStart', function(event) {

    });

    $scope.$on('$locationChangeSuccess', function(event) {
      // console.log('results location change')
      if (!$rootScope.questionsData && !$rootScope.questionsData.scoringQuestions) console.log('no init');
      $appstate.store();

      if (!$rootScope.isTabletWidthOrLess && !$rootScope.isMobile && $location.path().indexOf('results') != -1) {
        $("html, body").animate({scrollTop: "125px"}, 400);
      }

    		if ( ($location.path()).toString().search("question") != -1) {

    			var q = ($location.path()).toString().replace("/question/","");
		  		$rootScope.controls.controlClicked = 'previous';
		  		$rootScope.controls.lastLocation = 'results';
		  		$timeout(function() {
  		  			$state.go('main.questions')
  					 $rootScope.moveToQuestion(q)
  				}, 100)
		  	}

        gaw.refresh();
    });

      if (!!!$rootScope.questionsData || !!!$rootScope.questionsData.scoringQuestions) $state.go('main.questions');
      $rootScope.resultsTouched = true;
      var d = $rootScope.isFrench ? ' $' : '';
      $rootScope.resultsOptions = {
        "from": 0,
        "to": 3000,
        "fakestep": 50,
        "smooth" : false,
        "step" : 1,
        "threshold" : 820,
        "dimension": d,
        "callback" : function(value, released) {  
          if (!released) $($element).attr('data-last-value', value);
          if (!!released) $($element).attr('data-value', value);

          if (!!released && !!value) {
            var range = value.split(";")

            for (var r in range) {
              var m = range[r] % $rootScope.resultsOptions.fakestep
              if (m != 0) {
                  if (m < ((Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1)*$rootScope.resultsOptions.fakestep)-range[r]) {
                      range[r] = (Math.floor(range[r] / $rootScope.resultsOptions.fakestep))*$rootScope.resultsOptions.fakestep
                  } else {
                      range[r] = (Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1)*$rootScope.resultsOptions.fakestep
                  }
              }
            }

            $rootScope.controls.price = range.join(";")
            $rootScope.safeApply()
            $scope.swipeDetails(1);
          } 
        } 

      }
  


  $rootScope.setFirstColour = function (appliance) {
    var highestPrice = appliance.colours[0];
    for (var c in appliance.colours) {
      if (appliance.colours[c].colourCode == "BS" || appliance.colours[c].colourCode == "CS" || appliance.colours[c].colourCode == "SS") {
        return appliance.colours[c]
      }
      if (appliance.colours[c].price > highestPrice.price) {
        highestPrice = appliance.colours[c];
      }
    }
    return highestPrice;
  }

  $rootScope.setMatches = function(arr) {
    $scope.matches = arr;
    $scope.bestMatch = arr[1];
  }

  $scope.isExtraFeature = function(index,feature,filteredAppliances) {
    //if the right "other suggestion" appliance costs less, and a feature exists on it that doesn't exist on the "best match" appliance, return true
    if (filteredAppliances.length != 3 || index != 2) return;
    var appliance = filteredAppliances[index];
    var bestMatch = filteredAppliances[1];
    if (bestMatch.price >= appliance.price) return false;
    if (!objectInArrayHasKeyValue(bestMatch.salesFeatures,"headline",feature.headline)) return true;
    return false;

    function objectInArrayHasKeyValue(obj,k,v) {
      for (var i in obj) {
          if (!(k in obj[i])) continue;
          if (obj[i][k].toLowerCase() == v.toLowerCase()) return true;
      }
      return false;
    }
  }

  $rootScope.emailOpen = function () {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'views/result-templates/email-results.html',
      controller: 'ModalCtrl',
      resolve: {
        appliance: function () {
          return $scope.bestMatch;
        },
        link: function() {
          return $appstate.host() + $appstate.generateEmailURL()
        },
        fakelink: function() {
          return $rootScope.brandData.apptext.emailFakeLink;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      //$scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
    //console.log($appstate.generateEmailURL());
  };

$scope.print = function(sku,colorsku) {
  window.open($appstate.generatePrintURL(sku,colorsku));
}

$scope.setPriceRange = function () {
       var minPrice = null, maxPrice = null

       for (var a in $rootScope.appliances) {
          var appliance = $rootScope.appliances[a]
          
          if (appliance.score !=null) {
            for (var c in appliance.colours) {
              var p = parseFloat(appliance.colours[c].prices.CAD)
                               if (minPrice == null) {
                                       minPrice = p; maxPrice = p
                               } else if (p < minPrice) {
                                       minPrice = p
                               } else if (p > maxPrice) {
                                       maxPrice = p
                               }
            }
          }
       }

       if (!minPrice || !maxPrice) return;
       $rootScope.resultsOptions.from = Math.floor(minPrice/50)*50;
        $rootScope.resultsOptions.to = Math.round(maxPrice/50)*50;
       $rootScope.controls.price = $rootScope.resultsOptions.from.toString() + ";" + $rootScope.resultsOptions.to.toString();
       $('#results .price-slider').css('opacity',1);
}

      $scope.expandPriceRange = function (price) {
        if (!!!$rootScope.controls.price) return;
        var range = $rootScope.controls.price.split(";")
        price = parseFloat(price)
        range[0] = parseFloat(range[0])
        range[1] = parseFloat(range[1])
        if (price<range[0]) {
          range[0] = price
        } else if (price>range[1]) {
          range[1] = price
        }
        $rootScope.controls.price = (Math.floor(range[0]/50)*50).toString() + ";" + (Math.round(range[1]/50)*50).toString()

      }
           
      $scope.getAppliance = function() {
        for (var i in $rootScope.questionsData.scoringQuestions.Appliance.text[0].answers) {
          var value = $rootScope.questionsData.scoringQuestions.Appliance.text[0].answers[i];

          if (!!value.answer) {
            if (value.displayName == 'Cooking') {
              for (var i in $rootScope.questionsData.scoringQuestions["Cooking - Pre-Qualifier 1"].text[0].answers) {
                var value = $rootScope.questionsData.scoringQuestions["Cooking - Pre-Qualifier 1"].text[0].answers[i];

                if (!!value.answer) {
                  return value.displayName;
                }
              }
            } else {
              return value.displayName;
            }
          }
        }
      }

      $scope.constructPageTitle = function() {
        for (var i in $rootScope.questionsData.scoringQuestions.Appliance.text[0].answers) {
          var value = $rootScope.questionsData.scoringQuestions.Appliance.text[0].answers[i];

          if (!!value.answer) {
            if (value.displayName == 'Cooking') {
              for (var i in $rootScope.questionsData.scoringQuestions["Cooking - Pre-Qualifier 1"].text[0].answers) {
                var value = $rootScope.questionsData.scoringQuestions["Cooking - Pre-Qualifier 1"].text[0].answers[i];

                if (!!value.answer) {
                  var suffix = value.displayName;
                  if ($rootScope.isFrench) suffix = suffix.toUpperCase();
                  return ($rootScope.brandData.apptext.oneLastStep + " " + suffix).trim();
                }
              }
            } else {
              var suffix = value.displayName;
              if ($rootScope.isFrench) suffix = suffix.toUpperCase();
              return ($rootScope.brandData.apptext.oneLastStep + " " + suffix).trim();
            }
          }
        }
      }

      $scope.startOver = function() {
        $appstate.reload();
      };

      $scope.setPriceRange()
})
.directive('desktopResults', function(){
    return {
        restrict: "EA",
        templateUrl: 'views/result-templates/desktop-results.html',
        link: function(scope, element, attrs) {
            //this.lrgBtn = $( "#large-button" );
        }
   }
})
.directive('mobileResults', ['$timeout', function($timeout){
    return {
        restrict: "EA",
        templateUrl: 'views/result-templates/mobile-results.html',
        link: function(scope, element, attrs) {
            scope.currentId = 1;
            scope.columnHeight = 0;

            $timeout(function(){
                scope.swipeDetails();
            },0);
            
            scope.$watch('useMobileTemplates', function() {
              $timeout(function(){
                scope.swipeDetails();
              },0);
            });

            scope.selectorClicked = function($event) { 
                var idClicked = parseInt($event.currentTarget.id.slice(-1));
                scope.swipeDetails(idClicked);
            };

          scope.swipeDetails = function(id) {
            if (typeof id === 'undefined') id = scope.currentId;
            var idClicked = 'result-selector-'+id.toString();
            if(idClicked == 'result-selector-0') {
                        $('#mobile-results-holder').height($('#result-column-0').height() + 25);
                        $('#result-column-0').css('left','0px');
                        $('#result-column-1').css('left','480px');
                        $('#result-column-2').css('left','960px');
                    //
                    $('#result-header-0').addClass('active');
                    $('#result-header-1').removeClass('active');
                    $('#result-header-2').removeClass('active');
                }else if(idClicked == 'result-selector-1') {
                        $('#mobile-results-holder').height($('#result-column-1').height() + 25);
                        $('#result-column-0').css('left','-480px');
                        $('#result-column-1').css('left','0px');
                        $('#result-column-2').css('left','480px');
                    //
                    $('#result-header-0').removeClass('active');
                    $('#result-header-1').addClass('active');
                    $('#result-header-2').removeClass('active');
                }else if(idClicked == 'result-selector-2') {
                        $('#mobile-results-holder').height($('#result-column-2').height() + 25);
                        $('#result-column-0').css('left','-960px');
                        $('#result-column-1').css('left','-480px');
                        $('#result-column-2').css('left','0px');
                    //
                    $('#result-header-0').removeClass('active');
                    $('#result-header-1').removeClass('active');
                    $('#result-header-2').addClass('active');
                }
                $('.results-list li').css('zIndex',1);
                $('#result-column-'+id).css('zIndex',2);
              scope.currentId = id;
          }

          scope.swipeRight = function() {
            if (scope.canSwipeRight()) scope.swipeDetails(scope.currentId-1);
          }

          scope.swipeLeft = function() {
            if (scope.canSwipeLeft()) scope.swipeDetails(scope.currentId+1);
          }

          scope.canSwipeRight = function() {
            return scope.currentId > 0;
          }

          scope.canSwipeLeft = function() {
            return scope.currentId < 2;
          }
        }
   }
}]);
