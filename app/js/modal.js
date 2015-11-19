'use strict';

angular.module('App')
  .controller('ModalCtrl', ['$modalInstance', 'appliance', 'link', 'fakelink', '$scope', '$rootScope', '$timeout', function ($modalInstance, appliance, link, fakelink, $scope, $rootScope, $timeout) {

    var apptext = $rootScope.brandData.apptext;
    var applianceType = appliance.appliance.slice(-1) == 's' ? appliance.appliance.slice(0, -1) : appliance.appliance;
    applianceType = applianceType.toLowerCase();

    $timeout(function() {
      $scope.setMessage();
      $scope.setSubject();
    });

    $scope.submit = function () {
      $scope.email.message = $scope.email.message.replace(fakelink, link);
      console.log($scope.email);
      $modalInstance.close();
    }

    $scope.close = function() {
      $modalInstance.dismiss('cancel');
    }

    $scope.setMessage = function() {
      $scope.email.message = apptext.emailMessage.replace('{{brand}}', apptext.apptitle.toLowerCase()).replace('{{appliance}}', applianceType).replace('{{fakelink}}', fakelink);
    }

    $scope.setSubject = function() {
      $scope.email.subject = apptext.emailSubject.replace('{{brand}}', apptext.apptitle.toLowerCase()).replace('{{appliance}}', applianceType);
    }

}]);