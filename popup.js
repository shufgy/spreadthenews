// Copyright (c) 2014 Simon Huggins <huggie@earth.li>
// 3 clause BSD licensed see LICENSE file

var histwin = {
  resetList: function() {
    window.localStorage.removeItem('list');
  },
  getList: function() {
    list = window.localStorage.getItem('list');
    if (!list) return [];
    return JSON.parse(list);
  },
  show: function() {
    listHTML = document.getElementById('list');
    listHTML.innerHTML = "<p>Here's your history!</p>";
    list = histwin.getList();
    for (index = 0; index < list.length; ++index) {
      item = list[index];
      var blah = document.createElement('p');
      blah.innerHTML = item;
      listHTML.appendChild(blah);
    }
  },
  append: function(value) {
    list = histwin.getList();
    list = list.concat(value);
    window.localStorage.setItem('list', JSON.stringify(list));
  },
  store: function() {
    var blah = document.getElementById('storeme');
    if (blah.value == "") { return true; }
    histwin.append(blah.value)
    histwin.show();
    blah.value = "";
  },
  grabhist: function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {method: "getGuHistory"}, function(response) {
      r = response
      if (r && r.history && r.history.value) {
        histwin.resetList()
        var hist = r.history.value;
        var hist = hist.map(function ids(obj) { return obj.id });
        // Magic javascript dedupe
        var hist = hist.filter(function (v, i, a) { return a.indexOf (v) == i });
        for (index = 0; index < hist.length; ++index) {
          item = hist[index];
          url = 'http://www.theguardian.com' + item;
          histwin.append(url)
        }
        histwin.show();
      }
      });
    });
  },
  getStoredList: function() {
    $.get("http://the.earth.li/~huggie/cgi-bin/spreadthenews.pl?getlist=shufgy")
      .done(function( list ) {
        window.localStorage.setItem('storedlist', JSON.stringify(list));
        histwin.showStoredList();
      });
  },
  showStoredList: function() {
    list = window.localStorage.getItem('storedlist');
    if (!list) return;
    list = JSON.parse(list);
    listHTML = document.getElementById('storelist');
    listHTML.innerHTML = "<p>Here's your list!</p>";
    if (list.length == 0) {
      var blah = document.createElement('p');
      blah.innerHTML = "Nothing returned from server!";
      listHTML.appendChild(blah);
      return;
    }
    for (index = 0; index < list.length; ++index) {
      item = list[index];
      var blah = document.createElement('p');
      blah.innerHTML = item;
      listHTML.appendChild(blah);
    }
  },
  submitList: function() {
    list = histwin.getList();
    if (list.length == 0) {
      alert("Nothing to submit!");
      return;
    }
    $.post("http://the.earth.li/~huggie/cgi-bin/spreadthenews.pl",
      { data: JSON.stringify(list) })
      .done(function( data ) {
        alert( "Data Loaded: " + data );
      });
  },
};

document.addEventListener('DOMContentLoaded', function () {
    var text = document.getElementById('storeme');
    text.addEventListener('change', histwin.store);
    var hist = document.getElementById('grabHistory');
    hist.addEventListener('click', histwin.grabhist);
    var send = document.getElementById('submitList');
    send.addEventListener('click', histwin.submitList);
    var get = document.getElementById('getList');
    get.addEventListener('click', histwin.getStoredList);

    // start by grabbing any stored list.
    histwin.getStoredList();
});
