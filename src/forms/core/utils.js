const componentsFromType = {
    'text': 'input',
    'password': 'input'
};


export function addChildren (self) {
    var children = self.structure.children;
    if (children)
        return children.map((child) => {
            var component = formComponent(child);
            return self.createElement(`form-${component}`)
                .datum({
                    structure: child,
                    form: self.isForm ? self : self.form
                });
        });
    return self;
}


function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}
