export const defaultConfigFile = "require.config.js";
export const defaultOutFile = "d3-require.js";

export function options(config, command) {
  if (!config.dependencies) config.dependencies = {};
  config.available = new Set();
  config.silent = command.silent;
  config.out = command.out || config.out || defaultOutFile;
  config.node_modules = command.node_modules;
  config.prepend = mergeList(config.prepend, command.prepend);
  config.append = mergeList(config.append, command.append);
}

function mergeList(val, sval) {
  if (sval) return sval.split(",");
  return val || [];
}
