var chromeUtils = {
	runOnEveryTab: function(func, continuation) {
		chrome.windows.getAll({ populate: true }, function(windows) {
			for(var windowIndex in windows) {
				var window = windows[windowIndex];
				for(var tabIndex in window.tabs) {
					var tab = window.tabs[tabIndex];
					func(tab);
				}
			}
			if (continuation) {
				continuation();
			}
		});
	}
};


function Tab(tab)
{
	this.id = tab.id;
	var popupUrl = "html/page_action_popup.html?" + this.id;

	var findView = function() {
		var fullPopupUrl = chrome.extension.getURL(popupUrl);
		var views = chrome.extension.getViews();
		for (var i in views) {
			var view = views[i];
			if (view.location.href == fullPopupUrl) {
				return view;
			}
		}
	};

	this.onTabUpdated = function(tab) {
		this.url = tab.url;
		chrome.pageAction.show(this.id);
	}

	this.onBrowserActionClicked = function(tab) {
	}
	
	chrome.pageAction.setPopup({ tabId: tab.id, popup: popupUrl });
	this.onTabUpdated(tab);
}

function Tabs()
{
	var that = this;

	var createTab = function(tab) {
		if (tab.id === undefined) return false;
		if (that[tab.id] !== undefined) {
			return false;
		}

		console.log("Creating Tab instance for tab " + tab.id);
		console.log(that);
		that[tab.id] = new Tab(tab);
		return true;
	};

	var onTabUpdated = function(internalTab, tabId, tab) {
		console.log("Signaling an update to tab " + internalTab.id);
		internalTab.onTabUpdated(tab);
	};
	var onBrowserActionClicked = function(internalTab, tab) {
		console.log("Signaling an browser action click to tab " + tab.id);
		internalTab.onBrowserActionClicked(tab);
	};

	var addCheckTab = function(continuation, getTabId) {
		return function() {
			var tabId = getTabId.apply(that, arguments);

			if (tabId == undefined) {
				throw new Error("Unable to get the tab for an event.");
			}

			var tab = that[tabId];
			if (tab === undefined) {
				throw new Error("Tab object didn't exists for tab " + tabId);
			}
			
			var args = Array.apply(null, arguments);
			continuation.apply(that, [tab].concat(args));
		};
	}

	console.log("Adding listeners for global tabs events");
	chrome.tabs.onCreated.addListener(createTab);
	chrome.tabs.onUpdated.addListener(addCheckTab(onTabUpdated, function(tabId) { return tabId; }));
	//chrome.browserAction.onClicked.addListener(addCheckTab(onBrowserActionClicked));

	chromeUtils.runOnEveryTab(createTab);

	this.getFromPopupHref = function(href) {
		var uri = new URI(href);
		var tab = this[uri.query];

		if (tab === undefined) {
			throw new Error("Called by a view without a Tab object ("
					+ uri.query + "), url = " + href);
		}

		return tab;
	};
}

console.log("Loading background...");
window.tabs = new Tabs();
console.log("Background loaded.");
