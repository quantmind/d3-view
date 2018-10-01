import { readFile } from "fs";
import loadConfigFile from "./config.js";
import dependencies from "./deps";
import { handleError, info } from "./error";
import { defaultConfigFile, options } from "./options.js";
import writeData from "./write";

//
//  The main run command
export default function(command) {
  let configFile = command.config === true ? defaultConfigFile : command.config;

  if (configFile) {
    loadConfigFile(configFile, command.silent)
      .then(normalized => execute(normalized, command))
      .catch(handleError);
  } else {
    return execute({}, command);
  }
}

function execute(config, command) {
  readFile("package.json", "utf8", function(error, text) {
    if (error) handleError(error);
    var json = JSON.parse(text);
    options(config, command);
    config.prepend.push("d3-view/build/d3-require.js");

    info(config, "process dependencies");
    dependencies(json.dependencies, config).then(() => {
      info(config, "Write data");
      writeData(config);
    });
  });
}
