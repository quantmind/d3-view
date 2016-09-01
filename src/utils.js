import {logger} from 'd3-let';

const prefix = '[d3-view]';


var providers = {
    logger: logger
};


export function warn (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}


export default providers;
