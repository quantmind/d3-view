// Check if a value is a vanilla javascript object
export default function (value) {
    return value && value.constructor === Object;
}
