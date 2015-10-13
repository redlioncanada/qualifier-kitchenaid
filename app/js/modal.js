'use strict';

angular.module('App')
  .controller('ModalCtrl', function ($scope, $rootScope, $state, $modalInstance, $resource, $location) {

  	$rootScope.email = {}
  	$scope.submit = function () {

  		var link = $location.host() + "?"

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
  		console.log(link)
  		/*$rootScope.email.message += "<br />" + link
  		var r = $resource("placeholder/sendEmail")
  		r.save($rootScope.email,function (res, headers) {


  		});
  		$modalInstance.close();*/

  	}

});