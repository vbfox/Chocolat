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
