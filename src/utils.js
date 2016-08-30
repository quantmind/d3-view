import {logger} from 'd3-let';

const prefix = '[d3-view]';

export function warn (msg) {
    logger.warn(`${prefix} ${msg}`);
}
