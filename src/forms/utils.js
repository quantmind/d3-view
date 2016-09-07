const componentsFromType = {
    'text': 'input',
    'password': 'input'
};


export function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}


export function addChildren (el) {
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
