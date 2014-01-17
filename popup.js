// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'kittens';

var kittenGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
      'method=flickr.photos.search&' +
      'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
      'text=' + encodeURIComponent(QUERY) + '&' +
      'safe_search=1&' +
      'content_type=1&' +
      'sort=interestingness-desc&' +
      'per_page=20',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.searchOnFlickr_, true);
    req.onload = this.showPhotos_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showPhotos_: function (e) {
    var kittens = e.target.responseXML.querySelectorAll('photo');
    for (var i = 0; i < kittens.length; i++) {
      var img = document.createElement('img');
      img.src = this.constructKittenURL_(kittens[i]);
      img.setAttribute('alt', kittens[i].getAttribute('title'));
      document.body.appendChild(img);
    }
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

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
    listHTML.innerHTML = "<p>Here's your list!</p>";
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
      console.log(r);
      if (r && r.history && r.history.value) {
        histwin.resetList()
        for (index = 0; index < r.history.value.length; ++index) {
          item = r.history.value[index];
          url = 'http://www.theguardian.com/' + item.id;
          histwin.append(url)
        }
        histwin.show();
      }
      });
    });
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
});
