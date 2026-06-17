function $(id) {
  return document.getElementById(id);
}
function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}
function calcStat(stat, ev, isHP=false) {

  return stat + ev + (isHP ? 75 : 20);

}