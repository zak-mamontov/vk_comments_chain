var s = document.createElement("script");
s.src = chrome.extension.getURL('/js/inject.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    var evt = document.createEvent("CustomEvent");
    url = chrome.extension.getURL('/img/planet.gif');
    evt.initCustomEvent("BindURL", true, true, url);
    document.dispatchEvent(evt);
};