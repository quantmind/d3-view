import providers from './providers';

const prefix = '[d3-form]';


export default function (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}
