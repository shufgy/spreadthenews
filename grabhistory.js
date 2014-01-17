chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getGuHistory")
      sendResponse({history: JSON.parse(localStorage['gu.history'])});
});

user = localStorage['gu.readinglist'];
if (!user) {
  user = 'shufgy';
  localStorage['gu.readinglist'] = 'shufgy';
}

$.get("http://the.earth.li/~huggie/cgi-bin/spreadthenews.pl?getlist=" + user)
.done(function( list ) {
  var blah = document.createElement('div');
  switch (user) {
    case "shufgy":
      name = "Simon Huggins";
      break;
    case "stephenfry":
      name = "Stephen Fry";
      break;
  }
  blah.innerHTML = '<h2>' + name + "'s chosen list<h2>";

  if (user == 'shufgy') {
    blah.innerHTML += "<p><a onClick=\"localStorage['gu.readinglist']='stephenfry'; window.location.reload(false);\">See Stephen Fry's list</a></p>";
  } else {
    blah.innerHTML += "<p><a onClick=\"localStorage['gu.readinglist']='shufgy'; window.location.reload(false);\">See Simon Huggins's list</a></p>";
  }

  if (list.length == 0) {
    blah.innerHTML += "<p>Nothing returned from server!</p>";
  } else {
    for (index = 0; index < list.length; ++index) {
      item = list[index];
      blah.innerHTML += '<p><a href="' + item + '">' + item + '</a></p>';
      //blah.innerHTML += '<p>' + item + '</p>';
    }
  }

  //rtcol = document.body.getElementsByClassName("u-table__cell u-table__cell--top");
  rtcol = document.body.getElementsByClassName("mpu-context");
  rtcol[0].appendChild(blah);
});
