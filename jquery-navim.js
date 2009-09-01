var jQuery_navim_plugin = {}

jQuery_navim_plugin.navigationItems = {}
jQuery_navim_plugin.started = false

jQuery_navim_plugin.util = {
	go: function(amount, direction) {
		var userMapping = jQuery_navim_plugin.navigationItems;
		console.log(userMapping);
		var state = jQuery_navim_plugin.state;
		if(!direction in userMapping) return;
		var elems = userMapping[direction];
		if(!direction in state) state[direction] = 0;
		var newIndex = state[direction] + amount;
		//TODO: what about overflow?
		if(elems.length <= newIndex || newIndex <= 0) return;
		state[direction] = newIndex;
		this.selectElement(elems[newIndex]);
	},

	selectElement: function(elem) {
		alert("the selected element is: " + elem.innerHTML);
	},
};

jQuery_navim_plugin.state = {
	vertical: 0,
	horizontal: 0
}

jQuery_navim_plugin.keyHandler = function(e) {
	console.log("keypress: " + e.which);
	var u = jQuery_navim_plugin.util;
	var mapping = {
		104: function() {u.go(1, 'horizontal');},
		106: function() {u.go(1, 'vertical');},
		107: function() {u.go(-1, 'vertical');},
		108: function() {u.go(-1, 'horizontal');},
		13:  function() {u.action();},
	};
	if(e.which in mapping) {
		console.log("action!");
		mapping[e.which]();
	}
}

jQuery_navim_plugin.ensureActive = function() {
	if(jQuery_navim_plugin.started) return;
	jQuery_navim_plugin.started = true;
	jQuery(window).keypress(jQuery_navim_plugin.keyHandler);
};

jQuery.fn.setVimNavigation = function(type, onAction) {
	var collection = Array();
	this.each(function(){ collection.push(this); });
	jQuery_navim_plugin.navigationItems[type] = collection;
	jQuery_navim_plugin.ensureActive();
}
