'use strict';
angular.module('App')
  .controller('ShareCtrl', ['$scope', '$rootScope', '$appstate', '$interval', function ($scope, $rootScope, $appstate, $interval) {   
    $scope.appURL = $appstate.host();

    $scope.insertMetaTags = function() {
      if (!$('head').find('meta[name^="twitter"]').length) {
        $('head').append(createMeta('twitter:card', 'photo'))
                 .append(createMeta('twitter:description', $rootScope.brandData.apptext.twitterDesc))
                 .append(createMeta('twitter:title', $rootScope.brandData.apptext.twitterTitle))
                 .append(createMeta('twitter:image', $scope.appURL + $rootScope.brandData.apptext.twitterImage))
                 .append(createMeta('twitter:url', $scope.appURL));
      }

      function createMeta(name, content) {
        return '<meta name="'+name+'" content="'+content+'"/>';
      }
    }

    $scope.openTwitterWindow = function() {
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = 'http://twitter.com/share?' + 'text=' + $rootScope.brandData.apptext.twitterDesc + '&url=' + $scope.appURL,
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;
      window.open(url, 'twitter', opts);
    }

    //$scope.insertMetaTags();
  }]).directive('share', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/social.html',
      link: function($scope, element, attrs) {
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
