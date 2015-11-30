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

			if (item.width) {
				item["width"+Math.round(item.width)] = true;
			}

			if (item.height) {
				item["height"+Math.round(item.height)] = true;
			}

			switch (item.appliance) {
				case "Cooktops":
					break;
				case "Vents":
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
					if (item.capacity && item.capacity !== null && item.capacity >= 5) {
						item["5CuFt"] = true;
					} else {
						item["5CuFt"] = false;
					}
					break;
				case "Ranges":
					if (item.capacity <= 5.1) {
						item.mediumCapacity = true
					} else if (item.capacity <= 5.8) {
						item.largeCapacity = true
					} else if (item.capacity <= 6.4) {
						item.largestCapacity = true
					}
					break;
			}
		})
		return $filter('orderBy')(data, '-price');
	};
}]);