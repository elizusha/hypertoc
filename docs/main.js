class TocPlayer {
    constructor(data) {
        var count = 0;
        this.trackNumber = 0;
        this.player = document.getElementById("player");
        var list = document.getElementById("entry_list");
        list.innerHTML = "";
        this.tracks = [];
        var index = 0;
        for (var entry of data["tocEntry"]) {
            var element = document.createElement("a");
            element.setAttribute("href", "#");
            var text = document.createTextNode(entry["name"]);
            element.appendChild(text);
            let url = entry["url"];
            let start_offset = 0;
            let end_offset = 10000;
            if (!("url" in entry)) {
                url = data["assotiatedMedia"]["contentUrl"];
                start_offset = entry["startOffset"];
                end_offset = entry["endOffset"];
            }
            let currentTrackNumber = index;
            var func = () => {
                this.trackNumber = currentTrackNumber;
                let count_state = ++count;
                player.src = url;
                player.currentTime = start_offset;
                player.play().then(() => {
                    setTimeout(function () {
                        if (count_state == count) {
                            player.pause();
                        }
                    }, (end_offset - start_offset + 1) * 1000);
                });
            }
            this.tracks.push(func);
            element.onclick = func;
            index++;
            var li = document.createElement("li");
            li.appendChild(element);
            list.appendChild(li);
        }
    }

    playTrackByNumber(number) {
        this.tracks[number]();
    }

    next() {
        if (this.trackNumber + 1 < this.tracks.length) {
            this.tracks[this.trackNumber + 1]();
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
                .then(data => { tocPlayer = new TocPlayer(data); });
        }
    };

    var recognition = new webkitSpeechRecognition();
    var button = document.getElementById("rec_button");
    button.onclick = () => {
        tocPlayer.next();
    };
    //recognition.start();
    recognition.onresult = function (event) {
        if (event.results.length > 0) {
            q.value = event.results[0][0].transcript;
            console.log(event.results[0][0].transcript);
        }
    }
};

