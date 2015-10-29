'use strict';

angular.module('App')
  .controller('RankCtrl', function ($scope, $rootScope, $element, $timeout) {
	$scope.sortable = {}
    $scope.clonedElement;
    $scope.labelElements = [];

    $timeout(function() {
        $.each($($element).find('li .label-wrap'), function(key, value) {
            $scope.labelElements.push(value);
        });
        $scope.toggleMouseMove(true);
    },0);

    $scope.initialize = function (qs) {
        for (var i in qs.text[0].answers) {
            if (!isNaN(qs.text[0].answers[i].answer)) {
                qs.text[0].answers[i].order = qs.text[0].answers[i].answer
            }
        }
    }

    $scope.draggingListener = function(e) {
        // console.log('drag');
        if (!$($scope.clonedElement)[0].parentElement) {
            $scope.clonedElement.appendTo('body').show();
        }
        $($scope.clonedElement).css({
            position: 'absolute',
            top: e.pageY - $scope.localY,
            left: e.pageX - $scope.localX
        })
    };

    $scope.mouseMoveListener = function(e) {
        var parentOffset = $(this).parent().offset();
        $scope.localX = e.pageX - parentOffset.left - 67;
        $scope.localY = e.pageY - parentOffset.top - 17;
        // console.log('mousemove');
    };

    $scope.toggleMouseMove = function(sw) {
        if (sw) {
            $.each($scope.labelElements, function(key,value) {$(value).on('mousemove', $scope.mouseMoveListener)});
        } else {
            $.each($scope.labelElements, function(key,value) {$(value).off('mousemove', $scope.mouseMoveListener)});
        }
    }

    $scope.sortable.disabledDragControlListeners = {
        accept: function(source, dest) {
            return false;
        }
    };

	$scope.sortable.dragControlListeners = {
    	orderChanged: function(event) {
            $rootScope.controls.questionHasAnswer = true
    		for (var i in $rootScope.questionsData.question.show.answers) {
    			$rootScope.questionsData.question.show.answers[i].answer = i
    		}
    	},
        dragStart: function(e) {
            $scope.toggleMouseMove(false);

           $scope.clonedElement = $(e.source.itemScope.element[0]).clone()
                .addClass('dragging-rank')
                .removeClass('as-sortable-item')
                .attr('as-sortable-item', '');
           $(document).on('mousemove', $scope.draggingListener);
        },
        dragEnd: function(e) {
            $scope.toggleMouseMove(true);

            $($scope.clonedElement).remove();
            $scope.clonedElement = undefined;
            $(document).off('mousemove', $scope.draggingListener);
        },
	    containment: '.answers-main-content'
	};
});