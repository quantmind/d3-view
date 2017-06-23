import providers from './providers';

const prefix = '[d3-view-debug]';


export default function debug (msg) {
    if (providers.logger.debug)
        providers.logger.debug(`${prefix} ${msg}`);
}
