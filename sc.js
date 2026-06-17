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

    document.getElementById("rh1").textContent = normal.h + h + 75;
    document.getElementById("ra1").textContent = normal.a + a + 20;
    document.getElementById("rb1").textContent = normal.b + b + 20;
    document.getElementById("rc1").textContent = normal.c + c + 20;
    document.getElementById("rd1").textContent = normal.d + d + 20;
    document.getElementById("rs1").textContent = normal.s + s + 20;
  }

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

  for (let i = 1; i <= 4; i++) {
    document.getElementById("move" + i).value = "";
    document.getElementById("pp" + i).textContent = "-";
    currentPP[i] = 0;
  }
}
