let party = [];
let editIndex = null;

// 追加 or 更新
function addOrUpdate() {
  const pokemon = {
    name: document.getElementById("name").value,
    ev: {
      h: Number(document.getElementById("h").value),
      a: Number(document.getElementById("a").value),
      b: Number(document.getElementById("b").value),
      c: Number(document.getElementById("c").value),
      d: Number(document.getElementById("d").value),
      s: Number(document.getElementById("s").value),
    },
    selected: document.getElementById("selected").checked
  };

  if (editIndex === null) {
    if (party.length >= 6) {
      alert("6体まで！");
      return;
    }
    party.push(pokemon);
  } else {
    party[editIndex] = pokemon;
    editIndex = null;
  }

  clearForm();
  render();
}

// 削除
function deletePokemon(index) {
  party.splice(index, 1);
  render();
}

function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

function updateSuggestions() {
  const input = document.getElementById("name").value;
  const box = document.getElementById("suggestions");

  box.innerHTML = "";

  if (!input) return;

  const hiraInput = toHiragana(input);

  const keys = Object.keys(baseStats);

  const results = keys.filter(name => {
    const hiraName = toHiragana(name);
    return hiraName.includes(hiraInput);
  });

  // より一致してる順に並べる
  results.sort((a, b) => {
    return toHiragana(a).indexOf(hiraInput) - toHiragana(b).indexOf(hiraInput);
  });

  results.slice(0, 10).forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.className = "suggest-item";

    div.onclick = () => {
      document.getElementById("name").value = name;
      box.innerHTML = "";
      updateStats();
    };

    box.appendChild(div);
  });
}

let currentPP = {
  1: 0,
  2: 0,
  3: 0,
  4: 0
};
function updateMovePP(num) {
  const name = document.getElementById("move" + num).value;
  const data = moves[name];

  if (data) {
    currentPP[num] = data.pp;
    document.getElementById("pp" + num).textContent = data.pp;
  }
}
function useMove(num) {
  if (currentPP[num] > 0) {
    currentPP[num]--;
    document.getElementById("pp" + num).textContent = currentPP[num];
  }
}
let wPressed = false;

document.addEventListener("keydown", function(e) {

  if (e.key === "w") {
    wPressed = true;
  }

  if (wPressed) {
    if (e.key === "1") useMove(1);
    if (e.key === "2") useMove(2);
    if (e.key === "3") useMove(3);
    if (e.key === "4") useMove(4);
  }
});

document.addEventListener("keyup", function(e) {
  if (e.key === "w") {
    wPressed = false;
  }
});
function updateMove() {
  const name = document.getElementById("move").value;
  const data = moves[name];

  if (data) {
    document.getElementById("power").textContent = data.power;
    document.getElementById("pp").textContent = data.pp;
    document.getElementById("effect").textContent = data.effect;
  } else {
    document.getElementById("power").textContent = "-";
    document.getElementById("pp").textContent = "-";
    document.getElementById("effect").textContent = "-";
  }
}
function updateMoveSuggestionsSingle() {
  const input = document.getElementById("move").value;
  const box = document.getElementById("moveSuggestions");

  box.innerHTML = "";
  if (!input) return;

  const hiraInput = toHiragana(input);

  Object.keys(moves)
    .filter(name => toHiragana(name).includes(hiraInput))
    .slice(0, 10)
    .forEach(name => {
      const div = document.createElement("div");
      div.textContent = name;
      div.className = "suggest-item";

      div.onclick = () => {
        document.getElementById("move").value = name;
        box.innerHTML = "";
        updateMove();
      };

      box.appendChild(div);
    });
}
function updateMoveSuggestions(num) {
  const input = document.getElementById("move"+num).value;
  const box = document.getElementById("moveSuggestions"+num);

  box.innerHTML = "";

  if (!input) return;

  const hiraInput = toHiragana(input);

  const keys = Object.keys(moves);

  const results = keys.filter(name => {
    return toHiragana(name).includes(hiraInput);
  });

    results.sort((a, b) => {
    return toHiragana(a).indexOf(hiraInput) - toHiragana(b).indexOf(hiraInput);
  });

  results.slice(0, 10).forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.className = "suggest-item";

    div.onclick = () => {
      document.getElementById("move"+num).value = name;
      box.innerHTML = "";
      updateMovePP(num);
    };

    box.appendChild(div);
  });
}

// 編集
function editPokemon(index) {
  const p = party[index];

  document.getElementById("name").value = p.name;
  document.getElementById("h").value = p.ev.h;
  document.getElementById("a").value = p.ev.a;
  document.getElementById("b").value = p.ev.b;
  document.getElementById("c").value = p.ev.c;
  document.getElementById("d").value = p.ev.d;
  document.getElementById("s").value = p.ev.s;
  document.getElementById("selected").checked = p.selected;

  editIndex = index;
}

// 表示
function render() {
  const list = document.getElementById("partyList");
  list.innerHTML = "";

  party.forEach((p, i) => {

    let normalName = p.name;
    let megaName = null;

    if (p.name.startsWith("メガ")) {
      normalName = p.name.replace("メガ", "");
      megaName = p.name;
    }

    const normal = baseStats[normalName];
    const mega = baseStats[megaName];

    // 実数値計算関数
    function calc(stat, ev, isHP=false) {
      return stat + ev + (isHP ? 75 : 20);
    }

    let html = `<div class="pokemon">`;
    html += `${i + 1}. ${p.name}<br>`;

    // 通常
    if (normal) {
      html += `通常：
      [H${calc(normal.h, p.ev.h, true)}
       A${calc(normal.a, p.ev.a)}
       B${calc(normal.b, p.ev.b)}
       C${calc(normal.c, p.ev.c)}
       D${calc(normal.d, p.ev.d)}
       S${calc(normal.s, p.ev.s)}]<br>`;
    }

    // メガ
    if (mega) {
      html += `メガ：
      [H${calc(mega.h, p.ev.h, true)}
       A${calc(mega.a, p.ev.a)}
       B${calc(mega.b, p.ev.b)}
       C${calc(mega.c, p.ev.c)}
       D${calc(mega.d, p.ev.d)}
       S${calc(mega.s, p.ev.s)}]<br>`;
    }

    html += `努力値：
    [H${p.ev.h} A${p.ev.a} B${p.ev.b} C${p.ev.c} D${p.ev.d} S${p.ev.s}]
    ${p.selected ? "★選出" : ""}<br>`;

    html += `
      <button onclick="editPokemon(${i})">編集</button>
      <button onclick="deletePokemon(${i})">削除</button>
    `;

    html += `</div>`;

    list.innerHTML += html;
  });
}

// 保存
function saveParty() {
  localStorage.setItem("myParty", JSON.stringify(party));
  alert("保存した！");
}
let battleParty = [];

function loadBattleParty() {
  const data = localStorage.getItem("myParty");

  if (!data) return;

  const party = JSON.parse(data);

  // 選出だけ取り出す
  battleParty = party.filter(p => p.selected).slice(0,3);

  renderBattleParty();
}
function renderBattleParty() {
  const div = document.getElementById("myParty");

if (!div) return;

  div.innerHTML = "";

  battleParty.forEach((p, i) => {
    div.innerHTML += `
      <div>
        ${i+1}. ${p.name}
      </div>
    `;
  });
}
window.addEventListener("load", () => {
  const data = localStorage.getItem("myParty");

  if (data) {
    party = JSON.parse(data);
    render();
  }

  if (document.getElementById("myParty")) {
    loadBattleParty();
  }
});
// フォーム初期化
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("h").value = 0;
  document.getElementById("a").value = 0;
  document.getElementById("b").value = 0;
  document.getElementById("c").value = 0;
  document.getElementById("d").value = 0;
  document.getElementById("s").value = 0;
  document.getElementById("selected").checked = false;
}

function updateStats() {
  const input = document.getElementById("name").value;

  let normalName = input;
  let megaName = null;

  // メガ判定
  if (input.startsWith("メガ")) {
    normalName = input.replace("メガ", "");
    megaName = input;
  }

  const normal = baseStats[normalName];
  const mega = baseStats[megaName];

  // 努力値
  const h = Number(document.getElementById("h").value);
  const a = Number(document.getElementById("a").value);
  const b = Number(document.getElementById("b").value);
  const c = Number(document.getElementById("c").value);
  const d = Number(document.getElementById("d").value);
  const s = Number(document.getElementById("s").value);
  // メガがない場合リセット
  if (!mega) {
  ["bh2","ba2","bb2","bc2","bd2","bs2",
   "rh2","ra2","rb2","rc2","rd2","rs2"]
   .forEach(id => document.getElementById(id).textContent = "-");
  }
  // 通常表示
  if (normal) {
    document.getElementById("bh1").textContent = normal.h;
    document.getElementById("ba1").textContent = normal.a;
    document.getElementById("bb1").textContent = normal.b;
    document.getElementById("bc1").textContent = normal.c;
    document.getElementById("bd1").textContent = normal.d;
    document.getElementById("bs1").textContent = normal.s;

    document.getElementById("rh1").textContent = normal.h + h + 75;
    document.getElementById("ra1").textContent = normal.a + a + 20;
    document.getElementById("rb1").textContent = normal.b + b + 20;
    document.getElementById("rc1").textContent = normal.c + c + 20;
    document.getElementById("rd1").textContent = normal.d + d + 20;
    document.getElementById("rs1").textContent = normal.s + s + 20;
  }

  // メガ表示
  if (mega) {
    document.getElementById("bh2").textContent = mega.h;
    document.getElementById("ba2").textContent = mega.a;
    document.getElementById("bb2").textContent = mega.b;
    document.getElementById("bc2").textContent = mega.c;
    document.getElementById("bd2").textContent = mega.d;
    document.getElementById("bs2").textContent = mega.s;

    document.getElementById("rh2").textContent = mega.h + h + 75;
    document.getElementById("ra2").textContent = mega.a + a + 20;
    document.getElementById("rb2").textContent = mega.b + b + 20;
    document.getElementById("rc2").textContent = mega.c + c + 20;
    document.getElementById("rd2").textContent = mega.d + d + 20;
    document.getElementById("rs2").textContent = mega.s + s + 20;
  }
}
let enemyPP = {};
function updateEnemyMove(trainer, slot) {

  const moveName =
    document.getElementById(
      `enemy${trainer}move${slot}`
    ).value;

  const data = moves[moveName];

  if (!data) return;

  enemyPP[`${trainer}-${slot}`] = data.pp;

  document.getElementById(
    `enemy${trainer}pp${slot}`
  ).textContent = data.pp;
}
function useEnemyMove(trainer, slot) {

  const key = `${trainer}-${slot}`;

  if (enemyPP[key] > 0) {
    enemyPP[key]--;

    document.getElementById(
      `enemy${trainer}pp${slot}`
    ).textContent = enemyPP[key];
  }
}
function resetEnemy() {

  // 名前
  for (let i=1;i<=3;i++) {

    document.getElementById(`enemy${i}`).value = "";

    document.getElementById(`enemyMemo${i}`).value = "";

    for (let j=1;j<=4;j++) {

      document.getElementById(
        `enemy${i}move${j}`
      ).value = "";

      document.getElementById(
        `enemy${i}pp${j}`
      ).textContent = "-";
    }
  }

  // 相手6匹
  for (let i=1;i<=6;i++) {
    document.getElementById(
      `enemyParty${i}`
    ).value = "";
  }

  enemyPP = {};
}
function updateEnemySuggestions(num) {

  const input = document.getElementById("enemy" + num).value;
  const box = document.getElementById("enemySuggestions" + num);

  box.innerHTML = "";

  if (!input) return;

  const hiraInput = toHiragana(input);

  const results = Object.keys(baseStats).filter(name => {
    return toHiragana(name).includes(hiraInput);
  });

  results.sort((a,b) => {
    return toHiragana(a).indexOf(hiraInput)
         - toHiragana(b).indexOf(hiraInput);
  });

  results.slice(0,10).forEach(name => {

    const div = document.createElement("div");

    div.textContent = name;
    div.className = "suggest-item";

    div.onclick = () => {
      document.getElementById("enemy" + num).value = name;
      box.innerHTML = "";
    };

    box.appendChild(div);

  });
}
function updateEnemyMoveSuggestions(pokeNum, moveNum) {

  const input =
    document.getElementById(
      `enemy${pokeNum}move${moveNum}`
    ).value;

  const box =
    document.getElementById(
      `enemyMoveSuggestions${pokeNum}_${moveNum}`
    );

  box.innerHTML = "";

  if (!input) return;

  const hiraInput = toHiragana(input);

  const results = Object.keys(moves).filter(name => {
    return toHiragana(name).includes(hiraInput);
  });

  results.sort((a,b) => {
    return toHiragana(a).indexOf(hiraInput)
         - toHiragana(b).indexOf(hiraInput);
  });

  results.slice(0,10).forEach(name => {

    const div = document.createElement("div");

    div.textContent = name;
    div.className = "suggest-item";

    div.onclick = () => {

      document.getElementById(
        `enemy${pokeNum}move${moveNum}`
      ).value = name;

      box.innerHTML = "";
    };

    box.appendChild(div);

  });
}