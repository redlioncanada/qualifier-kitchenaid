var appstateModule = angular.module('AppstateService', ['LocalStorageModule', 'base64']);

appstateModule.factory('$appstate', ['$window', '$state', '$rootScope', 'localStorageService', '$location', '$log', '$base64', '$timeout', function($window, $state, $rootScope, localStorageService, $location, $log, $base64, $timeout) {
	var appstate = {
		freezeSession: false,
		restored: ''
	};

	appstate.store = function(print) {
		if (this.freezeSession) return;
		var answers = _enumerateAnswers();
		localStorageService.set('appstate', JSON.stringify(answers));
		// console.log(localStorageService.get('appstate'));
		// console.log('store');
	}

	appstate.restore = function() {
		var self = this;
		$timeout(function(){
			$rootScope.hasanswers = {};
		 	$rootScope.controls = {}
			$rootScope.controls.questionHasAnswer = false
		  	$rootScope.questionsData = {}
		  	$rootScope.questionsData.scoringQuestions = {};
		  	$rootScope.questionsData.currentCount = null;
		  	$rootScope.questionsData.questions = angular.copy($rootScope.brandData.questions)

	        //get session data, and if it exists, apply it to the app state
	        var session = _getSession();
	        var state = 'main.questions';	//go to this state based on session data, default main.questions

	        if (session) {
	        	console.log(session);
	        	console.log(session.answers);
	        	//change app view based on session.restore
	        	switch(session.restore) {
	        		case 'print':
	        			$state.go('print',session);
	        			return;
	        			break;
	        		case 'results':
	        			location.href = '#/results';
	        		default:
	        			//restoring a specific question
	        			$rootScope.hasanswers = session.answers;
	        			if (!(session.restore in $rootScope.questionsData.questions) && location.href.indexOf('results') == -1) self.reload();
	        			$rootScope.restore = session.restore;
	        			location.hash = session.restore;
	        			break;
	        	}
	        	self.restored = session.restore;
	        }

	        var count = 1
	        //fill app question data
		  	if (!$rootScope.questionsData.question) {
			  	for(var q in $rootScope.hasanswers) {
			  		if (!(q in $rootScope.questionsData.questions)) {
			  			self.reload();
			  		}
			  		if (!!$rootScope.hasanswers[q]) {
			  			var ans = $rootScope.hasanswers[q].split(";");

			  			for (var t in $rootScope.questionsData.questions[q].text) {
				  			for (var a in $rootScope.questionsData.questions[q].text[t].answers) {
				  				$rootScope.questionsData.questions[q].text[t].answers[a].answer = false;

				  				if (!$rootScope.questionsData.questions[q].text[t].answers[a].toString().length || !a.toString().length) {
				  					self.reload();
				  				}

				  				if ($rootScope.questionsData.questions[q].text[t].type != "rank") {
					  				if (ans.indexOf($rootScope.questionsData.questions[q].text[t].answers[a].value.toString()) != -1 ) {
					  					// console.log($rootScope.questionsData.questions[q].text[t].answers[a]);
					  					switch ($rootScope.questionsData.questions[q].text[t].type) {
					  						case "slider-buttons":
					  						case "slider-multiple":
					  							if (t > 0) break;
					  							$rootScope.questionsData.questions[q].text[0].answer = $rootScope.questionsData.questions[q].text[0].answers[a].value;
					  							$rootScope.questionsData.questions[q].text[1].answer = parseInt(ans[1]);
					  							if (parseInt(ans[1]) in $rootScope.questionsData.questions[q].text[1].answers) {
													$rootScope.questionsData.questions[q].text[1].answers[parseInt(ans[1])].answer = true;
												}
					  							break;
					  						case "slider":
					  							$rootScope.questionsData.questions[q].text[t].answer = $rootScope.questionsData.questions[q].text[t].answers[a].value;
					  							$rootScope.questionsData.questions[q].text[t].answers[a].answer = true;
					  							break;
					  						default:
					  							$rootScope.questionsData.questions[q].text[t].answers[a].answer = true;
					  							break;
					  					}
					  					$rootScope.questionsData.questions[q].text[t].answers[a].answer = true;
					  				}
					  			} else {
					  				$rootScope.questionsData.questions[q].text[t].answers[a].answer = ans.indexOf($rootScope.questionsData.questions[q].text[t].answers[a].value)
					  			}
				  			}
				  		}
			  		} 
			  		if ($rootScope.questionsData.questions[q]) {
				  		$rootScope.questionsData.questions[q].show =  $rootScope.questionsData.questions[q].text[0]
						$rootScope.questionsData.questions[q].order = count
				  		$rootScope.questionsData.scoringQuestions[q] = $rootScope.questionsData.questions[q]
			  		}

			  		count++
			  	}
		  	}

		  	if (state) $state.go(state);
	  	}, 100);
    }

    appstate.reload = function() {
    	this.clear();
    	this.freezeSession = true;
    	$window.location.href = '';
    	location.reload();
    }

	appstate.clear = function() {
		// localStorageService.clearAll();
		localStorageService.remove('appstate');
		console.log('clear session')
	}

	appstate.host = function() {
		return 'http://'+$location.host();
	}

	appstate.generateEmailURL = function() {
	      return '?' + $base64.encode(JSON.stringify(_enumerateAnswers()));
	}

	appstate.generatePrintURL = function(sku,color) {
	      return '?' + $base64.encode(JSON.stringify({restore:'print',sku:sku,color:color}));
	}

	function _getSession() {
		var session = false;

		//check for a direct-to-category query
		var search = $location.search()
		if ("category" in search) {
			var category = search['category'].replace(/%20/, ' ')
			if (search['category'] in $rootScope.homeQuestions) {
				var name = $rootScope.homeQuestions[category];
				appstate.clear()

				session = {
					"restore": name
				}
				console.log('forwarding session to question titled '+name);
			}
		}

		//check for a valid state in the URL
        var hash = $location.$$absUrl.split("?");

        if (1 in hash && !session) {
          hash = hash[1].split('#')[0];
          //if there is one, clear localstorage
          appstate.clear();

          try {
          	session = JSON.parse($base64.decode(hash));
          } catch(e) {
          	//failure
          	console.log('failed to parse url');
          	session = false;
          }
        } else {
        	console.log('no url session');
        }

        if (!session) {
        	//if there isn't one, check for one in localstorage
        	console.log(localStorageService.get('appstate'));
        	try {
        		session = localStorageService.get('appstate');
        	} catch(e) {
        		//failure
        		console.log('failed to fetch session from localstorage');
        		session = false;
        	}

        	if (_.isObject(session) && _.isEmpty(session)) {
        		session = false;
        		console.log('fetched session but it was empty');
        	}

        	if (!session) {
        		console.log('no session storage');
        	} else {
        		console.log('restored from localstorage')
        	}
        }

        return !!session ? session : false;
	}

	function _generateURL(str) {
		return $location.host() + '/?' + $base64.encode(str);
	}

	function _enumerateAnswers() {
		var temp = {};
      for (var sq in $rootScope.questionsData.scoringQuestions) {
        var answer = [];
        for (var t in $rootScope.questionsData.scoringQuestions[sq].text) {
          if (typeof $rootScope.questionsData.scoringQuestions[sq].text[t].answer !== 'undefined' && $rootScope.questionsData.scoringQuestions[sq].text[t].type == 'slider') {
            answer.push($rootScope.questionsData.scoringQuestions[sq].text[t].answer);
            continue;
          }
          for (var ans in $rootScope.questionsData.scoringQuestions[sq].text[t].answers) {
            if ($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer == true) {
              answer.push($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].value)
            }
            else if (!isNaN($rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer)) {
              answer[$rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].answer] = $rootScope.questionsData.scoringQuestions[sq].text[t].answers[ans].value
            }
          }
        }
        temp[sq] = answer.join(";");
      }

      return {restore:_currentState(), answers:temp};
	}

	function _currentState() {
		return /[^/]*$/.exec($location.path())[0];
	}

	return appstate;
}]);