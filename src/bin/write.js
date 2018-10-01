import logger from "console";
import { createWriteStream, readFile } from "fs";
import { handleError, info } from "./error";

var START = "(function (d3) {\n",
  END = [
    "Object.keys(dependencies).forEach(function (name) {",
    "    d3.libs.set(name, dependencies[name]);",
    "})",
    "}(this.d3));",
    ""
  ].join("\n");

export default function(config) {
  var out = createWriteStream(config.out).on("error", handleEpipe);
  concat(out, config, config.prepend, () => {
    out.write(START);
    out.write(
      "var dependencies = " +
        JSON.stringify(config.dependencies, null, 4) +
        ";\n"
    );
    out.write(END);
    concat(out, config, config.append, () => {
      logger.info("Created “" + config.out + "”");
    });
  });
}

function concat(out, config, files, callback) {
  var file;
  if (files.length) {
    file = files.splice(0, 1)[0].trim();
    if (file) writeFile(file, out, config, files, callback);
    else concat(out, config, files, callback);
  } else callback();
}

function writeFile(file, out, config, files, callback, prefix) {
  file = (prefix || "") + file;
  readFile(file, "utf8", function(error, text) {
    if (error) {
      if (error.code === "ENOENT" && !prefix)
        writeFile(
          file,
          out,
          config,
          files,
          callback,
          config.node_modules + "/"
        );
      else handleError(error);
    } else {
      info(config, "include “" + file + "”");
      out.write(text);
      concat(out, config, files, callback);
    }
  });
}

function handleEpipe(error) {
  if (error.code === "EPIPE" || error.errno === "EPIPE") {
    process.exit(0);
  }
}
