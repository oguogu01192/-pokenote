let party = [];
let editIndex = null;

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
    selected: document.getElementById("selected").checked,
    types: [
      document.getElementById("type1").value,
      document.getElementById("type2").value
    ],
    item: document.getElementById("item").value,
    nature: document.getElementById("nature").value,
    moves: [1, 2, 3, 4].map(num =>
      document.getElementById("move" + num).value
    )
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

function deletePokemon(index) {
  party.splice(index, 1);
  render();
}

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
  document.getElementById("type1").value = p.types?.[0] || "";
  document.getElementById("type2").value = p.types?.[1] || "";
  document.getElementById("item").value = p.item || "";
  document.getElementById("nature").value = p.nature || "";
  for (let i = 1; i <= 4; i++) {
    document.getElementById("move" + i).value = p.moves?.[i - 1] || "";
    updateMovePP(i);
  }

  editIndex = index;
}

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

    let html = `<div class="pokemon">`;
    html += `${i + 1}. ${p.name}<br>`;

    if (normal) {
      html += `通常：
      [H${calcStat(normal.h, p.ev.h, true)}
       A${calcStat(normal.a, p.ev.a)}
       B${calcStat(normal.b, p.ev.b)}
       C${calcStat(normal.c, p.ev.c)}
       D${calcStat(normal.d, p.ev.d)}
       S${calcStat(normal.s, p.ev.s)}]<br>`;
    }

    if (mega) {
      html += `メガ：
      [H${calcStat(mega.h, p.ev.h, true)}
       A${calcStat(mega.a, p.ev.a)}
       B${calcStat(mega.b, p.ev.b)}
       C${calcStat(mega.c, p.ev.c)}
       D${calcStat(mega.d, p.ev.d)}
       S${calcStat(mega.s, p.ev.s)}]<br>`;
    }

html += `努力値：
[H${p.ev.h} A${p.ev.a} B${p.ev.b} C${p.ev.c} D${p.ev.d} S${p.ev.s}]
${p.selected ? '<span style="color:yellow;">★選出</span>' : ""}<br>`;

    const typeText = (p.types || []).filter(type => type).join(" / ");

    if (typeText) {
      html += `タイプ：${typeText}<br>`;
    }

    if (p.item) {
      html += `持ち物：${p.item}<br>`;
    }
    if (p.nature) {
     html += `性格：${p.nature}<br>`;
    }
    const moveText = (p.moves || []).filter(move => move).join(" / ");

    if (moveText) {
      html += `技：${moveText}<br>`;
    }

    html += `
      <button onclick="editPokemon(${i})">編集</button>
      <button onclick="deletePokemon(${i})">削除</button>
    `;

    html += `</div>`;

    list.innerHTML += html;
  });
}

function saveParty() {
  localStorage.setItem("myParty", JSON.stringify(party));
  alert("保存した！");
}

let battleParty = [];

function updateMyActive() {
  const checked = document.querySelector('input[name="myActive"]:checked');
  const display = document.getElementById("myActive");

  if (!display) return;

  if (!checked) {
    display.textContent = "自分：未選択";
    if (typeof updateDamageCalc === "function") updateDamageCalc();
    return;
  }

  const pokemon = battleParty[Number(checked.value)];

  display.textContent = `自分：${pokemon?.name || "未入力"}`;
  if (typeof updateDamageCalc === "function") updateDamageCalc();
}

function loadBattleParty() {
  const data = localStorage.getItem("myParty");

  if (!data) return;

  const party = JSON.parse(data);
  battleParty = party.filter(p => p.selected).slice(0, 3);

  renderBattleParty();
}

function renderBattleParty() {
  const div = document.getElementById("myParty");

  if (!div) return;

  div.innerHTML = "";

  battleParty.forEach((p, i) => {
    let normalName = p.name;
    let megaName = null;

    if (p.name.startsWith("メガ")) {
      normalName = p.name.replace("メガ", "");
      megaName = p.name;
    }

    const normal = baseStats[normalName];
    const mega = baseStats[megaName];
    const stats = mega || normal;
    const typeText = (p.types || []).filter(type => type).join(" / ");
    const moveText = (p.moves || []).filter(move => move).join(" / ");

    let html = `<div class="battle-pokemon">`;
    html += `${i + 1}. ${p.name}<br>`;
    html += `
    <label>
      <input type="radio" name="myActive" value="${i}" onchange="updateMyActive()">
      今出ている
    </label><br>`;

    if (typeText) {
      html += `タイプ：${typeText}<br>`;
    }

    if (p.item) {
      html += `持ち物：${p.item}<br>`;
    }

    if (stats) {
      html += `実数値：
      [H${calcStat(stats.h, p.ev.h, true)}
       A${calcStat(stats.a, p.ev.a)}
       B${calcStat(stats.b, p.ev.b)}
       C${calcStat(stats.c, p.ev.c)}
       D${calcStat(stats.d, p.ev.d)}
       S${calcStat(stats.s, p.ev.s)}]<br>`;
    }

    if (moveText) {
      html += `技：${moveText}<br>`;
    }

    html += `</div>`;

    div.innerHTML += html;
  });

  updateMyActive();
}

window.addEventListener("load", () => {
  const data = localStorage.getItem("myParty");

  if (data) {
    party = JSON.parse(data);

    if (document.getElementById("partyList")) {
      render();
    }
  }

  if (document.getElementById("myParty")) {
    loadBattleParty();
  }
});
