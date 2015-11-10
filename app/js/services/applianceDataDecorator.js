var applianceDataDecorator = angular.module('ApplianceDataDecoratorService', []);

applianceDataDecorator.factory('$dataDecorator', ['$filter', function($filter) {
	return function(data) {
		// console.log(data);
		var relcodes = {
          'M1' : 'DC',
          'WH' : 'DW'
        }
                
		angular.forEach(data, function(item, key) {
			item.price = parseFloat(item.colours[0].prices.CAD);

			switch (item.appliance) {
				case "Cooktops":
					if (item.width <= 15) {
						item["width15"] = true
					} else if (item.width <= 30) {
						item["width30"] = true
					} else if (item.width <= 36) {
						item["width36"] = true
					} else if (item.width <= 48) {
						item["width48"] = true
					}
					break;
				case "Vents":
					if (item.width <= 30) {
						item["width30"] = true
					} else if (item.width <= 50) {
						item["width36"] = true
					}

					if (item.cfm && typeof item.cfm !== null && item.cfm >= 340) {
						item["340CFMOrHigher"] = true;
					} else {
						item["340CFMOrHigher"] = false;
					}
					break;
				case "Dishwashers":
					item.quiet = false
					if (parseFloat(item.decibels) <= 47) {
						item.quiet = true
					}
					break;
				case "Fridges":
					if (item.height <= 66) {
						item["height66"] = true
					} else if (item.height <= 67) {
						item["height67"] = true
					} else if (item.height <= 68) {
						item["height68"] = true
					} else if (item.height <= 69) {
						item["height69"] = true
					} else if (item.height <= 70) {
						item["height70"] = true
					} else if (item.height <= 71) {
						item["height71"] = true
					} else if (item.height <= 72) {
						item["height72"] = true
					} else if (item.height <= 73) {
						item["height73"] = true
					} else if (item.height <= 74) {
						item["height74"] = true
					} else if (item.height <= 75) {
						item["height75"] = true
					} else if (item.height <= 76) {
						item["height76"] = true
					} else if (item.height <= 77) {
						item["height77"] = true
					} else if (item.height <= 78) {
						item["height78"] = true
					} else if (item.height <= 79) {
						item["height79"] = true
					} else if (item.height <= 80) {
						item["height80"] = true
					} else if (item.height <= 81) {
						item["height81"] = true
					} else if (item.height <= 82) {
						item["height82"] = true
					} else if (item.height <= 83) {
						item["height83"] = true
					} else if (item.height <= 84) {
						item["height84"] = true
					}

					if (item.width <= 38) {
						item["width38"] = true
					} else if (item.width <= 39) {
						item["width39"] = true
					} else if (item.width <= 40) {
						item["width40"] = true
					} else if (item.width <= 41) {
						item["width41"] = true
					} else if (item.width <= 42) {
						item["width42"] = true
					} else if (item.width <= 43) {
						item["width43"] = true
					} else if (item.width <= 44) {
						item["width44"] = true
					} else if (item.width <= 45) {
						item["width45"] = true
					} else if (item.width <= 46) {
						item["width46"] = true
					} else if (item.width <= 47) {
						item["width47"] = true
					} else if (item.width <= 48) {
						item["width48"] = true
					} 

					if (item.capacity <= 20) {
						item.mediumCapacity = true
					} else if (item.capacity <= 24.2) {
						item.largeCapacity = true
					} else if (item.capacity <= 25) {
						item.largerCapacity = true
					} else if (item.capacity > 25) {
						item.largestCapacity = true
					}
					break;
				case "Wall Ovens":
					if (item.width <= 24) {
						item["width24"] = true
					} else if (item.width <= 27) {
						item["width27"] = true
					} else if (item.width <= 30) {
						item["width30"] = true
					}

					if (item.capacity && item.capacity !== null && item.capacity >= 5) {
						item["5CuFt"] = true;
					} else {
						item["5CuFt"] = false;
					}
					break;
				case "Ranges":
					if (item.width <= 30) {
						item["width30"] = true
					if (item.width <= 36) {
						item["width36"] = true
					}

					if (item.capacity <= 5.1) {
						item.mediumCapacity = true
					} else if (item.capacity <= 5.8) {
						item.largeCapacity = true
					} else if (item.capacity <= 6.4) {
						item.largestCapacity = true
					}
					break;
				}
			}
		})
		return $filter('orderBy')(data, '-price');
	};
}]);