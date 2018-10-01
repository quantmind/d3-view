// No value, it has its own directive
const attributes = [
  "name",
  "class",
  "disabled",
  "readonly",
  "required",
  "href"
];

export default (element, vm) => {
  const dirs = new Directives();

  for (let i = 0; i < element.attributes.length; ++i) {
    let attr = element.attributes[i],
      bits = attr.name.split("-"),
      dirName = bits[0] === "d3" ? bits[1] : null,
      arg;

    if (dirName) {
      if (vm) {
        arg = bits.slice(2).join("-");
        if (!arg && attributes.indexOf(dirName) > -1) {
          arg = dirName;
          dirName = "attr";
        }
        var directive = vm.directives.get(dirName);
        if (directive) dirs.add(directive(element, attr, arg));
        else
          vm.logWarn(
            `${
              element.tagName
            } cannot find directive "${dirName}". Did you forget to register it?`
          );
      }
    } else dirs.attrs[attr.name] = attr.value;
  }

  return dirs;
};

// Directives container
function Directives() {
  this.attrs = {};
  this.all = [];
}

Directives.prototype = {
  size() {
    return this.all.length;
  },

  pop: function(dir) {
    var index = this.all.indexOf(dir);
    if (index > -1) {
      dir.removeAttribute();
      this.all.splice(index, 1);
    }
    return dir;
  },

  add(dir) {
    this.all.push(dir);
  },

  forEach(callback) {
    this.all.forEach(callback);
  },

  preMount() {
    let dir;
    for (let i = 0; i < this.all.length; ++i) {
      dir = this.all[i];
      if (dir.preMount()) return this.pop(dir);
    }
  },

  execute(model) {
    if (!this.size()) return;
    return Promise.all(this.all.map(d => d.execute(model)));
  }
};
