String.prototype.formatString = String.prototype.formatString || function () {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments)
        : arguments[0];
  
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

function addToSidebar(text) {
    const elem = document.getElementById("sidebar")
    var temp= document.createElement('div');
    temp.innerHTML= '<div><span>{0}</span></div>'.formatString(text);
    var newElem= temp.firstChild;
    elem.appendChild(newElem)
    
}
function lookupNodesByKeyValue(sigmaInstance, key, value) {
    return sigmaInstance.graph.nodes().filter(node => node[key] === value);
  }
  function lookupNodeByKeyValue(sigmaInstance, key, value) {
    return lookupNodesByKeyValue(sigmaInstance, key, value).pop();
  }
  function lookupNodeById(sigmaInstance, value) {
    return lookupNodeByKeyValue(sigmaInstance, 'id', String(value));
  }
  function setNodeColor(nodeId, newColor) {
      var node = lookupNodeById(window._sigma, nodeId)
      node.color = newColor
      window._sigma.refresh()
  }