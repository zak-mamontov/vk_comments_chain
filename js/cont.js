var dojo_s = document.createElement("script");
dojo_s.src = '//ajax.googleapis.com/ajax/libs/dojo/1.11.2/dojo/dojo.js' //chrome.extension.getURL('/js/dojo.js');
var s = document.createElement("script");
s.src = chrome.extension.getURL('/js/inject.js');
(document.head || document.documentElement).appendChild(dojo_s);
(document.head || document.documentElement).appendChild(s);