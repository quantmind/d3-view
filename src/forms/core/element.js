//import wrappers from './wrappers';
//import actions from './actions';


export default class {

    get isForm () {
        return false;
    }

    created () {
        var model = this.model;
        model.id = 'form' + this.uid;
        model.name = this.structure.name;
        model.label = this.structure.label || this.name;
    }
}
