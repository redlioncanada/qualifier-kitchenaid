var jsdom = require('jsdom');
describe('QuestionsCtrl', function() {
  beforeEach(module('app'));
  var $controller;

  describe('when next is selected', function() {
  
    it('should go to the next question or results', function() {
      // 
      expect(currentName).toEqual($scope.question.name);
    });
  });


    - 
    - add a box to navigation or not if its old
    - should erase all next steps if there are some and if there is a different next


  when a bottom navigation item is selected
    should show that question


  for Boxes Picture Carousel

  for Boxes Picture
  for Boxes
  for Checkbox
  for Radio

  for Rank
    when rank is changed
      - there is still an answer
      - the answer is different if the rank order is different
      - the rank order matches the answer order
  for Slider Multiple
  for Slider
    when slider is moved
      - there is still an answer
      - the answer is different if the slider is different
/*
  describe('$scope.order', function() {

    var randomQuestion = function (obj) {
        var count = 0;
        for (var i in obj) {
          count++
        }
        var ref = Math.floor((Math.random() * count))
        obj[ref].name = ref
        return obj[ref]
    }

    beforeEach(function() {
      $scope = {};
      controller = $controller('QuestionsCtrl', { $scope: $scope });
    });

    it('next with no answer', function() {
      // expect: set $scope.question equal to something random from $scope.questions, then assign no answer to question, then try to go next 
      $scope.question = randomQuestion($scope.questions)
      var currentName = angular.copy($scope.question.name)
      $scope.next()
      expect(currentName).toEqual($scope.question.name);
    });

    it('next with answer', function() {
      // expect: set $scope.question equal to something random from $scope.questions, then assign no answer to question, then try to go next 
      $scope.question = randomQuestion($scope.questions)
      var currentName = angular.copy($scope.question.name)
      
      $scope.next()
      expect(currentName).toNotEqual($scope.question.name)
    });

  });
*/


}); 