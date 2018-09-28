import command from "commander";
import { version } from "../../package.json";
import { defaultConfigFile, defaultOutFile } from "./options";
import run from "./run";

command
  .version(version)
  .usage("[options] [file]")
  .description(
    "Create a d3-require.js file with dependencies, additional javascript prepended and optional custom library setting"
  )
  .option("-o, --out <file>", `output file name (default: ${defaultOutFile})`)
  .option("-c, --config [file]", "config file name", defaultConfigFile)
  .option("-m, --node_modules <dir>", "Node modules location", "node_modules")
  .option(
    "-p, --prepend <files>",
    "Additional javascript files to prepend, comma separated"
  )
  .option(
    "-a, --append <files>",
    "Additional javascript files to append, comma separated"
  )
  .option("-s, --silent", "silent run - log errors only", false)
  .parse(process.argv);

//if (command.node_modules) command.node_modules = "node_modules";

run(command);
