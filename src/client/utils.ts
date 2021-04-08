export function addToSidebar(text) {
  const elem = document.getElementById("sidebar");
  var temp = document.createElement("div");
  temp.innerHTML = "<div><span>{0}</span></div>".formatString(text);
  var newElem = temp.firstChild;
  elem.appendChild(newElem);
  elem.scrollTop = elem.scrollHeight;
}

export function lookupNodesByKeyValue(sigmaInstance: SigmaJs.Sigma, key, value) {
  return sigmaInstance.graph.nodes().filter((node) => node[key] === value);
}
export function lookupNodeByKeyValue(sigmaInstance, key, value) {
  return lookupNodesByKeyValue(sigmaInstance, key, value).pop();
}
export function lookupNodeById(value) {
  return lookupNodeByKeyValue(window._sigma, "id", String(value));
}
export function setNodeColor(nodeId, newColor) {
  var node = lookupNodeById(nodeId);
  node.color = newColor;
  window._sigma.refresh();
}
