import providers from './providers';

const prefix = '[d3-view-debug]';

export default function (msg) {
    if (providers.logger.debug)
        providers.logger.debug(msg);
}


export function defaultDebug (msg) {
    providers.logger.info(`${prefix} ${msg}`);
}
