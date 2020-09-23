class TocEntry {
    constructor(data, entry) {
        this.url = entry["url"] || data["associatedMedia"]["contentUrl"];
        this.startOffset = entry["startOffset"] || 0;
        this.endOffset = entry["endOffset"] || null;
        this.name = entry["name"];
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
                setTimeout(function () {
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
        var entries = [];
        for (var entry of data["tocEntry"]) {
            entries.push(new TocEntry(data, entry));
        }
        return entries;
    }

    createHtml(entries) {
        var list = document.getElementById("entry_list");
        list.innerHTML = "";

        for (let i = 0; i < entries.length; i++) {
            var element = document.createElement("a");
            element.setAttribute("href", "#");
            var text = document.createTextNode(entries[i].name);
            element.appendChild(text);

            element.onclick = () => {
                this.playTrackByNumber(i);
            }
            var li = document.createElement("li");
            li.appendChild(element);
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
                .then(player => { tocPlayer = player; });
        }
    };

    var recognition = new webkitSpeechRecognition();
    var button = document.getElementById("rec_button");
    button.onclick = () => {
        recognition.start();
    };
    recognition.onresult = function (event) {
        if (event.results.length > 0) {
            var result = event.results[0][0].transcript;
            rec_result.value = result;
            if (result == "next") {
                tocPlayer.next();
            }
        }
    }
};
