import providers from './providers';

const prefix = '[d3-view]';


export default function (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}
