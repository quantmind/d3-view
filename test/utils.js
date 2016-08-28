import {View} from '../';


export default class extends View {

    get testContext () {
        if (!this._testContext) this._testContext = {warn: []};
        return this._testContext;
    }

    warn (msg) {
        this.testContext.warn.push(msg);
    }
}
