//ダメージ計算関連
const TYPE_CHART = {
  "ノーマル": { "いわ": 0.5, "ゴースト": 0, "はがね": 0.5 },
  "ほのお": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 2, "むし": 2, "いわ": 0.5, "ドラゴン": 0.5, "はがね": 2 },
  "みず": { "ほのお": 2, "みず": 0.5, "くさ": 0.5, "じめん": 2, "いわ": 2, "ドラゴン": 0.5 },
  "でんき": { "みず": 2, "でんき": 0.5, "くさ": 0.5, "じめん": 0, "ひこう": 2, "ドラゴン": 0.5 },
  "くさ": { "ほのお": 0.5, "みず": 2, "くさ": 0.5, "どく": 0.5, "じめん": 2, "ひこう": 0.5, "むし": 0.5, "いわ": 2, "ドラゴン": 0.5, "はがね": 0.5 },
  "こおり": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 0.5, "じめん": 2, "ひこう": 2, "ドラゴン": 2, "はがね": 0.5 },
  "かくとう": { "ノーマル": 2, "こおり": 2, "どく": 0.5, "ひこう": 0.5, "エスパー": 0.5, "むし": 0.5, "いわ": 2, "ゴースト": 0, "あく": 2, "はがね": 2, "フェアリー": 0.5 },
  "どく": { "くさ": 2, "どく": 0.5, "じめん": 0.5, "いわ": 0.5, "ゴースト": 0.5, "はがね": 0, "フェアリー": 2 },
  "じめん": { "ほのお": 2, "でんき": 2, "くさ": 0.5, "どく": 2, "ひこう": 0, "むし": 0.5, "いわ": 2, "はがね": 2 },
  "ひこう": { "でんき": 0.5, "くさ": 2, "かくとう": 2, "むし": 2, "いわ": 0.5, "はがね": 0.5 },
  "エスパー": { "かくとう": 2, "どく": 2, "エスパー": 0.5, "あく": 0, "はがね": 0.5 },
  "むし": { "ほのお": 0.5, "くさ": 2, "かくとう": 0.5, "どく": 0.5, "ひこう": 0.5, "エスパー": 2, "ゴースト": 0.5, "あく": 2, "はがね": 0.5, "フェアリー": 0.5 },
  "いわ": { "ほのお": 2, "こおり": 2, "かくとう": 0.5, "じめん": 0.5, "ひこう": 2, "むし": 2, "はがね": 0.5 },
  "ゴースト": { "ノーマル": 0, "エスパー": 2, "ゴースト": 2, "あく": 0.5 },
  "ドラゴン": { "ドラゴン": 2, "はがね": 0.5, "フェアリー": 0 },
  "あく": { "かくとう": 0.5, "エスパー": 2, "ゴースト": 2, "あく": 0.5, "フェアリー": 0.5 },
  "はがね": { "ほのお": 0.5, "みず": 0.5, "でんき": 0.5, "こおり": 2, "いわ": 2, "はがね": 0.5, "フェアリー": 2 },
  "フェアリー": { "ほのお": 0.5, "かくとう": 2, "どく": 0.5, "ドラゴン": 2, "あく": 2, "はがね": 0.5 }
};

const MAX_INVEST = 32;
const DAMAGE_LEVEL = 50;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTypesFromBase(name) {
  return (baseStats[name]?.types || []).filter(type => type);
}

function getSavedPokemonTypes(pokemon) {
  const savedTypes = (pokemon?.types || []).filter(type => type);
  return savedTypes.length ? savedTypes : getTypesFromBase(pokemon?.name);
}

function makeStats(base, ev = {}, nature = "") {
  return {
    h: calcStat(base.h, ev.h || 0, "h", nature, true),
    a: calcStat(base.a, ev.a || 0, "a", nature),
    b: calcStat(base.b, ev.b || 0, "b", nature),
    c: calcStat(base.c, ev.c || 0, "c", nature),
    d: calcStat(base.d, ev.d || 0, "d", nature),
    s: calcStat(base.s, ev.s || 0, "s", nature)
  };
}

function getSavedPokemonStats(pokemon) {
  const base = baseStats[pokemon?.name];
  if (!base) return null;
return makeStats(
  base,
  pokemon.ev || {},
  pokemon.nature || ""
);
}

function getMyActivePokemon() {
  const checked = document.querySelector('input[name="myActive"]:checked');
  if (!checked) return null;
  return battleParty[Number(checked.value)] || null;
}

function getEnemyActivePokemon() {
  const checked = document.querySelector('input[name="enemyActive"]:checked');
  if (!checked) return null;

  return getEnemyPokemon(checked.value, true);
}

function getEnemyPokemon(num, includeMoves = false) {
  const input = document.getElementById("enemy" + num);
  if (!input) return null;

  const name = input.value;
  const base = baseStats[name];

  if (!name || !base) return { num, name, base: null, moves: [] };

  const enemyMoves = includeMoves
    ? [1, 2, 3, 4].map(slot =>
        document.getElementById(`enemy${num}move${slot}`)?.value || ""
      )
    : [];

  return {
    num,
    name,
    base,
    moves: enemyMoves,
    types: getTypesFromBase(name)
  };
}

function getEnemyPartyPokemon() {
  return Array.from({ length: 6 }, (_, index) => getEnemyPokemon(index + 1, true))
    .filter(pokemon => pokemon && pokemon.base);
}

function typeMultiplier(moveType, defenderTypes) {
  return defenderTypes.reduce((multiplier, type) => {
    return multiplier * (TYPE_CHART[moveType]?.[type] ?? 1);
  }, 1);
}

function getOptionValue(id, fallback = "なし") {
  const value = document.getElementById(id)?.value?.trim();
  return value || fallback;
}

function getRankValue(id) {
  const value = Number(document.getElementById(id)?.value || 0);
  return Math.max(-6, Math.min(6, value));
}

function getBattleOptions() {
  return {
    field: getOptionValue("field"),
    weather: getOptionValue("weather"),
    critical: document.getElementById("critical")?.checked || false,
    abilities: {
      my: getOptionValue("myAbility"),
      enemy: getOptionValue("enemyAbility")
    },
    items: {
      myOverride: getOptionValue("myItemOverride", ""),
      enemy: getOptionValue("enemyItem")
    },
    ranks: {
      my: {
        a: getRankValue("myRankA"),
        c: getRankValue("myRankC"),
        b: getRankValue("myRankB"),
        d: getRankValue("myRankD")
      },
      enemy: {
        a: getRankValue("enemyRankA"),
        c: getRankValue("enemyRankC"),
        b: getRankValue("enemyRankB"),
        d: getRankValue("enemyRankD")
      }
    }
  };
}

function getAbilityData(name) {
  return (typeof abilities !== "undefined" && abilities[name]) ? abilities[name] : {};
}

function getItemData(name) {
  return (typeof items !== "undefined" && items[name]) ? items[name] : {};
}

function rankMultiplier(rank) {
  if (rank >= 0) return (2 + rank) / 2;
  return 2 / (2 - rank);
}

function adjustRankForCritical(rank, role, isCritical) {
  if (!isCritical) return rank;
  if (role === "attack") return Math.max(rank, 0);
  return Math.min(rank, 0);
}

function boostedStat(value, statKey, side, role, context) {
  const options = context.options;
  const rank = options.ranks[side]?.[statKey] || 0;
  const adjustedRank = adjustRankForCritical(rank, role, options.critical);
  const ability = getAbilityData(role === "attack" ? context.attackerAbility : context.defenderAbility);
  const item = getItemData(role === "attack" ? context.attackerItem : context.defenderItem);

  let result = Math.floor(value * rankMultiplier(adjustedRank));

  if (ability.statMultiplier?.[statKey]) {
    result = Math.floor(result * ability.statMultiplier[statKey]);
  }

  if (
    ability.weatherStatMultiplier?.stat === statKey &&
    ability.weatherStatMultiplier.weather === options.weather
  ) {
    result = Math.floor(result * ability.weatherStatMultiplier.multiplier);
  }

  if (item.statMultiplier?.[statKey]) {
    result = Math.floor(result * item.statMultiplier[statKey]);
  }

  return Math.max(1, result);
}

function weatherMultiplier(moveType, weather) {
  if (weather === "晴れ" && moveType === "ほのお") return 1.5;
  if (weather === "晴れ" && moveType === "みず") return 0.5;
  if (weather === "雨" && moveType === "みず") return 1.5;
  if (weather === "雨" && moveType === "ほのお") return 0.5;
  return 1;
}

function fieldMultiplier(moveType, field) {
  if (field === "エレキフィールド" && moveType === "でんき") return 1.3;
  if (field === "グラスフィールド" && moveType === "くさ") return 1.3;
  if (field === "サイコフィールド" && moveType === "エスパー") return 1.3;
  if (field === "ミストフィールド" && moveType === "ドラゴン") return 0.5;
  return 1;
}

function finalDamageMultiplier(move, attackerTypes, typeRate, context) {
  const options = context.options;
  const ability = getAbilityData(context.attackerAbility);
  const item = getItemData(context.attackerItem);
  const stab = attackerTypes.includes(move.type) ? (ability.stabMultiplier || 1.5) : 1;

  let multiplier = stab;
  multiplier *= typeRate;
  multiplier *= weatherMultiplier(move.type, options.weather);
  multiplier *= fieldMultiplier(move.type, options.field);

  if (options.critical) multiplier *= 1.5;

  if (ability.typeBoost?.type === move.type) {
    multiplier *= ability.typeBoost.multiplier;
  }

  if (item.damageMultiplier) {
    multiplier *= item.damageMultiplier;
  }

  if (item.superEffectiveMultiplier && typeRate > 1) {
    multiplier *= item.superEffectiveMultiplier;
  }

  return multiplier;
}

function getMyBattleItem(myPokemon, options) {
  return options.items.myOverride || myPokemon?.item || "なし";
}

function damageRange(move, attackerStats, attackerTypes, defenderStats, defenderTypes, context = {}) {
  if (!move || move.power === "-" || move.category === "変化") {
    return null;
  }

  if (move.category !== "物理" && move.category !== "特殊") {
    return null;
  }

  const options = context.options || getBattleOptions();
  const fullContext = {
    ...context,
    options
  };
  const attackKey = move.category === "物理" ? "a" : "c";
  const defenseKey = move.category === "物理" ? "b" : "d";
  const attack = boostedStat(attackerStats[attackKey], attackKey, context.attackerSide, "attack", fullContext);
  const defense = boostedStat(defenderStats[defenseKey], defenseKey, context.defenderSide, "defense", fullContext);
  const typeRate = typeMultiplier(move.type, defenderTypes);
  const baseDamage = Math.floor(Math.floor(((Math.floor((DAMAGE_LEVEL * 2) / 5) + 2) * move.power * attack) / defense) / 50) + 2;
  const finalMultiplier = finalDamageMultiplier(move, attackerTypes, typeRate, fullContext);

  return {
    min: Math.floor(baseDamage * finalMultiplier * 0.85),
    max: Math.floor(baseDamage * finalMultiplier),
    typeRate
  };
}

function formatDamage(range, hp) {
  if (!range) return "ダメージなし";

  const minPercent = ((range.min / hp) * 100).toFixed(1);
  const maxPercent = ((range.max / hp) * 100).toFixed(1);
  const typeText = range.typeRate !== 1 ? ` / 相性x${range.typeRate}` : "";

  return `${range.min}〜${range.max} (${minPercent}〜${maxPercent}%)${typeText}`;
}

function renderMoveDamage(moveName, attackerStats, attackerTypes, defenderSets, defenderTypes, context) {
  const move = moves[moveName];

  if (!moveName) return "";

  if (!move) {
    return `<div class="damage-move"><strong>${escapeHtml(moveName)}</strong><br>技データなし</div>`;
  }

  let html = `<div class="damage-move">`;
  html += `<strong>${escapeHtml(moveName)}</strong> `;
  html += `<span>${escapeHtml(move.type)} / ${escapeHtml(move.category)} / 威力${escapeHtml(move.power)}</span>`;

  defenderSets.forEach(set => {
    const range = damageRange(move, attackerStats, attackerTypes, set.stats, defenderTypes, context);
    html += `<div>${escapeHtml(set.label)}：${formatDamage(range, set.stats.h)}</div>`;
  });

  html += `</div>`;
  return html;
}

function renderMyToEnemy(myPokemon, enemyParty) {
  const options = getBattleOptions();
  const myStats = getSavedPokemonStats(myPokemon);
  const myTypes = getSavedPokemonTypes(myPokemon);
  const moveNames = (myPokemon.moves || []).filter(move => move);
  const myItem = getMyBattleItem(myPokemon, options);

  if (!myStats || !enemyParty.length) {
    return `<section class="damage-section"><h2>自分 → 相手</h2><p>計算に必要なポケモンが選ばれていません。</p></section>`;
  }

  let html = `<section class="damage-section damage-section-wide"><h2>自分 → 相手パーティ</h2>`;

  if (!moveNames.length) {
    html += `<p>自分の技が登録されていません。</p>`;
  } else {
    enemyParty.forEach(enemyPokemon => {
      const enemyTypes = enemyPokemon.types || [];
      const defenderSets = [
        { label: "耐久無振り", stats: makeStats(enemyPokemon.base) },
        { label: "Hのみ極振り", stats: makeStats(enemyPokemon.base, { h: MAX_INVEST }) },
        { label: "BDのみ極振り", stats: makeStats(enemyPokemon.base, { b: MAX_INVEST, d: MAX_INVEST }) },
        { label: "HBD極振り", stats: makeStats(enemyPokemon.base, { h: MAX_INVEST, b: MAX_INVEST, d: MAX_INVEST }) }
      ];

      html += `<div class="damage-target">`;
      html += `<h3>${escapeHtml(enemyPokemon.num)}. ${escapeHtml(enemyPokemon.name)}</h3>`;

      moveNames.forEach(moveName => {
        html += renderMoveDamage(moveName, myStats, myTypes, defenderSets, enemyTypes, {
          options,
          attackerSide: "my",
          defenderSide: "enemy",
          attackerAbility: options.abilities.my,
          defenderAbility: options.abilities.enemy,
          attackerItem: myItem,
          defenderItem: options.items.enemy
        });
      });

      html += `</div>`;
    });
  }

  html += `</section>`;
  return html;
}

function attackerStatsForEnemyMove(base, move, invest, natureBoost) {
  const ev = {};

  if (move.category === "物理") ev.a = invest;
  if (move.category === "特殊") ev.c = invest;

  const stats = makeStats(base, ev);

  if (natureBoost && move.category === "物理") stats.a = Math.floor(stats.a * 1.1);
  if (natureBoost && move.category === "特殊") stats.c = Math.floor(stats.c * 1.1);

  return stats;
}

function renderEnemyToMy(myPokemon, enemyPokemon) {
  const options = getBattleOptions();
  const myStats = getSavedPokemonStats(myPokemon);
  const myTypes = getSavedPokemonTypes(myPokemon);
  const enemyTypes = enemyPokemon.types || [];
  const moveNames = (enemyPokemon.moves || []).filter(move => move);
  const myItem = getMyBattleItem(myPokemon, options);

  if (!myStats || !enemyPokemon.base) {
    return `<section class="damage-section"><h2>相手 → 自分</h2><p>計算に必要なポケモンが選ばれていません。</p></section>`;
  }

  let html = `<section class="damage-section"><h2>相手 → 自分</h2>`;

  if (!moveNames.length) {
    html += `<p>相手の技が入力されていません。</p>`;
  } else {
    moveNames.forEach(moveName => {
      const move = moves[moveName];

      if (!moveName) return;

      if (!move) {
        html += `<div class="damage-move"><strong>${escapeHtml(moveName)}</strong><br>技データなし</div>`;
        return;
      }

      const attackerSets = [
        { label: "AC特化", stats: attackerStatsForEnemyMove(enemyPokemon.base, move, MAX_INVEST, true) },
        { label: "ACぶっぱ", stats: attackerStatsForEnemyMove(enemyPokemon.base, move, MAX_INVEST, false) },
        { label: "AC無振り", stats: attackerStatsForEnemyMove(enemyPokemon.base, move, 0, false) }
      ];

      html += `<div class="damage-move">`;
      html += `<strong>${escapeHtml(moveName)}</strong> `;
      html += `<span>${escapeHtml(move.type)} / ${escapeHtml(move.category)} / 威力${escapeHtml(move.power)}</span>`;

      attackerSets.forEach(set => {
        const range = damageRange(move, set.stats, enemyTypes, myStats, myTypes, {
          options,
          attackerSide: "enemy",
          defenderSide: "my",
          attackerAbility: options.abilities.enemy,
          defenderAbility: options.abilities.my,
          attackerItem: options.items.enemy,
          defenderItem: myItem
        });
        html += `<div>${escapeHtml(set.label)}：${formatDamage(range, myStats.h)}</div>`;
      });

      html += `</div>`;
    });
  }

  html += `</section>`;
  return html;
}

function updateDamageCalc() {
  const box = document.getElementById("damageCalc");
  if (!box) return;

  const myPokemon = getMyActivePokemon();
  const enemyPokemon = getEnemyActivePokemon();
  const enemyParty = getEnemyPartyPokemon();

  if (!myPokemon || !enemyParty.length) {
    box.innerHTML = `
      <section class="damage-section">
        <h2>ダメージ計算</h2>
        <p>自分の「今出ている」と相手パーティを入力すると表示されます。</p>
      </section>
    `;
    return;
  }

  box.innerHTML = `
    <div class="damage-grid">
      ${renderMyToEnemy(myPokemon, enemyParty)}
      ${enemyPokemon && enemyPokemon.base ? renderEnemyToMy(myPokemon, enemyPokemon) : ""}
    </div>
  `;
}

window.addEventListener("load", updateDamageCalc);
