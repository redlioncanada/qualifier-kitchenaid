describe('Appliances App', function() {
		var startItUp = function (test) {
			browser.get('http://localhost:3000').then( function () {
				test();
			});
		}

		var crawlToRandomQuestion = function (test) {
			startItUp(function () {
				var next = function () {
					$$('.answer').then(function (answers) { 
						var r = Math.floor((Math.random() * answers.length))
						answers[r].click()
						element(by.id('next')).click()
						var b = Math.floor((Math.random() * 2))
						if (!!b) 
							next()
						else 
							test()
					});
				}
	
			});
		}

		var makePath = function () {

		}

		var crawlToResults = function (test) {
			startItUp(function () {
				var next = function () {
					console.log("next");
					$$('.answer').then(function (answers) { 
						if (answers.length > 0) {
								var r = Math.floor((Math.random() * answers.length))
								answers[r].click().then(function () {
									if (element(by.id('next')).length > 0) {
										element(by.id('next')).click().then(function () {
											element(by.id('next')).isPresent().then(function (p) {
												if (!!p) 
													next()
												else 
													test()
											});
										});
									} else {
										$('html').getOuterHtml().then(function(html){ console.log(html); });
									}

								});
						} else {
							$('html').getOuterHtml().then(function(html){ console.log(html); });
						}
					});
				}
				$$('.answer').then(function (answers) { 
					var r = Math.floor((Math.random() * answers.length))
					answers[r].click().then(function () {
						next();						
					});
				});
			});
		}
	describe('Questions', function() {

		describe('when next is selected and there is no answer', function() {
			// it('should not go to the next question or results', function() {
			// 	crawlToRandomQuestion(function () {
			// 		var question = element(by.binding('questionsData.question.show.question')).getText()
			// 		element(by.id('next')).click()
			// 		expect(element(by.binding('questionsData.question.show.question')).getText()).toEqual(question)	
			// 	});
			// });

			iit('should not go to the next question or results', function(){
				browser.get('http://localhost:3000');
				var ans = $$('.answer');
				ans.count().then(function(count){
					var random_num = Math.floor( (Math.random() * count) );
					ans.get(random_num).click();
					ans.count().then(function(count){
						// var random_num = Math.floor( (Math.random() * count) );
						// ans.get(random_num).click();
						// element(by.linkText('Next')).click();
						// browser.pause();
					});


				});
			});

		});


		describe('when next is selected and there is an answer', function() {
			it('should go to the next question or results', function() {
				browser.get('http://localhost:3000').then( function () {
					var question = element(by.binding('questionsData.question.show.question')).getText()
					$$('.answer').then(function (answers) { 
						var r = Math.floor((Math.random() * answers.length))
						answers[r].click()
						element(by.id('next')).click()
						expect(element(by.binding('questionsData.question.show.question')).getText()).toNotEqual(question)
					});
				});
			});
		});


	});

	describe('Results', function() {

		var cases = [
			{
				"steps" : [
					"Laundry",
					"Not a Concern",
					"6+",
					"Kids' laundry, so much kids' laundry",
					"Not at all, my laundry is down in the basement",
					"No space constraints",
					"Rarely",
					"Ballet Tights",
					"Adding more time, every time",
					"Very, my iron and I are the best of friends",
					"Electric",
					"Often"
				],
				"results" : [
				]
			}

		]
		describe('for when a user picks'), function() {

		});			
		describe('when user navigates to results', function() {
			it('there should be no more than 3 results', function() {
				crawlToResults(function () {
					var results = element.all(by.repeater("a in appliances | filter:{score : '!null'} | byPrice:price | orderBy:'score' | limitTo:3"))
					expect(results.count() <= 3).toBeTruthy();
				});
			});
		});

		describe('when user navigates to results they expect top 3', function() {
			it('there should be no more than 3 results', function() {
				crawlToResults(function () {
					//console.log($rootScope)
					var results = element.all(by.repeater("a in appliances | filter:{score : '!null'} | byPrice:price | orderBy:'score' | limitTo:3"))
					var path = makePath()
					expect(results.count() <= 3).toBeTruthy();
				});
			});
		});


	});

	describe('Navigation', function() {

		
		describe('when next is selected and it is an old question', function() {
			it('the number of navigation elements should stay the same', function() {
				browser.get('http://localhost:3000').then( function () {
					var question = element(by.binding('questionsData.question.show.question')).getText()
					$$('.answer').then(function (answers) { 
						var r = Math.floor((Math.random() * answers.length))
						answers[r].click().then(function () {
							//element(by.id('next')).click()
							var navigationCount = element.all(by.repeater('q in questionsData.scoringQuestions | orderByOrder')).count()
							expect(element(by.binding('questionsData.question.show.question')).getText()).toNotEqual(question)
							element(by.id('previous')).click()
							expect(element(by.binding('questionsData.question.show.question')).getText()).toEqual(question)
							$$('.answer').then(function (answers) { 
								var r = Math.floor((Math.random() * answers.length))
								//console.log(answers)
								answers[r].click().then(function () {
								//element(by.id('next')).click()
								expect( element.all(by.repeater('q in questionsData.scoringQuestions | orderByOrder')).count() ).toEqual(navigationCount)
								});

							});								
						})

					});				
				});
			});
		});


		describe('when next is selected and it is a new question', function() {
			it('the number of navigation elements should increase by one', function() {
				browser.get('http://localhost:3000').then( function () {
					var navigationCount = element.all(by.repeater('q in questionsData.scoringQuestions | orderByOrder')).count()
					$$('.answer').then(function (answers) { 
						var r = Math.floor((Math.random() * answers.length))
						answers[r].click()
						// element(by.id('next')).click()
						expect( element.all(by.repeater('q in questionsData.scoringQuestions | orderByOrder')).count() ).toNotEqual(navigationCount)
					});
				});
			});
		});


	});

});