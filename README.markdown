Chocolat design document
========================

While chocolat first version is developed this document will serve as a design
notes document and will morph to a true readme as developement progress.

WTF ?
-----

Chocolat aim to be a chrome extension to create and apply a ruleset to all data
that a website could store in a browser.

Should be used by privacy-seeking individuals who want control. Need user
interaction far beyond install and forget.

Most of the functionality should be accessible by point and click.

Target data for the ruleset
---------------------------

The data storage that should be targeted is basically everything that
[evercookies](http://samy.pl/evercookie/) or similar technologies are able to
use. Also see [wikipedia article on alternatives to cookies](http://en.wikipedia.org/wiki/HTTP_cookie#Alternatives%20to%20cookies)

The easy ones (Full API available in a chrome extension) :

* Plain old Cookies
* History as it could be used as a storage mechanism.
  <br />
  See [chrome.history.* APIs](http://code.google.com/chrome/extensions/history.html)

The easy to remove by injecting as content script but we can't be alerted of changes :

* Gears database API if gears is there
* Web SQL Database (
  [wikipedia](http://en.wikipedia.org/wiki/Web_SQL_Database)
  )
  <br />
  It's obsolete but if chrome implement it, it must be supported.
* sessionStorage / localStorage
* Indexed DB (
  [wikipedia](http://en.wikipedia.org/wiki/Indexed_Database_API)
  )
  <br />
  Still not implemented but as firefox 4.0 will implement it, webkit got an
  implementation and there is a bug tracking the progress in chrome tracker
  support will be needed.
  <br />
  [Sample usage](http://oakleafblog.blogspot.com/2010/12/testing-indexeddb-with-trial-tool-web.html)

The ones where a a big amount of NPAPI magic will be needed to remove or list
anything :

* [Flash Local Shared Objects](http://en.wikipedia.org/wiki/Local_Shared_Object)
* Silverlight Isolated Storage

The dark areas, there is no access from extensions but private mode manage them
and they could be cleared from Chrome UI manually by the user :

* __Cache__ (
  [rfc](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
  )
  <br />
  We don't have access to the cache not even as an experimental API but it
  could be used as a perfectly good data store, especially via special PNG
  pictures readed and written using the canvas API.
* __ETags__ (
  [wikipedia](http://en.wikipedia.org/wiki/HTTP_ETag), 
  [rfc](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.19)
  )
  <br/>
  They are sent back to the page due to the cache so we get the same
  limitations there.

The void, features allowed to create so much problems that they compete with
ActiveX :

* __Java__
  <br/>
  Beyond removing the damn plugin there is no way to avoid all sorts of dark
  tricks if it is enabled. We may at least warn users of the presence of this
  plugin and explain how to disable it. Warning him back at each java update.
  
    From a security standpoing, flaws of java are currently the main injection
    vector for malwares far more than flash or adobe reader. It may not look
    like a privacy concern but everything that allow a website to take control
    of an user session (Chrome can't sandbox java currently) is a privacy
    disaster.
