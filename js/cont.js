var s = document.createElement("script");
s.src = chrome.extension.getURL('/js/inject.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    var evt = document.createEvent("CustomEvent");
    var url = chrome.extension.getURL('/img/planet.gif');
    app_uid = chrome.runtime.id;
    evt.initCustomEvent("BindDefData", true, true, { 'url': url, 'app_uid': app_uid });
    document.dispatchEvent(evt);
};
