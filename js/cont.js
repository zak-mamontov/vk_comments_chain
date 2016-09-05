var s = document.createElement("script");
s.src = chrome.extension.getURL('/js/inject.js');
(document.head || document.documentElement).appendChild(s);

chrome.runtime.sendMessage('некий объект в фон');