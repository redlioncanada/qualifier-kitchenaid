'use strict';

angular.module('App')
  .controller('QuestionsCtrl', function ($element, $scope, $rootScope, $filter, $state, localStorageService, $timeout, $interval, $location, $route, $stateParams, $appstate) {
  	$scope.lastWidth = window.innerWidth;
  	$rootScope.$on('resize::resize', function() {
	    if (window.innerWidth < 1024){
	    	//temp fix - reload the page if going desktop to tablet and vice-versa
	    	//reflow on tablet when changing orientation currently breaks the app
	    	//no time to fix it before launch
	        if ($scope.lastWidth >= 1024) location.reload();
	        $scope.resizeElements();
	    } else if (window.innerWidth >= 1024) {
	    	if ($scope.lastWidth < 1024) location.reload();
	    	//reset header height to it's css value
            $('.app-content-main-top').css('height', '');
            $('.slidey-wrap-all').css('height', '');
	    }
	    $scope.lastWidth = window.innerWidth;
	});

  	$timeout(function(){$('.extra-info-wrap .tooltip').css('display','none')},0);
	$rootScope.$watch('showTooltip', function() {
		//position tooltip
			var el = $('.extra-info-wrap .tooltip');

			if ($rootScope.showTooltip) {
				var width = $('.extra-info-wrap .btn-wrap').width();
				if (width > 0 && window.innerWidth > 1024) {
					el.css('display','block');
					el.css({
						'width': width + 10,
						'margin-left': $rootScope.isTabletWidthOrLess ? -width-20 : -width/2
					});
				} else if (width > 0 && window.innerWidth <= 1024) {
					el.css('display','block');
					el.css({
						'width': width + 180,
						'margin-left': $rootScope.isTabletWidthOrLess ? -width-75 : -width/2
					});
				}
			} else {
				el.css('display', 'none');
			}
	});

	$interval(function(){
		if (window.innerWidth < 1024) {
			$scope.resizeElements();
		} else if (window.innerWidth >= 1024) {
	    	//reset header height to it's css value
            $('.app-content-main-top').css('height', '');
            $('.slidey-wrap-all').css('height', '');
	    }
	},500);

    $scope.$on('$locationChangeSuccess', function(event) {
    	// console.log('question location change');
    		var q = ($location.path()).toString().replace("/question/","");

    		// console.log($rootScope.controls.lastLocation);
    		if ($rootScope.controls.lastLocation == 'results' && q == 'Appliance') return;
    		if (q == 'Appliance') {
    			$rootScope.resultsTouched = false;
    			$rootScope.appliance = 'Landing Page';
    			$location.replace();
    		} else {
    			$rootScope.appliance = $rootScope.questionsData.question.name.split(' - ')[0];
    			$appstate.store();
    		}
    		gaw.refresh();

    		if (!!$rootScope.questionsData.question) {
    			var question = $rootScope.questionsData.question;
	    		if (question.name != q && !!q && q !== '/questions/' && q !== '/questions') {
		  			if (question.order < $rootScope.questionsData.questions[q].order) {
		  				$rootScope.controls.controlClicked = 'next';
		  			} else {
		  				$rootScope.controls.controlClicked = 'previous';
		  			}
			  		$timeout(function() {
						$rootScope.moveToQuestion(q)
					}, 100)	
			  	}
    		}
 			else {
	  			$rootScope.controls.controlClicked = 'previous';
		  		$timeout(function() {
					$rootScope.moveToQuestion(q)
				}, 100)	
	  		}
	  		// console.log(q);
	  		// console.log($rootScope.questionsData);

	  		$rootScope.controls.lastLocation = q;
    });


  	$rootScope.hasAnswer = function (q) {
  		if (!!q) {
	  		var qtype = q.show.type;
	        for (var ans in q.show.answers ) {
	          var a = q.show.answers[ans]
	          if (qtype == "rank") {
	          	// console.log(a.answer)
	            if (a.answer == 0) {
	              return a
	              break;
	            }              
	          } else if (qtype == "slider" || qtype == "slider-people" || qtype == "slider-multiple") {
	            if (a.value == q.show.answer) {
	              return a
	              break;
	            }       
	          } else {
	            if (a.answer == true) {
	              return a
	              break;
	            }	          	
	          }
	        }
	    }
    	return false
  	}


  	$rootScope.questionHasAnswer = function (q) {
  		if (!!q) {
	  		var qtype = q.show.type;
	        for (var ans in q.show.answers ) {
	          var a = q.show.answers[ans]
	          if (qtype == "rank") {
	              return true
	              break;
	          } else if (qtype == "slider" || qtype == "slider-people" || qtype == "slider-multiple") {
	            if (a.value == q.show.answer) {
	              return true
	              break;
	            }       
	          } else {
	            if (a.answer == true) {
	              return true
	              break;
	            }	          	
	          }
	        }
	    }
    	return false
  	}

	$scope.recalculateResults = function () {
		$rootScope.questionsData.currentCount = 0;
		$rootScope.questionsData.currentScore = {};

		for (var question in $rootScope.questionsData.scoringQuestions) {
			var q = $rootScope.questionsData.scoringQuestions[question]
			if (q.show.type != "slider-multiple" && q.show.type != "slider-buttons") {
				for (var answers in q.show.answers) {
					var a = q.show.answers[answers]
					// If answer isn't null, use it for scoring
					if (a.answer !== false) {
						// If it is true, simply apply scoring
						if (a.answer === true) {
							for (var scores in a.scoring) {
								var s = a.scoring[scores]
								// scores is type, s is 'range'
								if (s == null) {
									$rootScope.questionsData.currentScore[scores] = null
								} else if (typeof s == "string") {
									$rootScope.questionsData.currentScore[scores] = s
								} else if (!isNaN(s)) {
									if (scores in $rootScope.questionsData.currentScore) {
										$rootScope.questionsData.currentScore[scores] = $rootScope.questionsData.currentScore[scores] + s
									} else {
										$rootScope.questionsData.currentScore[scores] = s
									}
								}
							}
						} else if (isNaN(parseInt(a.answer)) == false) {
							var rankscoring = {
								"0" : 3,
								"1" : 2,
								"2" : 1
							}
							var getScore = function (ranking) {
								if (ranking.toString() in rankscoring) {
									return rankscoring[ranking.toString()]
								}
								return 0
							}
							for (var scores in a.scoring) {
								var s = a.scoring[scores]
								var t = getScore(a.answer)
								if (s == null) {
									$rootScope.questionsData.currentScore[scores] = null
								} else if (typeof s == "string") {
									$rootScope.questionsData.currentScore[scores] = s * t
								} else if (!isNaN(s)) {
									if (scores in $rootScope.questionsData.currentScore) {
										$rootScope.questionsData.currentScore[scores] = $rootScope.questionsData.currentScore[scores] + s*t
									} else {
										$rootScope.questionsData.currentScore[scores] = s*t
									}
								}
							}									
						}
					} else {
					}
				}
			} else {
				for (var t in q.text) {
					for (var answers in q.text[t].answers) {
						var a = q.text[t].answers[answers]
						// If answer isn't null, use it for scoring
						if (a.answer != false) {
							// If it is true, simply apply scoring
							if (a.answer == true) {
								for (var scores in a.scoring) {
									var s = a.scoring[scores]
									// scores is type, s is 'range'
									if (s == null) {
										$rootScope.questionsData.currentScore[scores] = null
									} else if (typeof s == "string") {
										$rootScope.questionsData.currentScore[scores] = s
									} else if (!isNaN(s)) {
										if (scores in $rootScope.questionsData.currentScore) {
											$rootScope.questionsData.currentScore[scores] = $rootScope.questionsData.currentScore[scores] + s
										} else {
											$rootScope.questionsData.currentScore[scores] = s
										}
									}
								}
							}
						}
					}
				}
			}
		}

		for (var appliance in $rootScope.appliances) {
			var a = $rootScope.appliances[appliance]
			a.score = 0;
			for (var score in $rootScope.questionsData.currentScore) {
				var s = $rootScope.questionsData.currentScore[score]
				if ((s == null && a[score] == true) || (typeof s == "string" && s != a[score])) {
					a.score = null;
					break;
				} else if (a[score] == true && !isNaN(s)) {
					a.score = a.score + s;
				}
			}
			if (a.score != null) {
				$rootScope.questionsData.currentCount++
			}
		}
	}

	$rootScope.rcResults = function () {
		$scope.recalculateResults()
	}

 	$rootScope.show = function () {
		var ref = 0;
	  	//if ($rootScope.questionsData.question.text.length > 1 && $rootScope.questionsData.question.text[0].type == "slider-multiple") {
		//	var ref = Math.floor((Math.random() * $rootScope.questionsData.question.text.length))			
		//} else {
		//	var ref = 0;
		//}
		$rootScope.questionsData.question.show = $rootScope.questionsData.question.text[ref];	

		/*if (window.innerWidth <= 580 && !$scope.isHomePage()) {
			$timeout(function(){
				//$(window).scrollTop(0);
				$scope.resizeElements();
			},200);
		}*/
	}

	$scope.isHomePage = function() {
		if (!$rootScope.questionsData.question) return false;
		return $rootScope.questionsData.question.name == "Appliance" || $rootScope.questionsData.question.name.indexOf('Pre-Qualifier') > -1;
	}

	$scope.truthy = function(key,obj) {
		if (!obj) return false;
		return (key in obj) && !!obj[key];
	}

	$scope.falsey = function(key,obj) {
		if (!obj) return true;
		return !$scope.truthy(key,obj);
	}

	$scope.resizeElements = function(depth) {
		if (typeof depth == 'undefined') depth = 1;

		var p = $('.app-content-main-top-left');
		var h = $('.app-content-main-top');
		var t1 = $(p).find('h2').eq(0);
		var t2 = $(p).find('h3');
		var t3 = $(p).find('h2').eq(1);

		var headerHeight = getTotalHeight(t1) + getTotalHeight(t2) + getTotalHeight(t3);

		$('.app-content-main-top').stop(true).animate({
			'height': headerHeight
		}, 0);


		var c = $('.slidey.active').height();
		var animating = $('.slidey.active-add').length;

		if ($scope.lastHeight > c-2 && $scope.lastHeight < c+2 && typeof $scope.lastHeight !== 'undefined' && !animating) {

			return;
		}
		$scope.lastHeight = c;
        
        if (window.innerWidth > 580) {
            if (c < 620) {
                c = $('.slidey.active').height();
                if (c < 620) {
                    var minHeight = 620;
                    $('.slidey.active').css('paddingTop', (minHeight-c)/2);
                    c = minHeight;
                }
            }
        }
        else {
            // if (c < 340) {
                c = $('.slidey.active').height();
                if (c < 340) {
                    var minHeight = 341;
                    console.log('paddingTop')
                    $('.slidey.active').css('paddingTop', (minHeight-c)/2);
                    c = minHeight;
                }
            // }
        }

		if (c > 100) {
			$('.slidey-wrap-all').css({
				'height': c + 10
			}, 0);
		}

		function getTotalHeight(el) {
			if (!el || (typeof el === 'object' && el.length == 0)) return 0;
			// console.log('el height: '+$(el).height());
			return parseInt($(el).height()) + parseInt($(el).css('paddingTop')) + parseInt($(el).css('paddingBottom')) + parseInt($(el).css('marginTop')) + parseInt($(el).css('marginBottom'));
		}
	}

	$scope.freshQuestion = function (q) {
		var newq = angular.copy(q)
		newq.$$hashKey = null
		return newq
	}

	$rootScope.moveToQuestion = function (name, done, suppressLocation) {
		if (typeof suppressLocation === 'undefined') suppressLocation = false;
		// Start - Make sure to delete future questions if this answer has changed the path
  		// if this question doesn't set next, then its fine
  		// if this question does, then delete everything after
  		// this should happen when stuff moves
  		console.log($rootScope.questionsData);

  		var q = ($location.path()).toString().replace("/question/","");
  		if ($rootScope.controls.lastLocation == 'results' && (q == 'Appliance' || q=='/questions/')) return;

  		if ($rootScope.isTabletWidthOrLess && $rootScope.isMobile) {
  			if ($location.path().indexOf('/questions/') == -1) {
				$("html, body").animate({scrollTop: "51px"}, 400);
			} else {
				$("html, body").animate({scrollTop: "0px"}, 400);
			}
		}

		if (!$rootScope.isTabletWidthOrLess && !$rootScope.isMobile && $location.path().indexOf('Appliance') != -1) {
			$("html, body").animate({scrollTop: "125px"}, 400);
		}

  		var hasNext = false
  		if (!!$rootScope.questionsData && !!$rootScope.questionsData.question) {
	  		angular.forEach($rootScope.questionsData.scoringQuestions[$rootScope.questionsData.question.name].show.answers, function (item, k) {
	  			if ('next' in item)
	  				hasNext = true
	  		})
	  		if ( !!hasNext ) {
		  		angular.forEach($rootScope.questionsData.scoringQuestions, function (item, k) {
		  			if (item.order > $rootScope.questionsData.scoringQuestions[$rootScope.questionsData.question.name].order) {
		  				delete $rootScope.questionsData.scoringQuestions[item.name]
		  			}
		  		})
	  		}
	  	}
		// End - Make sure to delete future questions if this answer has changed the path
		$scope.recalculateResults();
		if (!!name && !done) {
			var hasStoredAnswer = localStorageService.get(name)
			if (!!hasStoredAnswer) {
				$rootScope.questionsData.question = hasStoredAnswer
				$rootScope.controls.questionHasAnswer = true
			} else {
				$rootScope.questionsData.question = $rootScope.questionsData.questions[name];
			} 
		} else {
  			$rootScope.questionsData.question = null;
  		}

  		if (!!$rootScope.questionsData.question) {
			if ($rootScope.questionsData.question.name == 'Appliance') {
				//homepage
				for (var j in $rootScope.questionsData.questions["Appliance"].text[0].answers) {
					$rootScope.questionsData.questions["Appliance"].text[0].answers[j].answer = false;
				}

				if ($appstate.restored !== 'results') $appstate.clear();
  				if (!suppressLocation) $location.replace().path("/question/"+name);
			} else {
				if (!suppressLocation) $location.path("/question/"+name);
			}

			$scope.show();
			$rootScope.controls.questionHasAnswer = !!$rootScope.questionHasAnswer($rootScope.questionsData.question)
  			// Is the question already in the answered questions queue
  			if (!($rootScope.questionsData.question.name in $rootScope.questionsData.scoringQuestions)) {
	  			$rootScope.questionsData.scoringQuestions[$rootScope.questionsData.question.name] = $rootScope.questionsData.question;
	  			$rootScope.questionsData.scoringQuestions[$rootScope.questionsData.question.name].order = $rootScope.objSize($rootScope.questionsData.scoringQuestions);  				
  			}
  			$rootScope.questionsData.question.disabled=false
  			$appstate.restored = '';
		} else {
			$state.go('main.results')
		}	

	}

  	$rootScope.next = function (done) {
  		// console.log($rootScope.questionsData);
  		// console.log($rootScope.appliances);
  		// console.log($rootScope.questionsData.questions);
  		$rootScope.showTooltip = false;
  		$rootScope.questionsData.question.disabled = true;
  		$rootScope.controls.controlClicked = 'next';

        // $timeout is a hacky way to make sure the above assignment propagates before
        // any animation takes place.
  		$timeout(function() {
	  		// Make sure there is an answer
	  		if (!!$rootScope.controls.questionHasAnswer || !!done) {
	  			var hasAnswer = $rootScope.hasAnswer($rootScope.questionsData.question)
		  		if ("next" in $rootScope.questionsData.question) {
		  			var name = $rootScope.questionsData.question.next
		  		}
		  		else if ("next" in hasAnswer) {
		  			var name = hasAnswer.next
		  		}

		  		$rootScope.moveToQuestion(name,done)
	  		} 
  		}, 100);

  	} 
  	



   	$rootScope.previous = function () {
   		$rootScope.questionsData.question.disabled = true;
  		$rootScope.controls.controlClicked = 'previous';
  		$rootScope.showTooltip = false;

        // $timeout is a hacky way to make sure the above assignment propagates before
        // any animation takes place.
  		$timeout(function() {
	   		var name = null
	   		if (!!$rootScope.questionsData.question) {
		  		if ("previous" in $rootScope.questionsData.question) {
			  		name = $rootScope.questionsData.question.previous
			  	}
			} else {
				//$state.go("main.questions")
			    var l = $rootScope.objSize($rootScope.questionsData.scoringQuestions)
			    angular.forEach($rootScope.questionsData.scoringQuestions, function (item, k) {
			      if (item.order == l) {
			      	name = item.name
			      }
			    })			
			}
			$rootScope.moveToQuestion(name);
	  	}, 100);

  	}

  	if ($rootScope.objSize($rootScope.hasanswers) > 0) {
  		$scope.recalculateResults()
  		//$state.go("main.results");
  	} else {
  		$rootScope.moveToQuestion("Appliance")
  	}

  	if ($rootScope.restore) {
  		$scope.moveToQuestion($rootScope.restore);
  		delete $rootScope.restore;
  	}

  	//disable tooltip when clicking anywhere on the page
  	$('html,body').click(function(e) {
  		if(e.target.id != 'tooltip-glyph') $rootScope.showTooltip = false;
  	});

});