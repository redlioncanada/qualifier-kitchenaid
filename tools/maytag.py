# maytag.py - peeling appliances out of maytag.com
# Author: Bianca Sayan (bianca.sayan@gmail.com)
# getting all of maytag

import mechanize 
import json
import httplib
import urllib2
import urllib
import xlwt
import re
from bs4 import BeautifulSoup

jsonfile = open("scraped_appliances.json", "wb")
url = 'http://www.maytag.com/'
appliances = []
#categories = ['Ranges','Wall Ovens','Cooktops','French-Door','Side-by-Side','Bottom-Freezer','Top-Freezer','Dishwashers']

appliance_characteristics = {
	"Ranges" : {
		"induction" : {
			"key" : "Range Type",
			"value" : "Induction",
			"type" : "bool"
		},
		"gas" : {
			"key" : "Range Type",
			"value" : "Gas",
			"type" : "bool"
		},
		"electric" : {
			"key" : "Range Type",
			"value" : "Electric",
			"type" : "bool"
		},
		"single" : {
			"key" : "Oven Type",
			"value" : "Single",
			"type" : "bool"
		},
		"double" : {
			"key" : "Oven Type",
			"value" : "Double",
			"type" : "bool"
		},
		"convection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"trueConvection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"combination" : {
			"key" : "name",
			"value" : "Combination",
			"type" : "search"
		},	 
		"capacity" : {
			"key" : "Oven Capacity",
			"type" : "copy"
		},
		"aquaLift" : {
			"key" : "Self-Cleaning",
			"value" : "AquaLift\u00ae Technology Clean",
			"type" : "bool"
		}
	},
	"Cooktops" : {
		"induction" : {
			"key" : "Fuel Type",
			"value" : "Induction",
			"type" : "bool"
		},
		"gas" : {
			"key" : "Fuel Type",
			"value" : "Gas",
			"type" : "bool"
		},
		"electric" : {
			"key" : "Fuel Type",
			"value" : "Electric",
			"type" : "bool"
		},
		"single" : {
			"key" : "Oven Type",
			"value" : "Single",
			"type" : "bool"
		},
		"double" : {
			"key" : "Oven Type",
			"value" : "Double",
			"type" : "bool"
		},
		"convection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"trueConvection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"combination" : {
			"key" : "name",
			"value" : "Combination",
			"type" : "search"
		},	 
		"capacity" : {
			"key" : "Oven Capacity",
			"type" : "copy"
		},
		"aquaLift" : {
			"key" : "Self-Cleaning",
			"value" : "AquaLift\u00ae Technology Clean",
			"type" : "bool"
		}
	},
	"Wall Ovens" : {
		"induction" : {
			"key" : "Fuel Type",
			"value" : "Induction",
			"type" : "bool"
		},
		"gas" : {
			"key" : "Fuel Type",
			"value" : "Gas",
			"type" : "bool"
		},
		"electric" : {
			"key" : "Fuel Type",
			"value" : "Electric",
			"type" : "bool"
		},
		"single" : {
			"key" : "Oven Type",
			"value" : "Single",
			"type" : "bool"
		},
		"double" : {
			"key" : "Oven Type",
			"value" : "Double",
			"type" : "bool"
		},
		"convection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"trueConvection" : {
			"key" : "Convection Element Type",
			"value" : "True",
			"type" : "bool"
		},
		"combination" : {
			"key" : "name",
			"value" : "Combination",
			"type" : "search"
		},	 
		"capacity" : {
			"key" : "Oven Capacity",
			"type" : "copy"
		},
		"aquaLift" : {
			"key" : "Self-Cleaning",
			"value" : "AquaLift\u00ae Technology Clean",
			"type" : "bool"
		}
	},
	"French-Door" : {
		"frenchDoor" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "French-Door"
		},
		"sideBySide" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Side-by-Side"
		},
		"topFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Top Freezer"
		},
		"bottomFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Bottom Freezer"
		},			 
		"filtered" : {
			"key" : "Filtered Water",
			"value" : "Yes",
			"type" : "bool"
		},
		"inDoor" : {
			"key" : "Dispenser Type",
			"value" : "Exterior Ice And Water",
			"type" : "bool"
		},
		"counterDepth" :{
			"key" : "name",
			"value" : "Counter Depth",
			"type" : "search"
		},
		"ethyleneFilter" : {
			"type" : "whole search",
			"value" : "FreshFlow\xe2 Produce Preserver"
		}
	},
	"Side-by-Side" : {
		"frenchDoor" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "French-Door"
		},
		"sideBySide" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Side-by-Side"
		},
		"topFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Top Freezer"
		},	
		"bottomFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Bottom Freezer"
		},	 
		"filtered" : {
			"key" : "Filtered Water",
			"value" : "Yes",
			"type" : "bool"
		},
		"inDoor" : {
			"key" : "Dispenser Type",
			"value" : "Exterior Ice And Water",
			"type" : "bool"
		},
		"counterDepth" : {
			"key" : "name",
			"value" : "Counter Depth",
			"type" : "search"
		},
		"ethyleneFilter" : {
			"type" : "whole search",
			"value" : "FreshFlow\xe2 Produce Preserver"
		}
	},
	"Top-Freezer" : {
		"frenchDoor" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "French-Door"
		},
		"sideBySide" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Side-by-Side"
		},	
		"topFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Top Freezer"
		},	
		"bottomFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Bottom Freezer"
		}, 	 
		"filtered" : {
			"key" : "Filtered Water",
			"value" : "Yes",
			"type" : "bool"
		},
		"inDoor" : {
			"key" : "Dispenser Type",
			"value" : "Exterior Ice And Water",
			"type" : "bool"
		},
		"counterDepth" :{
			"key" : "name",
			"value" : "Counter Depth",
			"type" : "search"
		},
		"ethyleneFilter" : {
			"type" : "whole search",
			"value" : "FreshFlow\xe2 Produce Preserver"
		}
	},
	"Bottom-Freezer" : {
		"frenchDoor" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "French-Door"
		},
		"sideBySide" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Side-by-Side"
		},
		"topFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Top Freezer"
		},		
		"bottomFreezer" : {
			"key" : "Refrigerator Type",
			"type" : "bool",
			"value" : "Bottom Freezer"
		},		 
		"filtered" : {
			"key" : "Filtered Water",
			"value" : "Yes",
			"type" : "bool"
		},
		"inDoor" : {
			"key" : "Dispenser Type",
			"value" : "Exterior Ice And Water",
			"type" : "bool"
		},
		"counterDepth" :{
			"key" : "name",
			"value" : "Counter Depth",
			"type" : "search"
		},
		"ethyleneFilter" : {
			"type" : "whole search",
			"value" : "FreshFlow\xe2 Produce Preserver"
		}
	},
	"Dishwashers" : {
		"decibels" : {
			"type" : "copy",
			"key" : "Decibel Level"
		},
		"stainlessTub" : {
			"type" : "bool",
			"key" : "Tub Material",
			"value" : "Stainless Steel"
		},
		"2Racks" : {
			"type" : "bool",
			"key" : "Number Of Racks",
			"value" : "2"
		},
		"3Racks" : {
			"type" : "bool",
			"key" : "Number Of Racks",
			"value" : "3"
		},
		"culinaryCaddy" : {
			"type" : "bool",
			"key" : "culinaryCaddy"
		},   
		"proWash" : {
			"type" : "bool",
			"key" : "proWash"
		}, 
		"sensorCycle" : {
			"type" : "bool",
			"key" : "sensorCycle"
		},
		"anyWare" : {
			"type" : "bool",
			"key" : "anyWare"
		},
		"controls" : {
			"type" : "bool",
			"key" : "controls"
		}
	},
	"High-Efficiency<br>Front-Load Washers" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Capacity (DOE)"
		},
		"frontLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Front Load"
		},
		"topLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Top Load"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Wash Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		},
		"powerWash" : {
			"type" : "whole search",
			"value" : "powerWash"
		}
	},
    "High-Efficiency<br>Top-Load Washers" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Capacity (DOE)"
		},
		"frontLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Front Load"
		},
		"topLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Top Load"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Wash Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		},
		"powerWash" : {
			"type" : "whole search",
			"value" : "powerWash"
		}
    },
    "High-Efficiency Dryers" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Dryer Capacity (DOE)"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		}
    },
    "Traditional Washers" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Capacity (DOE)"
		},
		"frontLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Front Load"
		},
		"topLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Top Load"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Wash Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		},
		"powerWash" : {
			"type" : "whole search",
			"value" : "powerWash"
		}
    },
    "Traditional Dryers" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Dryer Capacity (DOE)"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		}
    },
    "Laundry Pairs" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Capacity (DOE)"
		},
		"frontLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Front Load"
		},
		"topLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Top Load"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Wash Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		},
		"powerWash" : {
			"type" : "whole search",
			"value" : "powerWash"
		}
    },
    "Washer and<br>Dryer Combos" : {
		"capacity" : {
			"type" : "copy",
			"key" : "Capacity (DOE)"
		},
		"frontLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Front Load"
		},
		"topLoad" : {
			"type" : "search",
			"key" : "name",
			"value" : "Top Load"
		},
		"moreCycles" : {
			"type" : "copy",
			"key" : "Number Of Wash Cycles"
		},
		"easeOfUse" : {
			"type" : "whole search",
			"value" : "easy"
		},
		"digitalDial" : {
			"type" : "whole search",
			"value" : "digital"
		},
		"knobDial" : {
			"type" : "whole search",
			"value" : "knob"
		},
		"energyEfficiency" : {
			"type" : "bool",
			"key" : "Eco Monitor",
			"value" : "Yes"
		},
		"gas" : {
			"type" : "search",
			"key" : "name",
			"value" : "Gas"
		},
		"electric" : {
			"type" : "search",
			"key" : "name",
			"value" : "Electric"
		},
		"quiet" : {
			"type" : "bool",
			"key" : "Sound Package",
			"value" : "Quiet Series\xe2"
		},
		"lowVibration" : {
			"type" : "bool",
			"key" : "Advanced Vibration Control"
		},
		"sensorDry" : {
			"type" : "bool",
			"key" : "Moisture Sensor",
			"value" : "Yes"
		},
		"steam" : {
			"type" : "search",
			"key" : "Washer Option Selections",
			"value" : "steam"
		},
		"powerWash" : {
			"type" : "whole search",
			"value" : "powerWash"
		}
    },
    "Hoods" : {

    }



}



categories = {
	'Ranges' : "102120012",
	'Wall Ovens' : "102120015",
	'Cooktops' : "102120019",
	'French-Door' : "102120031+4294966832",
	'Hoods' : "102120022",
	'Side-by-Side' : "102120031+4294966854",
	'Bottom-Freezer' : "102120031+4294966855",
	'Top-Freezer' : "102120031+4294966858",
	'Dishwashers' : "102120003"
	}

appliance_subcategories = {
	'Ranges' : "Stove",
	'Wall Ovens' : "Stove",
	'Cooktops' : "Stove",
	'French-Door' : "Fridge",
	'Hoods' : "102120022",
	'Side-by-Side' : "Fridge",
	'Bottom-Freezer' : "Fridge",
	'Top-Freezer' : "Fridge",
	'Dishwashers' : "Dishwasher"

}

browser = mechanize.Browser()
browser.set_handle_robots(False)   # ignore robots
browser.set_handle_refresh(False)  # can sometimes hang without this
browser.addheaders = [('User-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'),
('Connection' , 'keep-alive')]

response = browser.open(url)

for category in categories:
	print "getting all " + category + " product urls"
	url = "http://www.maytag.com/webapp/wcs/stores/servlet/WHRORNCategoryOnlyResultsDisplayView?searchTerm=&catalogId=10562&langId=-1&storeId=10212&SRC_sortById=&SRC_searchConstraint="+str(categories[category])+"&pageSize=100&beginIndex=0&selectedTab=&pageView=&SRC_minPrice=&SRC_maxPrice="
	response = browser.open(url)
	response_content = response.read()
	soup = BeautifulSoup(response_content)
	lis = soup.find("ul",class_="endeca_aplliancesList").find_all('li')
	for li in lis:
		appliance = {}
		title_li = li.find_all("li", class_="applinceInfo_title")
		if len(title_li) > 0:
			appliance['url'] = title_li[0].find("a")['href']
			appliance['appliance'] = appliance_subcategories[category]
			appliance['type'] = category
			appliances.append(appliance)

for appliance in appliances:
	print appliance['url']
	response = browser.open(appliance['url'])
	response_content = response.read()
	soup = BeautifulSoup(response_content)
	appliance['name'] = soup.find("h1", class_="product-title").text
	appliance['description'] = soup.find("div", class_="product-description").find("p").text
	appliance['image'] = soup.find("div", class_="product-image").find("img").attrs['src']
	appliance['price'] = soup.find("span", class_="offer-price-amount").text
	specifications = soup.find("div", id="specifications")
	if (specifications is not None):
		specifications = specifications.find_all("div", class_="spec_contents_line")
		spec = {}
		for s in specifications:
			key = (s.find("div", class_="spec_contents_label").text).strip()
			value = (s.find("div", class_="spec_contents_info").text).strip()
			spec[key] = value
		for ch in appliance_characteristics[appliance['type']]:
			c = appliance_characteristics[appliance['type']][ch]
			appliance[ch] = False
			if c['type'] == "bool":
				if c['key'] in spec: 
					if spec[c['key']] == c['value']:
						appliance[ch] = True
			elif c['type'] == "search":
				if c['key'] in spec:
					pattern = re.compile(c['value'])
					s = pattern.search(spec[c['key']])
					if s is not None:
						appliance[ch] = True
			elif c['type'] == "whole search":
				pattern = re.compile(c['value'])
				s = pattern.search(soup.get_text())
				if s is not None:
					appliance[ch] = True
			elif c['type'] is "copy":
				if c['key'] in spec:
					appliance[ch] = spec[c['key']]			
		appliance['colours'] = []
		colours = soup.find("div", id="color-swatches").find_all("img", class_="color")
		for c in colours:
			appliance['colours'].append(c.attrs['title'])


#for category in categories:
#	#print "----------------"
#	#print category
#	for link in browser.links():
#		#print link.text
#		if link.text == category:
#			#print "OK"
#			browser.follow_link(link)
#			break;
#
#	for valink in browser.links():
#		print valink.text
#		if valink.text == "[View All]":
#			print valink.url
#			response = browser.follow_link(valink)


#			break;
#	response_content = response.read()
#	soup = BeautifulSoup(response_content)
#	#print soup
#	lis = soup.find("ul",_class="endeca_aplliancesList").find_all('li')
#	for li in lis:
#		appliance = {}
#		appliance['url'] = li.find("li", _class="applinceInfo_title").find("a")['href']
#		appliances.append(appliance)
print json.dumps(appliances, sort_keys=True, indent=4)
jsonfile.write(json.dumps(appliances, sort_keys=True, indent=4))
jsonfile.close()