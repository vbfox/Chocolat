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
	this.url = undefined;
	this.uri = null;

	var that = this;
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

	var isSchemeWithCookie = function(scheme)
	{
		return scheme == "http" || scheme == "https";
	}

	var isOnFilteredTab = function() {
		return that.uri == null
			|| !isSchemeWithCookie(that.uri.scheme);
	}

	this.onTabUpdated = function(tab, changeInfo) {
		if (changeInfo.url) {
			this.url = tab.url;
			this.uri = (tab.url !== undefined) ? new URI(tab.url) : null;
		}

		if (isOnFilteredTab()) {
			return;
		}

		chrome.pageAction.setPopup({ tabId: this.id, popup: popupUrl });
		chrome.pageAction.show(this.id);
	}

	this.onBrowserActionClicked = function(tab) {
	}
	
	this.onTabUpdated(tab, { status: tab.status, url: tab.url });
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
		that[tab.id] = new Tab(tab);
		return true;
	};

	var onTabUpdated = function(internalTab, tabId, changeInfo, tab) {
		console.log("Signaling an update to tab " + internalTab.id + " (" + changeInfo.status + ") url = " + tab.url);
		internalTab.onTabUpdated(tab, changeInfo);
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
