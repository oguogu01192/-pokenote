const NATURES = {
  "ようき": { up: "s", down: "c" },
  "いじっぱり": { up: "a", down: "c" },
  "ひかえめ": { up: "c", down: "a" },
  "おくびょう": { up: "s", down: "a" },
  "ずぶとい": { up: "b", down: "a" },
  "わんぱく": { up: "b", down: "c" },
  "しんちょう": { up: "d", down: "c" },
  "おだやか": { up: "d", down: "a" }
};
function $(id) {
  return document.getElementById(id);
}
function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}
function calcStat(stat, ev, statName, nature, isHP=false) {

  let result = stat + ev + (isHP ? 75 : 20);

  if (!isHP && nature && NATURES[nature]) {

    if (NATURES[nature].up === statName) {
      result = Math.floor(result * 1.1);
    }

    if (NATURES[nature].down === statName) {
      result = Math.floor(result * 0.9);
    }
  }

  return result;
}