import logger from "console";

export function info(config, msg) {
  if (!config.silent) logger.info(msg);
}

export function handleError(err, recover) {
  let description = err.message || err;
  if (err.name) description = `${err.name}: ${description}`;

  logger.error(description);

  // TODO should this be "err.url || (err.file && err.loc.file) || err.id"?
  if (err.url) {
    logger.error(err.url);
  }

  if (err.loc) {
    logger.error(
      `err.loc.file || err.id )} (${err.loc.line}:${err.loc.column})`
    );
  } else if (err.id) {
    logger.error(err.id);
  }

  if (err.frame) {
    logger.error(err.frame);
  } else if (err.stack) {
    logger.error(err.stack);
  }

  logger.error("");

  if (!recover) process.exit(1);
}
