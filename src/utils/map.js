export default obj => {
    if (obj && obj.constructor === Object) obj = Object.entries(obj);
    return new Map(obj);
};
