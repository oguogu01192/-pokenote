const NATURES = {
  "さみしがり": { up: "a", down: "b" },
  "いじっぱり": { up: "a", down: "c" },
  "やんちゃ": { up: "a", down: "d" },
  "ゆうかん": { up: "a", down: "s" },

  "ずぶとい": { up: "b", down: "a" },
  "わんぱく": { up: "b", down: "c" },
  "のうてんき": { up: "b", down: "d" },
  "のんき": { up: "b", down: "s" },

  "ひかえめ": { up: "c", down: "a" },
  "おっとり": { up: "c", down: "b" },
  "うっかりや": { up: "c", down: "d" },
  "れいせい": { up: "c", down: "s" },

  "おだやか": { up: "d", down: "a" },
  "おとなしい": { up: "d", down: "b" },
  "しんちょう": { up: "d", down: "c" },
  "なまいき": { up: "d", down: "s" },

  "おくびょう": { up: "s", down: "a" },
  "せっかち": { up: "s", down: "b" },
  "ようき": { up: "s", down: "c" },
  "むじゃき": { up: "s", down: "d" },
  "まじめ": { up: "", down: "" }
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