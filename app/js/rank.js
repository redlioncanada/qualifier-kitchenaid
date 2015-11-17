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

        $scope.clonedElement = $($element).find('.rank-answers-list li').first().clone()
                .addClass('dragging-rank')
                .removeClass('as-sortable-item')
                .attr('as-sortable-item', '')
                .hide()
                .appendTo('body');

        var numElements = ($($element).find('.rank-answers-list li').height() + parseInt($($element).find('.rank-answers-list li').eq(0).css('margin-bottom'))) * ($($element).find('.rank-answers-list li').length) + 7;
        $($element).find('.rank-answers-list').css({'height': numElements});

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
        
        $($scope.clonedElement).css({
            position: 'absolute',
            top: e.pageY - $scope.localY,
            left: e.pageX - $scope.localX,
            display: 'block'
        })
    };

    $scope.mouseMoveListener = function(e) {
        var parentOffset = $(this).parent().offset();
        $scope.localX = e.pageX - parentOffset.left;
        $scope.localY = e.pageY - parentOffset.top - 20;
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
           if (!$rootScope.isTabletWidthOrLess) {
                $($scope.clonedElement).find('span').text($(e.source.itemScope.element[0]).find('span').text());
                $(document).on('mousemove', $scope.draggingListener);
                $scope.toggleMouseMove(false);
            }
        },
        dragEnd: function(e) {
            if (!$rootScope.isTabletWidthOrLess) {
                $($scope.clonedElement).hide();
                $(document).off('mousemove', $scope.draggingListener);
                $scope.toggleMouseMove(true);
            }
        },
	    containment: '.answers-main-content'
	};
});