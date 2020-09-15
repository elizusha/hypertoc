window.onload = (event) => {
    var player = document.getElementById("player");

    var element = document.getElementById("item1");
    element.innerHTML = "<a href=\"#\">Christmas At Red Butte</a>";
    element.onclick = () => {
        player.src = "http://www.archive.org/download/firesidechristmasstories_1312_librivox/firesidechristmas_01_christmasatredbutte_montgomery_lt_64kb.mp3";
        player.play();
    }

    var element = document.getElementById("item2");
    element.innerHTML = "<a href=\"#\">The Heavenly Christmas Tree</a>";
    element.onclick = () => {
        player.src = "http://www.archive.org/download/firesidechristmasstories_1312_librivox/firesidechristmas_02_heavenlychristmastree_dostoyevski_rf_64kb.mp3";
        player.play();
    }
};