module.exports = {
    out: 'static/site.js',
    prepend: [],
    append: [
        'src/load.js'
    ],
    dependencies: {
        handlebars: {
            main: 'dist/handlebars.min.js'
        }
    }
};
