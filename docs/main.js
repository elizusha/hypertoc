function load_player(data) {
    var player = document.getElementById("player");
    var list = document.getElementById("entry_list");
    list.innerHTML = "";
    for (entry of data["tocEntry"]) {
        var element = document.createElement("a");
        element.setAttribute("href", "#");
        var text = document.createTextNode(entry["name"]);
        element.appendChild(text);
        let url = entry["url"];
        let start_offset = 0;
        if (!("url" in entry)) {
            url = data["assotiatedMedia"]["contentUrl"];
            start_offset = entry["startOffset"];
            end_offset = entry["endOffset"];
        }
        element.onclick = () => {
            player.src = url;
            player.currentTime = start_offset;
            player.play();
        }
        var li = document.createElement("li");
        li.appendChild(element);
        list.appendChild(li);
    }
}


window.onload = (event) => {
    var selector = document.getElementById("audio-select");
    selector.oninput = (event) => {
        var source_file = event.target.value;
        if (source_file != "") {
            fetch(source_file)
            .then(response => response.json())
            .then(data => load_player(data));
        }
    };
};

