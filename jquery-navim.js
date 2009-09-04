/*
 * TODO:
 * - figure out left/right navigation
 * - G, gg navigatoin
 * - next/prev link specification
 * - bottom-of-page when scrolling past last item
 * 
 */


var jQuery_navim_plugin = {}

jQuery_navim_plugin.navigationItems = []
jQuery_navim_plugin.started = false
jQuery_navim_plugin.activeClassName = "navim_active";

jQuery_navim_plugin.util = {
	go: function(amount) {
		var elems = jQuery_navim_plugin.navigationItems;
		var state = jQuery_navim_plugin.state;
		var newindex;
		if(state.vertical == null) {
			var details;
			if(amount > 0 || $(window).scrollTop() > 0) {
				// if we're at the top, stay there when pressing "k"
				details = this.getFirstElement();
			} else {
				details = [null, null];
			}
			newIndex = details[0];
			selectedItem = details[1];
		} else {
			newIndex = state.vertical + amount;
			if(newIndex < 0) {
				selectedItem = null;
				newIndex = null;
			} else {
				if(elems.length <= newIndex) {
					newIndex = elems.length - 1;
				}
				selectedItem = elems[newIndex];
			}
		}
		state.vertical = newIndex;
		this.selectElement(selectedItem);
	},

	getFirstElement: function() {
		var win = jQuery(window);
		var collection = jQuery_navim_plugin.navigationItems;
		var selectObject = null;
		var selectIndex = 0;
		for(var i=0; i<collection.length; i++) {
			var item = collection[i];
			selectObject = item;
			selectIndex = i;
			if($(item).offset().top > win.scrollTop()) break;
		}
		return [selectIndex, selectObject];
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
			//TODO: why can't i just click() the link?
			document.location.href = links.eq(0).attr('href');
		}
	},
};

jQuery_navim_plugin.state = {
	vertical: null,
	currentElement: null
}

jQuery_navim_plugin.keyHandler = function(e) {
	var u = jQuery_navim_plugin.util;
	var mapping = {
		106: function() {u.go(1);},
		107: function() {u.go(-1);},
		13:  function() {u.action(jQuery_navim_plugin.state.currentElement);},
	};
	if(e.which in mapping) {
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

jQuery.fn.vimNavigation = function() {
	var collection = Array();
	this.each(function(){ collection.push(this); });
	jQuery_navim_plugin.navigationItems = collection;
	jQuery_navim_plugin.ensureActive();
}

jQuery.fn.scrollTo = function() {
	var offset = this.offset();
	var padding = 20;
	var doc = jQuery('html,body')
	var speed = 50;
	var win = $(window);

	var bounds = {
		height: win.height(),
		width: win.width(),
		top: win.scrollTop(),
		bottom: win.scrollTop() + win.height(),
		left: win.scrollLeft(),
		right: win.scrollLeft() + win.width()
	};

	var content = {
		height: this.outerHeight(),
		width: this.outerWidth(),
		top: offset.top,
		bottom: offset.top + this.outerHeight(),
		left: offset.left,
		right: offset.left + this.outerWidth()
	};

	function scrollH(offset) {
		doc.animate({scrollLeft: offset}, speed);
	};

	function scrollV(offset) {
		doc.animate({scrollTop: offset}, speed);
	};

	// vertical scrolling
	if(bounds.bottom < content.bottom) {
		// content extends below bottom margin
		if(content.height + padding > bounds.height) {
			// just scroll to the top (since we can't get it all in)
			scrollV(content.top - padding);
		} else {
			scrollV(content.bottom - bounds.height + padding);
		}
	} else if(bounds.top > content.top) {
		// content extends above bottom margin
		scrollV(content.top - padding);
	}

	// horizontal scrolling
	if(bounds.right < content.right) {
		// content extends past right margin
		if(content.width + padding > bounds.width) {
			scrollH(content.left - padding);
		} else {
			scrollH(content.right - bounds.width + padding);
		}
	} else if(bounds.left > content.left) {
		// content extends before left margin
		scrollV(content.left - padding);
	}
}

