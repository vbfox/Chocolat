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
