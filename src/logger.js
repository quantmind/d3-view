import {logger} from 'd3-utils';

const prefix = '[d3-view]';

export function warn (msg) {
    logger.warn(`${prefix} ${msg}`);
}
