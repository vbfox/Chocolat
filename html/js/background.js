/*

// By default everything is removed.
// Rules are all executed in order.
// While the fluent syntax is nice a parser for a firewall like synax seem required.

from("*").keep("30 min");
from("*").localStorage().keep("2h");

from("*.google.com").cookies().keep();
from("*.google.com").history().keep("20 days");
from("https:\\*.google.com").cookies().forceSecure().forceHttpOnly();

from("https:\\*.twitter.com").cookies().keep().forceSecure().forceHttpOnly();

Website		Cookies		LocalStorage		Flash LSO
<all>		Keep 30min	Clear on load		Clear every 30 min
						Clear every 30min	
*/

/**
 * Collection of common filters.
 */
var filters = [
	type = function(trackedObject, type) {
		return (type = trackedObject.type) || (type = "*");
	},
	uri = function(trackedObject, uri) {
		return (uri = trackedObject.uri) || (uri = "*");
	}
];

function cookieTrackedObject()
{
	this.type = "cookie";

	this.matchFilter = function(filter, param) {
		if (filter == "type") return filters.type(this, param)
		if (filter == "uri") return filters.uri(this, uri);
		return false;
	};

	this.applyMutator = function(mutator) {

	};
}

function basicTracker()
{
	this.supportedMutators = [ "keep", "delete" ];
	this.supportedFilters = [ "subsystem", "uri", "uriRegex" ];

	this.getElements()
	{

	}
}

function cookieTracker()
{
	this.supportedMutators = [ "keep", "delete", "forceHttpOnly", "forceSecure" ];
	this.supportedFilters = [ "subsystem", "uri", "uriRegex", "httpOnly", "secure" ];
	this.getAll()
}

console.log("Loading background...");
window.tabs = new Tabs();
console.log("Background loaded.");

Y = function(f) {
  return (function(g) {
    return g(g);
  })(function(h) {
    return function() {
      return f(h(h)).apply(null, arguments);
    };
  });
};

window.utils = {
	findAllCookies: function(filters, callback) {
		if (callback === undefined) {
			callback = filters;
			filters = undefined;
		}

		chrome.cookies.getAllCookieStores(function(stores) {
			
			var allCookies = [];

			Y(function(recursion) {
				return function(cookies) {
					jQuery.merge(allCookies, cookies);
					
					if (stores.length > 0)
					{
						var nextStore = stores.pop();
						chrome.cookies.getAll(jQuery.extend({ storeId: nextStore.id }, filters), recursion);
					}
					else
					{
						callback(allCookies);
					}
				};
			})([]);
		});
	},
	getCookiesStats: function(callback) {
		window.utils.findAllCookies(function(cookies) {
			var result = { count: cookies.length, persistent: 0, secure: 0, httpOnly: 0 };
			jQuery.each(cookies, function(index, cookie) {
				if (cookie.expirationDate) {
					result.persistent = result.persistent + 1;
				}
				if (cookie.secure) {
					result.secure = result.secure + 1;
				}
				if (cookie.httpOnly) {
					result.httpOnly = result.httpOnly + 1;
				}
			});
			callback(result);
		});
	}
};
