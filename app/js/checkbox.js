'use strict';
angular.module('App')
  .controller('CheckboxCtrl', function ($scope, $rootScope) {
  		$scope.toggle = function (answers, answer) {
  			answer.answer = !answer.answer
        $rootScope.showTooltip = false;
        $rootScope.controls.questionHasAnswer=false

        if (answer.value == "nothing" && answer.answer == true) {
          $rootScope.controls.questionHasAnswer=true
    			for (var a in answers) {
            if (answers[a].value != "nothing") {
    				  answers[a].answer = false
            }
    			}
        } else {
          for (var a in answers) {
            if (typeof answers[a].answer == 'undefined') {
              answers[a].answer = false;
            }
            if (answers[a].answer == true) {
              $rootScope.controls.questionHasAnswer=true
            }
          }
          if ($rootScope.controls.questionHasAnswer==true) {
            for (var a in answers) {
              if (answers[a].value == "nothing") {
                answers[a].answer = false
                break;
              }
            }
          }          
        }
  		}
});
