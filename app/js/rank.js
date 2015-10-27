'use strict';

angular.module('App')
  .controller('RankCtrl', function ($scope, $rootScope) {
	$scope.sortable = {}
    $scope.initialize = function (qs) {
        for (var i in qs.text[0].answers) {
            if (!isNaN(qs.text[0].answers[i].answer)) {
                qs.text[0].answers[i].order = qs.text[0].answers[i].answer
            }
            // console.log(qs.text[0].answers[i].order);
        }
    }

	$scope.sortable.dragControlListeners = {
    	orderChanged: function(event) {
            $rootScope.controls.questionHasAnswer = true
    		for (var i in $rootScope.questionsData.question.show.answers) {
    			$rootScope.questionsData.question.show.answers[i].answer = i
    		}
    	},
	    containment: '.answers-main-content'
	};
});