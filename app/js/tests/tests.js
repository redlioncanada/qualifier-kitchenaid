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

	tests.init = function(appliances, questions) {
		this.appliances = appliances;
		this.questions = questions;
		window.tests = this;
	}

	//verifys scoring properties by ensuring that each property in the scoring json exists on a salesFeature featureKey
	tests.verifySalesFeaturePropertyAssociations = function() {
		var missingProps = {}, existingProps = {};

		for (var i in this.questions) {
			for (var j in this.questions[i].text) {
				for (var k in this.questions[i].text[j].answers) {
					for (var e in this.questions[i].text[j].answers[k].scoring) {
						var propExists = propExistsInSalesFeatures(this,e);

						var appType = i.split(' - ').length == 3 ? i.split(' - ')[1].trim() : i.split(' - ')[0].trim();

						if (!propExists) {
							if (!(appType in missingProps)) missingProps[appType] = [];
							if (missingProps[appType].indexOf(e) == -1) missingProps[appType].push(e);
						} else {
							if (!(appType in existingProps)) existingProps[appType] = {};
							if (!(propExists in existingProps[appType])) existingProps[appType][propExists] = e;
						}
					}
				}
			}
		}

		console.log(JSON.stringify({
			"missing": missingProps,
			"associated": existingProps
		}));

		function propExistsInSalesFeatures(self,key) {
			for (var i in self.appliances) {
				for (var j in self.appliances[i].salesFeatures) {
					if (self.appliances[i].salesFeatures[j].featureKey == key) {
						return self.appliances[i].salesFeatures[j].headline;
					}
				}
			}
			return false;
		}
	}

	//verifys scoring properties by ensuring that each property in the scoring json exists on an appliance somewhere in the appliance api
	tests.verifyScoringProperties = function() {
		var props = {};
		for (var i in this.questions) {
		  for (var j in this.questions[i].text) {
		    for (var k in this.questions[i].text[j].answers) {
		      for (var e in this.questions[i].text[j].answers[k].scoring) {
		        if (!(e in props) && e !== 'type' && e !== 'appliance') {
		          props[e] = this.questions[i].text[j].answers[k].scoring[e];
		        }
		      }
		    }
		  }
		}
		// console.log(props);
		for (i in props) {
			for (j in this.appliances) {
				if (i in this.appliances[j]) {
					console.log(i);
					delete props[i];
					break;
				}
			}
		}
		console.log(props);
	}

	tests.verifyAttrExist = function() {
		for (var i in this.appliances) {
			if (!"compareFeatures" in this.appliances[i]) {
				console.log('compareFeatures missing in '+this.appliances[i].name, this.appliances[i]);
			}
		}
	}

	tests.verifyQuestionPaths = function() {
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
	// @if ENV='production'
	tests.init = function(appliances,questions) {}
	// @endif
	return tests;
}]);