/**
 * Hide/show edges based on edge visibility selections
 */
export function updateVisibleEdges() {
  const hideTaxi = !(document.getElementById("taxi") as HTMLInputElement).checked;
  const hideBus = !(document.getElementById("bus") as HTMLInputElement).checked;
  const hideMetro = !(document.getElementById("metro") as HTMLInputElement).checked;

  window._sigma.graph.edges().forEach((e) => {
    switch (e.attributes.type) {
      case "TAXI":
        e.hidden = hideTaxi;
        break;
      case "BUS":
        e.hidden = hideBus;
        break;
      case "METRO":
        e.hidden = hideMetro;
        break;
      default:
        throw Error("Unknown edgetype?");
    }
  });
  window._sigma.refresh();
}

/**
 * add a message to the bottom of the sidebar
 * @param text
 */
export function addToSidebar(text) {
  const elem = document.getElementById("sidebar");
  var temp = document.createElement("div");
  temp.innerHTML = "<div><span>{0}</span></div>".formatString(text);
  var newElem = temp.firstChild;
  elem.appendChild(newElem);
  elem.scrollTop = elem.scrollHeight;
}

function lookupNodesByKeyValue(sigmaInstance: SigmaJs.Sigma, key, value) {
  return sigmaInstance.graph.nodes().filter((node) => node[key] === value);
}
function lookupNodeByKeyValue(sigmaInstance, key, value) {
  return lookupNodesByKeyValue(sigmaInstance, key, value).pop();
}
/**
 * Find a node from the graph by id
 * @param {number|string} value
 * @returns
 */
export function lookupNodeById(value) {
  return lookupNodeByKeyValue(window._sigma, "id", String(value));
}

/**
 * Change the color of a node
 *
 * color must be an rgb value (use color constants)
 * @param  {number|string} nodeId
 * @param  {string} newColor
 */
export function setNodeColor(nodeId: number | string, newColor: string) {
  var node = lookupNodeById(nodeId);
  node.color = newColor;
  window._sigma.refresh();
}
