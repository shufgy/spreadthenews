chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getGuHistory")
      sendResponse({history: JSON.parse(localStorage['gu.history'])});
});

//document.addEventListener('DOMContentLoaded', function () {
//  require(['common/modules/identity/api'], function(api){
//    // block has api in scope
//    console.log(api.getUserFromApi())
//  });
//});
