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
