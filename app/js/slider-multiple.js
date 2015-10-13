'use strict';

angular.module('App')
  .controller('SliderMultipleCtrl', function ($scope, $rootScope) {
  	// jslider-value
  	$scope.setAnswer = function () {
      $rootScope.showTooltip = false;
      for (var t in $rootScope.questionsData.question.text) {
    		for (var i in $rootScope.questionsData.question.text[t].answers) {
    			if ($rootScope.questionsData.question.text[t].answers[i].value == $rootScope.questionsData.question.text[t].answer) {
    				$rootScope.questionsData.question.text[t].answers[i].answer = true
            $rootScope.controls.questionHasAnswer = true
    			} else {
    				$rootScope.questionsData.question.text[t].answers[i].answer = false
    			}
    		}
      }
  	}
    $scope.setLast = function (qs,isVertical) {
      for (var t in qs.text) {     

          qs.text[t].options.round = 5
          var last = null
          for (var a in qs.text[t].answers) {
            if (!!last) {
              qs.text[t].options.halfway = (qs.text[t].answers[a].value-last.value) / 2 
              break
            } else {
                last = qs.text[t].answers[a]
            }
          }
          qs.text[t].options.realtime = true;
          qs.text[t].verticalOptions = angular.copy(qs.text[t].options);
          qs.text[t].verticalOptions.vertical = true;
          qs.text[t].options.modelLabels = angular.copy(function (value) {
            //if (!!$rootScope.questionsData.question) {
              //if (qs.name == $rootScope.questionsData.question.name) {  
                  //$rootScope.questionsData.question.text[t].roundedAnswer = value.toFixed(0)
                  //console.log($rootScope.questionsData.question.text[t].roundedAnswer)
                  //$rootScope.safeApply()
                  return value.toFixed(0);
              //}
            //}
          })
          qs.text[t].options.answers = qs.text[t].answers
          qs.text[t].options.iterator = t
          qs.text[t].options.callback = angular.copy(function(value, released) {  
            console.log(this)
            if (!!$rootScope.questionsData.question) {
              if (qs.name == $rootScope.questionsData.question.name) {    
                if (!!released) {
                  for (var a in this.answers) {
                        //console.log( $rootScope.questionsData.question.text[0].answer , $rootScope.questionsData.question.text[0].options.halfway,  parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway , parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway   )
                        console.log($rootScope.questionsData.question.text[this.iterator].answer , (parseFloat(this.answers[a].value)- this.halfway), (parseFloat(this.answers[a].value)+this.halfway))
                        if ($rootScope.questionsData.question.text[this.iterator].answer > (parseFloat(this.answers[a].value)- this.halfway) &&  $rootScope.questionsData.question.text[this.iterator].answer < (parseFloat(this.answers[a].value)+this.halfway)) {
                          $rootScope.questionsData.question.text[this.iterator].answer = this.answers[a].value
                          break
                        }
                  }
                  $rootScope.safeApply();
                } 
              }
            }
          })



        for (var i in qs.text[t].answers) {
          qs.text[t].last = qs.text[t].answers[i].value
        }

        for (var t in qs.text) {        
          for (var i in qs.text[t].answers) {
            if (qs.text[t].answers[i].value == qs.text[t].answer) {
              qs.text[t].answers[i].answer = true
            } else {
              qs.text[t].answers[i].answer = false
            }
          }
        }

      }
    }

});
