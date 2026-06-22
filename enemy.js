let enemyPP = {};

function renderEnemyPartyInputs() {
  const list = document.getElementById("enemyPartyList");
  if (!list) return;

  list.innerHTML = "";

  for (let i = 1; i <= 6; i++) {
    let movesHtml = "";

    for (let j = 1; j <= 4; j++) {
      movesHtml += `
        <div class="enemy-move-row">
          <span>技${j}</span>
          <input type="text" id="enemy${i}move${j}" oninput="updateEnemyMove(${i},${j}); updateEnemyMoveSuggestions(${i},${j})">
          <span>PP:<span id="enemy${i}pp${j}">-</span></span>
          <button type="button" onclick="useEnemyMove(${i},${j})">使用</button>
          <div id="enemyMoveSuggestions${i}_${j}" class="enemy-move-suggestions"></div>
        </div>
      `;
    }

    list.innerHTML += `
      <div class="enemy-party-card">
        <div class="enemy-card-header">
          <h3>相手${i}</h3>
          <label>
            <input type="radio" name="enemyActive" value="${i}" onchange="updateEnemyActive()">
            今出ている
          </label>
        </div>

        <div class="enemy-name-row">
          <span>名前</span>
          <input type="text" id="enemy${i}" oninput="updateEnemySuggestions(${i}); updateEnemyStats(${i})">
          <button type="button" onclick="toggleEnemyMoves(${i})">技・PP</button>
        </div>
        <div id="enemyStats${i}" class="enemy-stats"></div>
        <div id="enemySuggestions${i}" class="enemy-suggestions"></div>

        <div id="enemyMoves${i}" class="enemy-moves" hidden>
          ${movesHtml}
          <textarea id="enemyMemo${i}" placeholder="メモ"></textarea>
        </div>
      </div>
    `;
  }
}

function toggleEnemyMoves(num) {
  const box = document.getElementById(`enemyMoves${num}`);
  if (!box) return;
  box.hidden = !box.hidden;
}
function updateEnemyMove(trainer, slot) {

  const moveName =
    document.getElementById(
      `enemy${trainer}move${slot}`
    ).value;

  const data = moves[moveName];

  if (!data) {
    document.getElementById(
      `enemy${trainer}pp${slot}`
    ).textContent = "-";
    if (typeof updateDamageCalc === "function") updateDamageCalc();
    return;
  }

  enemyPP[`${trainer}-${slot}`] = data.pp;

  document.getElementById(
    `enemy${trainer}pp${slot}`
  ).textContent = data.pp;
  if (typeof updateDamageCalc === "function") updateDamageCalc();
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
  for (let i=1;i<=6;i++) {

    document.getElementById(`enemy${i}`).value = "";

    const memo = document.getElementById(`enemyMemo${i}`);
    if (memo) memo.value = "";

    for (let j=1;j<=4;j++) {

      document.getElementById(
        `enemy${i}move${j}`
      ).value = "";

      document.getElementById(
        `enemy${i}pp${j}`
      ).textContent = "-";
    }

    document.getElementById(`enemyStats${i}`).textContent = "";
    document.getElementById(`enemySuggestions${i}`).innerHTML = "";
  }
  const checked = document.querySelector('input[name="enemyActive"]:checked');
  if (checked) checked.checked = false;
  updateEnemyActive();

  enemyPP = {};
}
function updateEnemyActive() {
  const checked = document.querySelector('input[name="enemyActive"]:checked');
  const display = document.getElementById("enemyActiveDisplay");

  if (!display) return;

  if (!checked) {
    display.textContent = "相手：未選択";
    if (typeof updateDamageCalc === "function") updateDamageCalc();
    return;
  }

  const num = checked.value;
  const name = document.getElementById("enemy" + num).value;

  display.textContent = `相手：${name || "未入力"}`;
  if (typeof updateDamageCalc === "function") updateDamageCalc();
}
function updateEnemyStats(num) {
  const name = document.getElementById("enemy" + num).value;
  const box = document.getElementById("enemyStats" + num);

  if (!box) return;

  const stats = baseStats[name];

  if (!stats) {
    box.textContent = "";
    updateEnemyActive();
    return;
  }

  // メガポケモン判定
  if (name.startsWith("メガ")) {

    const normalName = name.replace("メガ", "");
    const normalStats = baseStats[normalName];

    if (normalStats) {
      box.innerHTML =
        `通常：H${normalStats.h} A${normalStats.a} B${normalStats.b} C${normalStats.c} D${normalStats.d} S${normalStats.s}<br>` +
        `メガ：H${stats.h} A${stats.a} B${stats.b} C${stats.c} D${stats.d} S${stats.s}`;

      updateEnemyActive();
      return;
    }
  }

  box.textContent =
    `種族値：H${stats.h} A${stats.a} B${stats.b} C${stats.c} D${stats.d} S${stats.s}`;

  updateEnemyActive();
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
      updateEnemyStats(num);
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

     updateEnemyMove(pokeNum, moveNum);
     box.innerHTML = "";
    };


    box.appendChild(div);

  });
}

window.addEventListener("load", renderEnemyPartyInputs);
