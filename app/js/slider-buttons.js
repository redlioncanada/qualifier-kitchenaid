'use strict';

angular.module('App')
  .controller('SliderButtonsCtrl', function ($scope, $rootScope) {
    // jslider-value
    $scope.setAnswer = function () {
      $rootScope.showTooltip = false;
      $rootScope.controls.questionHasAnswer = false;
      for (var t in $rootScope.questionsData.question.text) {
        for (var i in $rootScope.questionsData.question.text[t].answers) {
          if ($rootScope.questionsData.question.text[t].answers[i].value == $rootScope.questionsData.question.text[t].answer) {
            $rootScope.questionsData.question.text[t].answers[i].answer = true
            if (t == 1) $rootScope.controls.questionHasAnswer = true
          } else {
            $rootScope.questionsData.question.text[t].answers[i].answer = false
          }
        }
      }
    }

    $scope.setButtonAnswer = function(answer) {
        if (!!!answer.enabled) return;
        $rootScope.questionsData.question.text[1].answer = answer.value;
        $scope.setAnswer();
    }

    $scope.setLast = function (qs,isVertical) {
          qs.text[0].options.round = 5
          var last = null
          for (var a in qs.text[0].answers) {
            if (!!last) {
              qs.text[0].options.halfway = (qs.text[0].answers[a].value-last.value) / 2 
              break
            } else {
                last = qs.text[0].answers[a]
            }
          }
          
          qs.text[0].options.realtime = true;

      if (!!qs.text[0].options) {
        qs.text[0].options.modelLabels = angular.copy(function (value) {
          if (!!$rootScope.questionsData.question) {
            //if (qs.name == $rootScope.questionsData.question.name) {  
                $rootScope.questionsData.question.text[0].roundedAnswer = value.toFixed(0);
                $rootScope.safeApply();
                return value.toFixed(0);
            //}
          }
        });
      }

      qs.text[0].options.callback = angular.copy(function(value, released) {  
        if (!!$rootScope.questionsData.question) {
          if (qs.name == $rootScope.questionsData.question.name) {    
            if (!!released) {
              for (var a in $rootScope.questionsData.question.text[0].answers) {
                    //console.log( $rootScope.questionsData.question.text[0].answer , $rootScope.questionsData.question.text[0].options.halfway,  parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway , parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway   )
                    if ($rootScope.questionsData.question.text[0].answer > (parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway) &&  $rootScope.questionsData.question.text[0].answer < (parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway)) {
                      $rootScope.questionsData.question.text[0].answer = $rootScope.questionsData.question.text[0].answers[a].value;
                      break
                    }
              }
              $rootScope.safeApply();
              $scope.toggleButtons(qs.text[1],$rootScope.questionsData.question.show.answer);

              for (var t in qs.text) {        
                for (var i in qs.text[t].answers) {
                  if (qs.text[t].answers[i].value == qs.text[t].answer) {
                    qs.text[t].answers[i].answer = true
                  } else {
                    qs.text[t].answers[i].answer = false
                  }
                }
              }
            } else {
              //released
            } 
          }
        }
      })

    qs.text[0].verticalOptions = angular.copy(qs.text[0].options);
      qs.text[0].verticalOptions.vertical = true;

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

    $scope.toggleButtons = function(qs,sliderVal) {
      sliderVal = Math.round(parseFloat(sliderVal));

      var match = false;
      for (var t in qs.answers) {
        for (var e in qs.answers[t].enabledWhen) {
          if (qs.answers[t].enabledWhen[e] == sliderVal) {
            match = true;
            break;
          }
        }

        if (match) {
          qs.answers[t].enabled = true;
        } 
        else {
          qs.answers[t].enabled = false;
          qs.answers[t].answer = false;

          //answer has been invalidated by button being disabled
          if (qs.answers[t].value == $rootScope.questionsData.question.text[1].answer) {
            $rootScope.questionsData.question.text[1].answer = false;
          }
        }
        match = false;
      }
      //console.log(qs);
    }
});
