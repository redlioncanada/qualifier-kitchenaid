'use strict';

angular.module('App')
  .controller('NavigationCtrl', function ($scope, $state, $rootScope, $filter, $location, $window, $timeout, $appstate) {
    $rootScope.$on('$locationChangeSuccess', function(event) {
        if ( ($location.path()).toString().indexOf("results") != -1 || $rootScope.restore == 'results') {
          $rootScope.atResultsPage = true;
        } else {
          $rootScope.atResultsPage = false;
        }
    });

    //On Constructor, check and set icontype
    if (window.innerWidth < 1024){
            $scope.useMobileIcons = true;
        }else{
            $scope.useMobileIcons = false;
        }
    //

  	$scope.setType = function (q,a) {
  		if (!!q && !!a) {
	  		if (!a.thumbnail_type) {
	  			return q.thumbnail_type
	  		} 
	  		return a.thumbnail_type
	  	}
  	}

  	$scope.navToQuestions = function (q) {
  		if (!!$rootScope.questionsData.question) {
  			if ($rootScope.questionsData.question.order < q.order) {
  				$rootScope.controls.controlClicked = 'next';
  			} else {
  				$rootScope.controls.controlClicked = 'previous';
  			}
  		} else {
  			$rootScope.controls.controlClicked = 'previous';
  		}
      $timeout(function() {
    		//$rootScope.questionsData.question=q;

    		//$state.go('main.questions')
        $rootScope.moveToQuestion(q.name)
      }, 100) 
  	}

  	$scope.byName = function(q) {
  		if (!!q) {
	    	return 'name' in q
		}
		return false
	};

	$scope.startOver = function () {
    $appstate.reload();
	}
})
.directive('resultsmenu', ['$timeout', '$rootScope', '$location', function($timeout, $rootScope, $location) {
  return {
    restrict: 'E',
    templateUrl: 'views/result-templates/results-menu.html',
    link: function($scope, element) {
      $scope.menuState = false;
      $scope.menuButtonHeight = $(element).find('.results-menu-heading').height();
      $scope.element = $(element).find('div').eq(0);
      $scope.height = 0;

      var iElement = $scope.element.find('.results-menu-body');
      var i = setInterval(function() {
        var j = $(iElement).height();
        if ($(iElement).height() > 50) {
          $scope.height = j;
          $(iElement).css('height', 0);
          clearInterval(i);
        }
      }, 100);

      $scope.menuIsOpen = function() {
        return $scope.menuState;
      }

      $scope.toggleMenu = function() {
        if ($scope.menuState) {
          $scope.closeMenu();
        } else {
          $scope.openMenu();
        }
      }

      $scope.openMenu = function() {
        if ($scope.menuState) return;
        $($scope.element).animate({
          'top': -$scope.height + $scope.menuButtonHeight
        });
        $(element).find('.results-menu-body').animate({
          'height': $scope.height
        });
        $scope.menuState = true;
      }

      $scope.closeMenu = function() {
        if (!$scope.menuState) return;
        $($scope.element).animate({
          'top': 0
        });
        $(element).find('.results-menu-body').animate({
          'height': 0
        });
         $scope.menuState = false;
      }
    }
  }
}]);