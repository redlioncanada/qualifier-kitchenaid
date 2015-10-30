'use strict';
angular.module('App')
  .controller('RadioCtrl', function ($scope, $rootScope) {
  		$scope.toggle = function (answers, answer) {
        $rootScope.showTooltip = false;
        if (answer.value == "nothing") {
          $rootScope.controls.questionHasAnswer=false
          for (var a in answers) {
              answers[a].answer = false
          }
        } else {
          for (var a in answers) {
            if (answers[a].value == answer.value) {
              answers[a].answer=!answers[a].answer
            }
            else {
              answers[a].answer = false
            }
          }
          $rootScope.controls.questionHasAnswer=false
          for (var a in answers) {
            if (answers[a].answer == true) {
              $rootScope.controls.questionHasAnswer=true
              break;
            }
          }
        }
        if ($rootScope.controls.questionHasAnswer == true || $rootScope.questionsData.question.name == 'Appliance') {
            $rootScope.next();
        }
      }
});
