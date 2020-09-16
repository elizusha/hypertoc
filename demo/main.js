function load_player(data) {
    var player = document.getElementById("player");
    var list = document.getElementById("entry_list");

    for (entry of data["tocEntry"]) {
        console.log(entry["url"]);
        var element = document.createElement("a");
        element.setAttribute("href", "#");
        var text = document.createTextNode(entry["name"]);
        element.appendChild(text);
        element.onclick = () => {
            player.src = entry["url"];
            console.log(entry["url"]);
            player.play();
        }
        var li = document.createElement("li");
        li.appendChild(element);
        list.appendChild(li);
    }
}


window.onload = (event) => {
    fetch('../examples/1411.json')
        .then(response => response.json())
        .then(data => load_player(data));
};
