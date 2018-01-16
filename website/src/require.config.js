

module.exports = {
    out: "static/site.js",
    append: [
        "src/index.js"
    ],
    "dependencies": {
        "d3-fluid": {
            origin: "/static/d3-fluid.js"
        },
        "handlebars": {
            main: "dist/handlebars.min.js"
        },
        "remarkable": {
            main: "dist/remarkable.min.js"
        }
    }
};
