'use strict';

angular.module('App')
  .controller('RankCtrl', function ($scope, $rootScope) {
	$scope.sortable = {}
    $scope.clonedElement;

    $scope.initialize = function (qs) {
        for (var i in qs.text[0].answers) {
            if (!isNaN(qs.text[0].answers[i].answer)) {
                qs.text[0].answers[i].order = qs.text[0].answers[i].answer
            }
            // console.log(qs.text[0].answers[i].order);
        }
    }

    $scope.draggingListener = function(e) {
        console.log('movemove');
        if (!$($scope.clonedElement)[0].parentElement) {
            console.log('append');
            $scope.clonedElement.appendTo('body').show();
        }
        $($scope.clonedElement).css({
            position: 'absolute',
            top: e.pageY,
            left: e.pageX
        })
    };

	$scope.sortable.dragControlListeners = {
    	orderChanged: function(event) {
            $rootScope.controls.questionHasAnswer = true
    		for (var i in $rootScope.questionsData.question.show.answers) {
    			$rootScope.questionsData.question.show.answers[i].answer = i
    		}
    	},
        dragStart: function(e) {
            console.log(e);
           $scope.clonedElement = $(e.source.itemScope.element[0]).clone()
                .addClass('dragging-rank')
                .removeClass('as-sortable-item')
                .attr('as-sortable-item', '');
           console.log($scope.clonedElement);
           $(document).on('mousemove', $scope.draggingListener);
        },
        dragEnd: function(e) {
            $($scope.clonedElement).remove();
            $scope.clonedElement = undefined;
            $(document).off('mousemove', $scope.draggingListener);
        },
	    containment: '.answers-main-content'
	};
});