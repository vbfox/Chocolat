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
