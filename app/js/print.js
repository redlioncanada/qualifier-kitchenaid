'use strict';

angular.module('App')
  .controller('PrintCtrl', function ($scope, $rootScope, $state, $timeout, $interval, $filter, $stateParams) {
  	$('footer.maytag-desktop, footer.maytag-mobile, header.header-desktop, header.header-mobile').css('display', 'none');
      if (!!$stateParams.sku) {
      	var a = $filter('filter')($rootScope.appliances, { "sku" : $stateParams.sku});
      	if (typeof a !== 'undefined') {
      		$scope.a = $filter('filter')($rootScope.appliances, { "sku" : $stateParams.sku})[0]
      	} else {
      		$state.go("main.questions");
      	}
      } else {
      	$state.go("main.questions");
      }

      var cnt = 0;
      var interval = 100;

      var print = $interval(function() {
      	if (parseInt($('.print-page-price span').text().replace('$', '')) > 0) {
      		$interval.cancel(print);
      		$timeout(function() {
      			var contentHeight = $('.print-page').height();
      			var pageHeight = 980;
      			var pad = pageHeight - (((contentHeight / pageHeight) - Math.floor(contentHeight / pageHeight)) * pageHeight);
      			$('.print-page-footer').css('marginTop', pad - $('.print-page-footer').height());
      			window.print();
      		},300);
      	}
      	if (++cnt*interval >= 2000) $interval.cancel(print);
      },interval);

      $scope.splitFeatures = function(a) {
      	if (typeof a.compareFeatures === 'undefined') return a;
      	var features = a.compareFeatures;
      	var featuresLength = length(a.compareFeatures);
      	var split = Math.floor(featuresLength/2);

      	a.compareFeaturesLeft = slice(features, 0, split-1);
      	a.compareFeaturesRight = slice(features, split, featuresLength);
      	return a;

      	function slice(obj, start, end) {var sliced = {};var i = 0;for (var k in obj) {if (i >= start && i <= end) sliced[k] = obj[k];i++;}return sliced;}
      	function length(obj) {var c = 0;for (var i in obj) {if (obj.hasOwnProperty(i)) c++;} return c;}
      }
})
.directive('unescape', function() {
	return {
		restrict: 'A',
		link: function(s,e,a) {
			s.$watch(a.ngBind, function(val) {
				var t = $(e).text();
				$(e).text(_.unescape(t).replace(' /', '/'));
			});
		}
	}
});
