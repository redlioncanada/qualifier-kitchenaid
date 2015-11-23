gaw.bind('language', function(element){
	return $('html,body').attr('lang') == 'en' ? 'EN' : 'FR';
});

gaw.bind('device', function(element){
	return window.innerWidth <= 1024 ? 'Mobile' : 'Desktop';
});

gaw.bind('slider-text', function(element) {
	return $(element).closest('.slider-wrap').attr('data-text');
});

gaw.bind('question-title', function(element) {
	return $(element).closest('.main-content').find('.app-content-main-top-left h2').text();
});

gaw.bind('question-name', function(element) {
	var p = window.location.hash.split("/");
	p = p[p.length-1].split('-');
	return decodeURIComponent(p[p.length-1]).trim();
});

gaw.bind('rank-question-order', function(element) {
	var t = [];
	$(element).find('.rank-answers-list li span').each(function(i,v) {
		t.push($(v).text());
	});
	return t.join('/');
});

gaw.bind('navbar-popover-title', function(element) {
	return $(element).parent().attr('popover-title');
});

gaw.bind('button-text', function(element) {
	return $(element).closest('.answer').find('.label-text').text();
});

gaw.bind('appliance', function(element) {
	return $(element).closest('.main').find('.main-content').attr('data-appliance');
});

gaw.bind('results-appliance-color', function(element) {
	return $(element).attr('src').split('ColorBars/')[1].split('-')[0];
});

gaw.bind('results-sku', function(element) {
	return $(element).closest('.result-inner').find('.product-sku span').eq(1).text();
});

gaw.bind('mobile-results-appliance-selection', function(element) {
	var a = $(element).closest('.mobile-result-selector').attr('id');

	switch(a) {
		case "result-selector-0":
			return "Other Suggestions 1";
			break;
		case "result-selector-1":
			return "Your Best Match";
			break;
		case "result-selector-2":
			return "Other Suggestions 2";
			break;
		default:
			return false;
			break;
	}
});

gaw.bind('results-appliance', function(element) {
	return $(element).closest('.body').find('.results-adjust-desc').attr('data-appliance');
});

gaw.bind('results-navbar-text', function(element) {
	return $(element).closest('.results-menu-menu').find('.name').attr('data-name')
});

gaw.bind('results-slider-last-value', function(element) {
	return $(element).closest('#results').attr('data-last-value');
});

gaw.bind('results-slider-value', function(element) {
	return $(element).closest('#results').attr('data-value');
});