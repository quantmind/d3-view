import providers from "./providers";

const prefix = "[d3-view]";

export default msg => providers.logger.warn(`${prefix} ${msg}`);
