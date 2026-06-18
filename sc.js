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

function updateStats() {
  const input = document.getElementById("name").value;

  let normalName = input;
  let megaName = null;

  if (input.startsWith("メガ")) {
    normalName = input.replace("メガ", "");
    megaName = input;
  }

  const normal = baseStats[normalName];
  const mega = baseStats[megaName];

  const h = Number(document.getElementById("h").value);
  const a = Number(document.getElementById("a").value);
  const b = Number(document.getElementById("b").value);
  const c = Number(document.getElementById("c").value);
  const d = Number(document.getElementById("d").value);
  const s = Number(document.getElementById("s").value);
  const nature = document.getElementById("nature").value;

  if (!mega) {
    ["bh2","ba2","bb2","bc2","bd2","bs2",
     "rh2","ra2","rb2","rc2","rd2","rs2"]
      .forEach(id => document.getElementById(id).textContent = "-");
  }

  if (normal) {
    document.getElementById("bh1").textContent = normal.h;
    document.getElementById("ba1").textContent = normal.a;
    document.getElementById("bb1").textContent = normal.b;
    document.getElementById("bc1").textContent = normal.c;
    document.getElementById("bd1").textContent = normal.d;
    document.getElementById("bs1").textContent = normal.s;

   document.getElementById("rh1").textContent =
  calcStat(normal.h, h, "h", nature, true);

document.getElementById("ra1").textContent =
  calcStat(normal.a, a, "a", nature);

document.getElementById("rb1").textContent =
  calcStat(normal.b, b, "b", nature);

document.getElementById("rc1").textContent =
  calcStat(normal.c, c, "c", nature);

document.getElementById("rd1").textContent =
  calcStat(normal.d, d, "d", nature);

document.getElementById("rs1").textContent =
  calcStat(normal.s, s, "s", nature);
  }

  if (mega) {
    document.getElementById("bh2").textContent = mega.h;
    document.getElementById("ba2").textContent = mega.a;
    document.getElementById("bb2").textContent = mega.b;
    document.getElementById("bc2").textContent = mega.c;
    document.getElementById("bd2").textContent = mega.d;
    document.getElementById("bs2").textContent = mega.s;

document.getElementById("rh2").textContent =
  calcStat(mega.h, h, "h", nature, true);

document.getElementById("ra2").textContent =
  calcStat(mega.a, a, "a", nature);

document.getElementById("rb2").textContent =
  calcStat(mega.b, b, "b", nature);

document.getElementById("rc2").textContent =
  calcStat(mega.c, c, "c", nature);

document.getElementById("rd2").textContent =
  calcStat(mega.d, d, "d", nature);

document.getElementById("rs2").textContent =
  calcStat(mega.s, s, "s", nature);
  }
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("h").value = 0;
  document.getElementById("a").value = 0;
  document.getElementById("b").value = 0;
  document.getElementById("c").value = 0;
  document.getElementById("d").value = 0;
  document.getElementById("s").value = 0;
  document.getElementById("selected").checked = false;
  document.getElementById("type1").value = "";
  document.getElementById("type2").value = "";
  document.getElementById("item").value = "";
  document.getElementById("nature").value = "";  
  for (let i = 1; i <= 4; i++) {
    document.getElementById("move" + i).value = "";
    document.getElementById("pp" + i).textContent = "-";
    currentPP[i] = 0;
  }
}
