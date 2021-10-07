// bootstrap qw from runeappslib.js since minimap.js uses it
qw = function(){};

var playerDot = null;
ImageData.fromBase64(function (result) { 
    playerDot = result; 
}, "iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZSURBVBhXY/wPBAxA8OPHDwYmGOPF8xcMAKjtDIfDZqDRAAAAAElFTkSuQmCC");

var minimapReader = new MinimapReader();
var minimap = null;

var minimapRefreshInterval = 500;
var playerFinderInterval = 200;
function colorMix(r, g, b, a)
{
    return a1lib.mixcolor(r, g, b, a);
}
var Status = {
    STARTING: {
        id: "STARTING",
        text: "Starting...",
        class: "paused"
    },
    PAUSED: {
        id: "PAUSED",
        text: "Paused",
        class: "paused"
    },
    RUNNING: {
        id: "RUNNING",
        text: "OK",
        class: "ok"
    },
    ALERT: {
        id: "ALERT",
        text: "PLAYERS DETECTED!",
        class: "alert"
    }
};

var status = Status.PAUSED.id;

var statusText = null;
var container = null;
var stateButton = null;

function start() {
    statusText = document.getElementById("status");

    if (!window.alt1) {
        statusText.innerText = "Alt1 not detected!";
        return false;
    }
    
    container = document.getElementById("container");
    stateButton = document.getElementById("state-button");
    
    setStatus(Status.STARTING);

    findMinimap();
    setInterval(function() {
        findMinimap();
    }, minimapRefreshInterval);

    setInterval(function() {
        if (!minimap || status == Status.PAUSED.id) {
            return;
        }

        var minimapRegion = a1lib.getregion(minimap.x, minimap.y, minimap.w, minimap.h);
        var players = findPlayers(minimapRegion);
        setStatus(players > 0 ? Status.ALERT : Status.RUNNING);
    }, playerFinderInterval);
}

function changeState() {
    if (window.status != Status.PAUSED.id) {
        setStatus(Status.PAUSED);
    } else {
        setStatus(Status.RUNNING);
    }
}

function setStatus(status) {
    if (statusText) {
        statusText.innerText = status.text;
    }
    if (container) {
        container.className = status.class;
    }

    if (stateButton) {
        var stateButtonText = status.id == Status.PAUSED.id ? "Start" : "Pause";
        stateButton.innerText = stateButtonText;
    }

    window.status = status.id;
}

function findPlayers(minimapRegion) {
    if (!minimap) {
        return 0;
    }
    var res =  a1lib.findsubimg(minimapRegion, playerDot);
    for(let i = 0; i <res.length; i++){ 
        let posx = minimap.x + res[i].x;
        let posy =  minimap.y +res[i].y;
        alt1.overLayLine(a1lib.mixcolor(255, 0, 0, 255), 2, posx-3, posy-3, posx+3, posy+3, 1000);
        alt1.overLayLine(a1lib.mixcolor(0, 255, 0, 255), 2, posx+3, posy-3, posx-3, posy+3, 1000);
    }
    return res.length;
}

function findMinimap() {
    minimap = minimapReader.find();
}a
