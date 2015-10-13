'use strict';
angular.module('App')
  .controller('ShareCtrl', function ($scope, $rootScope) {		
  }).directive('share', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/social.html',
      link: function(scope, element, attrs) {
        var shareIcon = $(element).find('.icon-share');
        //on main icon click, show menu
        $(shareIcon).on('click', function(e) {
          popout(e);
        });
        //on main icon mouseover, show menu
        $(shareIcon).on('mouseover', function(e) {
          popout(e);
        });
        //on menu mouseover, show menu
        $(element).find('.share-popout').on('mouseover', function(e) {
          popout(e);
        });
        //on menu button click, hide menu
        $(element).find('.share-popout span').on('click', function(e) {
          popin(e);
        });
        //on main icon mouseout, hide menu
        element.on('mouseout', function(e) {
          popin(e);
        });

        function popout(e) {
          e.preventDefault();

          var popout = $(element).find('.share-popout');
          $(popout).stop(true).animate({
            'left': -$(popout).width()
          }, 500);
        }
        function popin(e) {
          var popout = $(element).find('.share-popout');
          $(popout).stop(true).animate({'left': 0}, 500);
        }
      }
    }
  });
