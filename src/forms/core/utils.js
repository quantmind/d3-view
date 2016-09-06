const componentsFromType = {
    'text': 'input',
    'password': 'input'
};


export function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}
