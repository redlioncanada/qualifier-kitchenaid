var appstateModule = angular.module('TestsService', []);

appstateModule.factory('$tests', ['$rootScope', function($rootScope) {
	var tests = {};

	// @if ENV='development'
	window.appliance = function(app) {
      var temp = [];
      for (var i in $rootScope.appliances) {
        if ($rootScope.appliances[i].sku.indexOf(app) > -1) {
          temp.push($rootScope.appliances[i]);
          continue;
        }
        if (($rootScope.appliances[i].appliance && $rootScope.appliances[i].appliance.indexOf(app) > -1) || ($rootScope.appliances[i].type && $rootScope.appliances[i].type.indexOf(app) > -1)) {
          temp.push($rootScope.appliances[i]);
        }
      }
      temp.length == 1 ? console.dir(temp[0]) : console.dir(temp);
    }

	tests.run = function(appliances, questions) {
		this.verifyScoringProperties(appliances, questions);
		this.verifyAttrExist(appliances);
	}

	//verifys scoring properties by ensuring that each property in the scoring json exists on an appliance somewhere in the appliance api
	tests.verifyScoringProperties = function(appliances, questions) {
		console.log(appliances);
		var props = {};
		for (var i in questions) {
		  for (var j in questions[i].text) {
		    for (var k in questions[i].text[j].answers) {
		      for (var e in questions[i].text[j].answers[k].scoring) {
		        if (!(e in props) && e !== 'type' && e !== 'appliance') {
		          props[e] = questions[i].text[j].answers[k].scoring[e];
		        }
		      }
		    }
		  }
		}
		// console.log(props);
		for (i in props) {
			for (j in appliances) {
				if (i in appliances[j]) {
					console.log(i);
					delete props[i];
					break;
				}
			}
		}
		console.log(props);
	}

	tests.verifyAttrExist = function(appliances) {
		for (var i in appliances) {
			if (!"compareFeatures" in appliances[i]) {
				console.log('compareFeatures missing in '+appliances[i].name, appliances[i]);
			}
		}
	}

	tests.verifyQuestionPaths = function(questions) {
		// check(res.questions["Appliance"].text[0].answers[0],undefined,true);
		// check(res.questions["Appliance"].text[0].answers[2],undefined,true);
		// check(res.questions["Appliance"].text[0].answers[3],undefined,true);
		// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[0],undefined,true);
		// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[1],undefined,true);
		// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[2],undefined,true);
		check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[3],undefined,true);

		function check(obj,lastQ,init) {
		  console.log(obj);
		  if (typeof init == 'undefined') init = false;

		  if (!"previous" in obj && !init) {
		    console.log('no prev found in '+obj.name);
		    return;
		  }
		  if (!"next" in obj) {
		    console.log('no next found in '+obj.name);
		    return;
		  }
		  if (!res.questions[obj.next] && obj.next != null) {
		    console.log(obj.name+ ': next question attribute '+obj.next+' does not exist');
		    return;
		  }
		  if (!res.questions[obj.previous] && !init) {
		    console.log(obj.name+ ': prev question attribute '+obj.previous+' does not exist');
		  }
		  if (obj.prev !== lastQ && !init) {
		    console.log(obj.name+': prev question attribute '+obj.previous+' does not match the last question ('+lastQ+')');
		  }
		  if (obj.next != null && obj.next != "null") {
		    check(res.questions[obj.next], obj.name);
		  } else {
		    console.log('path passed');
		  }
		}
	}
	// @endif
	return tests;
}]);