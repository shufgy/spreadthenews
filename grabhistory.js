chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getGuHistory")
      sendResponse({history: JSON.parse(localStorage['gu.history'])});
});
