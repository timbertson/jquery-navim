var jQuery_navim_plugin = {}

jQuery_navim_plugin.navigationItems = {}
jQuery_navim_plugin.started = false
jQuery_navim_plugin.activeClassName = "navim_active";

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
		if(newIndex < 0) {
			this.selectElement(null);
			state[direction] = -1;
			return;
		}
		if(elems.length <= newIndex) return;
		state[direction] = newIndex;
		this.selectElement(elems[newIndex]);
	},

	selectElement: function(elem) {
		if(jQuery_navim_plugin.state.currentElement != null)
			jQuery_navim_plugin.state.currentElement.removeClass(jQuery_navim_plugin.activeClassName);
		if(elem == null) {
			jQuery_navim_plugin.state.currentElement = null;
			$('document,body').scrollTo();
		} else {
			elem = $(elem);
			jQuery_navim_plugin.state.currentElement = elem;
			elem.addClass(jQuery_navim_plugin.activeClassName);
			elem.focus();
			elem.scrollTo();
		}
	},

	action: function(elem) {
		var links = jQuery("a[href]", elem);
		if(links.length > 0) {
			console.log(links.eq(0));
			//TODO: why can't i just click() the link?
			document.location.href = links.eq(0).attr('href');
		}
	},
};

jQuery_navim_plugin.state = {
	vertical: -1,
	horizontal: -1,
	currentElement: null
}

jQuery_navim_plugin.keyHandler = function(e) {
	console.log("keypress: " + e.which);
	var u = jQuery_navim_plugin.util;
	var mapping = {
		104: function() {u.go(1, 'horizontal');},
		106: function() {u.go(1, 'vertical');},
		107: function() {u.go(-1, 'vertical');},
		108: function() {u.go(-1, 'horizontal');},
		13:  function() {u.action(jQuery_navim_plugin.state.currentElement);},
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

jQuery.vimNavigationAction = function(callback) {
	jQuery_navim_plugin.util.action = callback;
};

jQuery.fn.setVimNavigation = function(type, onAction) {
	var collection = Array();
	this.each(function(){ collection.push(this); });
	jQuery_navim_plugin.navigationItems[type] = collection;
	jQuery_navim_plugin.ensureActive();
}

jQuery.fn.scrollTo = function() {
	var offset = this.offset();
	var padding = 20;
	var doc = jQuery('html,body')
	var speed = 50;
	doc.animate({scrollTop: offset.top - padding, scrollLeft: offset.left - padding}, speed);
}

