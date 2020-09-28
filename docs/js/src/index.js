const n3 = require('n3');

class TocEntry {
  constructor(url, startOffset, endOffset, name) {
    this.url = url;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
    this.name = name;
  }
}

class TocPlayer {
  constructor(entries) {
    this.count = 0;
    this.trackNumber = 0;
    this.player = document.getElementById("player");
    this.entries = entries;
    this.createHtml(this.entries);
  }

  static async create(data) {
    var entries = await TocPlayer.createEntries(data);
    return new TocPlayer(entries);
  }

  playTrackByNumber(number) {
    var entry = this.entries[number];
    this.trackNumber = number;
    let countState = ++this.count;
    this.player.src = entry.url;
    this.player.currentTime = entry.startOffset;
    this.player.play().then(() => {
      if (this.endOffset !== null) {
        setTimeout(function() {
          if (countState == this.count) {
            player.pause();
          }
        }, (entry.endOffset - entry.startOffset + 1) * 1000);
      }
    });
  }

  next() {
    if (this.trackNumber + 1 < this.entries.length) {
      this.playTrackByNumber(this.trackNumber + 1);
    }
  }

  static async createEntries(data) {
    var quadStore = await schemarama.parseJsonLd(JSON.stringify(data), "http://example.org/dummy");
    var tocEntryQuads = quadStore.getQuads(
      n3.DataFactory.namedNode('http://example.org/dummy'),
      n3.DataFactory.namedNode("http://schema.org/tocEntry"));
    var entries = [];
    for (var quad of tocEntryQuads) {
      let url = this.getQuad(
        quadStore,
        quad.object,
        "http://schema.org/url") || this.getContentUrl(quadStore);
      let startOffset = this.getQuad(
        quadStore,
        quad.object,
        "http://schema.org/startOffset") || 0;
      let endOffset = this.getQuad(
        quadStore,
        quad.object,
        "http://schema.org/endOffset") || null;
      let name = this.getQuad(
        quadStore,
        quad.object,
        "http://schema.org/name");
      entries.push(new TocEntry(url, startOffset, endOffset, name));
    }
    return entries;
  }

  static getContentUrl(quadStore) {
    let media = quadStore.getQuads(
      n3.DataFactory.namedNode('http://example.org/dummy'),
      n3.DataFactory.namedNode("http://schema.org/associatedMedia"));
    return this.getQuad(
      quadStore,
      media.object,
      "http://schema.org/contentUrl");
  }

  static getQuad(quadStore, subject, predicateString) {
    var quadList = quadStore.getQuads(
      subject,
      n3.DataFactory.namedNode(predicateString));
    if (quadList.length == 0) {
      return null;
    }
    return quadList[0].object.value;
  }

  createHtml(entries) {
    var list = document.getElementById("entry_list");
    list.innerHTML = "";

    for (let i = 0; i < entries.length; i++) {
      var element = document.createElement("a");
      var text = document.createTextNode(entries[i].name);
      element.appendChild(text);
      var button = document.createElement("button");
      button.appendChild(element);

      button.onclick = () => {
        this.playTrackByNumber(i);
      }

      var li = document.createElement("li");
      li.appendChild(button);
      list.appendChild(li);
    }
  }
}

var tocPlayer = null;

window.onload = (event) => {
  var selector = document.getElementById("audio-select");
  selector.oninput = (event) => {
    var source_file = event.target.value;
    if (source_file != "") {
      fetch(source_file)
        .then(response => response.json())
        .then(data => TocPlayer.create(data))
        .then(player => {
          tocPlayer = player;
        });
    }
  };

  var recognition = new webkitSpeechRecognition();
  var button = document.getElementById("rec_button");
  button.onclick = () => {
    recognition.start();
  };
  recognition.onresult = function(event) {
    if (event.results.length > 0) {
      var result = event.results[0][0].transcript;
      rec_result.value = result;
      if (result == "next") {
        tocPlayer.next();
      }
    }
  }
};
