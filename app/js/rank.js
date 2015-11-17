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
                .css('width', $($element).find('.rank-answers-list li').width())
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
        console.log('drag');
        
        if ($rootScope.isMobile) {
            $($scope.clonedElement).css({
                position: 'absolute',
                top: e.originalEvent.touches[0].pageY - $scope.localY,
                left: e.originalEvent.touches[0].pageX - $scope.localX,
                display: 'block'
            })
        } else {
            $($scope.clonedElement).css({
                position: 'absolute',
                top: e.pageY - $scope.localY,
                left: e.pageX - $scope.localX,
                display: 'block'
            })
        }
    };

    $scope.mouseMoveListener = function(e) {
        var parentOffset = $(this).parent().offset();
        if ($rootScope.isMobile) {
            $scope.localX = e.originalEvent.touches[0].pageX - parentOffset.left;
            $scope.localY = e.originalEvent.touches[0].pageY - parentOffset.top - 20;
            console.log(parentOffset, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)
        } else {
            $scope.localX = e.pageX - parentOffset.left;
            $scope.localY = e.pageY - parentOffset.top - 20;
            
        }
    };

    $scope.toggleMouseMove = function(sw) {
        if (sw) {
            $.each($scope.labelElements, function(key,value) {
                $(value).on('mousemove', $scope.mouseMoveListener);
                $(value).on('touchmove', $scope.mouseMoveListener);
            });
        } else {
            $.each($scope.labelElements, function(key,value) {
                $(value).off('mousemove', $scope.mouseMoveListener);
                $(value).off('touchmove', $scope.mouseMoveListener);
            });
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
            $($scope.clonedElement).find('span').text($(e.source.itemScope.element[0]).find('span').text());
            $(document).on('mousemove', $scope.draggingListener);
            $(document).on('touchmove', $scope.draggingListener);
            $scope.toggleMouseMove(false);
        },
        dragEnd: function(e) {
            $($scope.clonedElement).hide();
            $(document).off('mousemove', $scope.draggingListener);
            $(document).off('touchmove', $scope.draggingListener);
            $scope.toggleMouseMove(true);
        },
	    containment: '.answers-main-content'
	};
});