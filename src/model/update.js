// Update a model with reactive model data
export default function (data) {
    if (!data) return;
    for (var key in data)
        this.$set(key, data[key]);
}
