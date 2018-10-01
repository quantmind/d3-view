import { realpathSync } from "fs";
import { handleError } from "./error";

export default function(configFile) {
  configFile = realpathSync(configFile);

  return Promise.resolve(require(configFile)).then(config => {
    if (Object.keys(config).length === 0) {
      handleError({
        code: "MISSING_CONFIG",
        message: "Config file must export an options object"
      });
    }
    return config;
  });
}
