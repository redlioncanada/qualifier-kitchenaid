'use strict';

angular.module('App')
  .controller('ModalCtrl', ['$http', '$modalInstance', 'appliance', 'link', 'fakelink', '$scope', '$rootScope', '$timeout', function ($http, $modalInstance, appliance, link, fakelink, $scope, $rootScope, $timeout) {

    var apptext = $rootScope.brandData.apptext;
    var applianceType = "type" in appliance ? appliance.type : appliance.appliance;
    applianceType = applianceType.slice(-1) == 's' ? applianceType.slice(0, -1) : applianceType;
    applianceType = applianceType.toLowerCase();

    $timeout(function() {
      $scope.setMessage();
      $scope.setSubject();
    });

    $scope.submit = function () {
      $scope.email.message = $scope.email.message.replace(fakelink, "<a href='"+link+"'>"+fakelink+"</a>");
      var message = $.param({address: $scope.email.address, message: $scope.email.message, name: $scope.email.name, subject: $scope.email.subject});

      $http({
        method:'POST',
        url: 'php/email/', 
        data: message,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data, status, headers, config) {
          if (status == 200) {
            if (data.status !== 'error') {
              console.log('email post success: '+data.status)
            } else {
              console.log('email post error: '+data.message);
            }
          } else {
            console.log('email post error: status '+status);
          }
      }).error(function(data, status, headers, config) {
          console.log('email post error: '+data);
        });
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