Chocolat design document
========================

While chocolat first version is developed this document will serve as a design
notes document and will morph to a true readme as developement progress.

WTF ?
-----

Chocolat is a chrome extension to create and apply a ruleset to all data that
a website could store in a browser.

Should be used by privacy-seeking individuals who want control. Need user
interaction far beyond install and forget.

Most of the functionality should be accessible by point and click.

Target data for the ruleset
---------------------------

The data storage that should be targeted is basically everything that
[evercookies](http://samy.pl/evercookie/) or similar technologies are able to
use. Also see [wikipedia article on alternatives to cookies](http://en.wikipedia.org/wiki/HTTP_cookie#Alternatives%20to%20cookies)

The easy ones :

* Plain old Cookies
* Gears database API if gears is there
* Web SQL Database ([wikipedia](http://en.wikipedia.org/wiki/Web_SQL_Database))

    It's obsolete but if chrome implement it, it must be supported.

* sessionStorage / localStorage
* Indexed DB ([wikipedia](http://en.wikipedia.org/wiki/Indexed_Database_API))
    
	Still not implemented but as firefox 4.0 will implement it, webkit got an
    implementation and there is a bug tracking the progress in chrome tracker
    support will be needed.

    [Sample usage](http://oakleafblog.blogspot.com/2010/12/testing-indexeddb-with-trial-tool-web.html)

* History as it could be used as a storage mechanism.

    See [chrome.history.* APIs](http://code.google.com/chrome/extensions/history.html)

The ones where a a big amount of NPAPI magic will be needed :

* [Flash Local Shared Objects](http://en.wikipedia.org/wiki/Local_Shared_Object)
* Silverlight Isolated Storage

The dark areas :

* Cache

    We don't have access to the cache not even as an experimental API but it
    could be used as a perfectly good data store, especially via special PNG
    pictures readed and written using the canvas API.

* ETags [wikipedia](http://en.wikipedia.org/wiki/HTTP_ETag)
  
    They are sent back to the page due to the cache so we get the same
    limitations there.

* Java
    Beyond removing the damn plugin there is no way to avoid all sorts of dark
    tricks if it is enabled. We may at least warn users of the presence of this
    plugin and explain how to disable it. Warning him back at each java update.
