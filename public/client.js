const black = "rgb(0, 0, 0)";

Array.prototype.popRandom =
  Array.prototype.popRandom ||
  function () {
    let i = Math.floor(Math.random() * this.length);
    return this.splice(i, 1)[0];
  };
String.prototype.formatString =
  String.prototype.formatString ||
  function () {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

function addToSidebar(text) {
  const elem = document.getElementById("sidebar");
  var temp = document.createElement("div");
  temp.innerHTML = "<div><span>{0}</span></div>".formatString(text);
  var newElem = temp.firstChild;
  elem.appendChild(newElem);
}
function lookupNodesByKeyValue(sigmaInstance, key, value) {
  return sigmaInstance.graph.nodes().filter((node) => node[key] === value);
}
function lookupNodeByKeyValue(sigmaInstance, key, value) {
  return lookupNodesByKeyValue(sigmaInstance, key, value).pop();
}
function lookupNodeById(value) {
  return lookupNodeByKeyValue(window._sigma, "id", String(value));
}
function setNodeColor(nodeId, newColor) {
  var node = lookupNodeById(nodeId);
  node.color = newColor;
  window._sigma.refresh();
}
function startGame() {
  const players = window.players;
  players.forEach((p) => {
    p.isPlayedByAI =
      document.getElementById("ai-select-{0}".formatString(p.id)).value == "1";
  });
  document.getElementById("sidebar").innerHTML = "";
  addToSidebar("Game log");
  addToSidebar("Randomizing start positions...");
  const detectiveStartingNodes = [
    44,
    58,
    32,
    92,
    66,
    14,
    39,
    71,
    105,
    42,
    135,
    158,
    170,
    167,
    182,
    165,
    124,
  ];
  const xStartingNodes = [45, 97, 50, 68, 86, 142, 156, 149, 146];
  players.forEach((p) => {
    if (p.role == "DETECTIVE") {
      p.location = lookupNodeById(detectiveStartingNodes.popRandom());
      setNodeColor(p.location.id, p.color);
    } else {
      p.location = lookupNodeById(xStartingNodes.popRandom());
    }
  });
  addToSidebar("Done! Game Starting...");
  mainLoop();
}
function xIsCaught() {
  return window.detectives
    .map((p) => p.location.id)
    .includes(window.X.location.id);
}

function getNextMove(player) {
  delete window.clickedNode;
  window.gameActive = true;
  const intervalId = setInterval(function () {
    let node = player.location;
    if (node.color === black && window.gameActive) {
      node.color = player.color;
    } else {
      node.color = black;
    }
    window._sigma.refresh();
  }, 1000);
  addToSidebar("Choose the new node to move to");
  return new Promise(function (resolve, reject) {
    (function waitForInput() {
      if ("clickedNode" in window) {
        window.gameActive = false;
        let move = window.clickedNode;
        delete window.clickedNode;
        if (validMove(player, move.id)) {
          setNodeColor(player.location.id, black);
          clearInterval(intervalId);
          return resolve(move);
        } else {
          window.gameActive = true;
          addToSidebar("Illegal move, choose again");
        }
      }
      setTimeout(waitForInput, 30);
    })();
  });
}
function validMove(player, move) {
  let ids = window._sigma.graph
    .neighborhood(player.location.id)
    .nodes.map((n) => n.id);
  return ids.includes(String(move));
}

function getGameState(turnCounter, playerToMove) {
  return {
    x: window.X,
    detectives: window.detectives,
    turnCounter: turnCounter,
    playerToMove: playerToMove,
  };
}

async function getMoveFromServer(gameState) {
  const url = "/move";
  const method = "POST";
  addToSidebar("Getting move from server...");
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (this.status >= 200) {
        addToSidebar("Success!");
        resolve(xhr.response);
      } else {
        addToSidebar(
          "Failed request to server: " +
            JSON.stringify({
              status: this.status,
              statusText: xhr.statusText,
            })
        );
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      addToSidebar(
        JSON.stringify({
          status: this.status,
          statusText: xhr.statusText,
        })
      );
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send(JSON.stringify(gameState));
  });
}
/**
 * Entry point for a new game
 */
async function mainLoop() {
  let turnCounter = 0;
  
  const detectives = window.detectives;
  const X = window.X;
  while (turnCounter <= 23 && !xIsCaught()) {
    turnCounter++;
    setNodeColor(X.location.id, black);
    addToSidebar("<b>Turn {0}</b>".formatString(turnCounter));
    //X move
    if (!X.isPlayedByAI) {
      addToSidebar(
        "<span style='color:{0};'>X turn! Current location:{1}</span>".formatString(
          X.color,
          X.location.id
        )
      );
      X.location = await getNextMove(X);
      setNodeColor(X.location.id, X.color);
    } else {
      addToSidebar(
        "<span style='color:{0};'>X turn!</span>".formatString(X.color)
      );
      let move = JSON.parse(
        await getMoveFromServer(getGameState(turnCounter, X))
      );
      X.location = lookupNodeById(move.id);
    }
    if (window.revealTurns.includes(turnCounter)) {
      addToSidebar(
        "<span style='color:{0};'>X</span> is revealed to the detectives! His location is {1}".formatString(
          X.color,
          X.location.id
        )
      );
      setNodeColor(X.location.id, X.color);
    } else {
      addToSidebar("X moved in secret");
      setNodeColor(X.location.id, black);
    }

    for (let p of detectives) {
      addToSidebar(
        "<span style='color:{0};'>Detective {1} turn! Current location:{2}</span>".formatString(
          p.color,
          p.id,
          p.location.id
        )
      );
      setNodeColor(p.location.id, black);
      if (!p.isPlayedByAI) {
        p.location = await getNextMove(p);
      } else {
        let move = JSON.parse(
          await getMoveFromServer(getGameState(turnCounter, p))
        );

        p.location = lookupNodeById(move.id);
      }
      setNodeColor(p.location.id, p.color);
      addToSidebar(
        "<span style='color:{0};'>Detective {1} moved to: {2}</span>".formatString(
          p.color,
          p.id,
          p.location.id
        )
      );
      p.taxiTickets--;
    }
  }
  if (xIsCaught()) addToSidebar("<b>Game Ended! Detectives won!</b>");
  else addToSidebar("<b>Game Ended! X won!</b>");
  addToSidebar("Refresh view for a new game");
}
