import {logger} from 'd3-let';

const prefix = '[d3-view]';


export default class {

    warn (msg) {
        logger.warn(`${prefix} ${msg}`);
    }
}
