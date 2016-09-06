import {view} from '../../view';
import {formComponent} from './utils';

//import wrappers from './wrappers';
//import actions from './actions';


export default class extends view.Component {

    static get props () {

    }

    get isForm () {
        return false;
    }

    addChildren (el) {
        var model = this.model,
            children = model.structure.children;
        if (children)
            return children.map((child) => {
                var component = formComponent(child);
                return self.createElement(`form-${component}`)
                    .datum({
                        structure: child,
                        form: self.isForm ? self : self.form
                    });
            });
        return el;
    }
}
