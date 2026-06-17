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
  } else {
    currentPP[num] = 0;
    document.getElementById("pp" + num).textContent = "-";
  }
}
function useMove(num) {
  if (currentPP[num] > 0) {
    currentPP[num]--;
    document.getElementById("pp" + num).textContent = currentPP[num];
  }
}
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
let wPressed = false;document.addEventListener("keydown", function(e) {

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

