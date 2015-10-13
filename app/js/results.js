'use strict';

angular.module('App')
  .controller('ResultsCtrl', function ($scope, $rootScope, $state, $location, $timeout, $modal) {

    if (window.innerWidth < 1024){
            $scope.useMobileTemplates = true;
        }else{
            $scope.useMobileTemplates = false;
        }
    
    $rootScope.$on('resize::resize', function() {
        if (window.innerWidth < 1024){
            $scope.$apply(function(){
                $scope.useMobileTemplates = true;
            });
        }else{
            $scope.$apply(function(){
                $scope.useMobileTemplates = false;
            });
        }
      });

    $scope.$on('$locationChangeSuccess', function(event) {
    		if ( ($location.path()).toString().search("question") != -1) {
    			var q = ($location.path()).toString().replace("/question/","");
		  		$rootScope.controls.controlClicked = 'previous';
		  		
		  		$timeout(function() {
		  			$state.go('main.questions')
					$rootScope.moveToQuestion(q)
				}, 100)
		  	}
    });


      $rootScope.resultsTouched = true;
      var d = $rootScope.isFrench ? ' $' : '';
      $rootScope.resultsOptions = {
        "from": 0,
        "to": 3000,
        "fakestep": 250,
        "smooth" : false,
        "step" : 1,
        "threshold" : 250,
        "dimension": d,
        "callback" : function(value, released) {  

          if (!!released) {
            var range = value.split(";")

            for (var r in range) {
              var m = range[r] % $rootScope.resultsOptions.fakestep
              if (m != 0) {
                  //console.log(m, Math.floor(range[r] / $rootScope.resultsOptions.fakestep), Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1, ((Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1)*$rootScope.resultsOptions.fakestep)-range[r])
                  if (m < ((Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1)*$rootScope.resultsOptions.fakestep)-range[r]) {
                      range[r] = (Math.floor(range[r] / $rootScope.resultsOptions.fakestep))*$rootScope.resultsOptions.fakestep
                  } else {
                      range[r] = (Math.floor(range[r] / $rootScope.resultsOptions.fakestep)+1)*$rootScope.resultsOptions.fakestep
                  }
              }
            }

            $rootScope.controls.price = range.join(";")
            $rootScope.safeApply()
          } 

        } 

      }
  


  $rootScope.setFirstColour = function (appliance) {
    for (var c in appliance.colours) {
      if (appliance.colours[c].colourCode == "CS" || appliance.colours[c].colourCode == "SS") {
        return appliance.colours[c]
      }
    }
    return appliance.colours[0]
  }

  $rootScope.emailOpen = function () {
    //var modalInstance = 
    //size: size,
    /*var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'views/result-templates/email-results.html',
      controller: 'ModalCtrl',

      resolve: {
        items: function () {
          //return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      //$scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });*/

    var link = "?";

      for (var sq in $rootScope.questionsData.scoringQuestions) {
        var answer = [];
        console.log($rootScope.questionsData.scoringQuestions[sq]);
        for (var t in $rootScope.questionsData.scoringQuestions[sq].text) {
          if (typeof $rootScope.questionsData.scoringQuestions[sq].text[t].answer !== 'undefined' && $rootScope.questionsData.scoringQuestions[sq].text[t].type == 'slider') {
            answer.push($rootScope.questionsData.scoringQuestions[sq].text[t].answer);
            continue;
          }
          for (var ans in $rootScope.questionsData.scoringQuestions[sq].text[t].answers) {

            console.log($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer, $rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer == true, !isNaN($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer));
            if ($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer == true) {
              answer.push($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].value)
            }
            else if (!isNaN($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer)) {
              answer[$rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer] = $rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].value
            }
          }
        }
        link += sq + "=" + answer.join(";") + "&"
      }
      window.location.href = "mailto:?subject=Yo,%20Qualify&body=http://maytagqualifier.com"+encodeURIComponent(link).replace(/%20/g, '+');
      console.log("mailto:?subject=Yo,%20Qualify&body=<http://maytagqualifier.com"+encodeURIComponent(link)+">");
  };


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
       $rootScope.resultsOptions.from = minPrice;
        $rootScope.resultsOptions.to = maxPrice;
       $rootScope.controls.price = minPrice.toString() + ";" + maxPrice.toString();
}

      $scope.expandPriceRange = function (price) {
        var range = $rootScope.controls.price.split(";")
        price = parseFloat(price)
        range[0] = parseFloat(range[0])
        range[1] = parseFloat(range[1])
        if (price<range[0]) {
          range[0] = price
        } else if (price>range[1]) {
          range[1] = price
        }
        $rootScope.controls.price = range[0].toString() + ";" + range[1].toString()


      }

      $scope.constructPageTitle = function() {
        var suffix = typeof $rootScope.applianceType !== 'undefined' ? $rootScope.applianceType : '';
        if ($rootScope.isFrench) suffix = suffix.toUpperCase();
        return ($rootScope.brandData.apptext.oneLastStep + " " + suffix).trim();
      }

      $scope.setPriceRange()
})
.directive('desktopResults', function(){
    return {
        restrict: "EA",
        scope: false,
        transclude: true,
        templateUrl: 'views/result-templates/desktop-results.html',
        link: function(scope, element, attrs) {
            //this.lrgBtn = $( "#large-button" );
        }
   }
})
.directive('mobileResults', ['$timeout', function($timeout){
    return {
        restrict: "EA",
        scope: false,
        transclude: true,
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
                        //$('#result-header-0').css('font-size','14px');
                        //$('#result-header-0').css('text-decoration','underline');
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
