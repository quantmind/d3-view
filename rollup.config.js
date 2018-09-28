import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const pkg = require("./package.json");
const year = new Date().getFullYear();
const preamble = `// ${pkg.homepage || pkg.name} v${
  pkg.version
} Copyright ${year} ${pkg.author.name}`;

const config = {
  input: "index.js",
  external: Object.keys(pkg.dependencies).filter(key => /^d3-/.test(key)),
  output: {
    file: `build/${pkg.name}.js`,
    format: "umd",
    indent: false,
    extend: true,
    sourcemap: true,
    name: "d3",
    globals: Object.assign(
      {},
      ...Object.keys(pkg.dependencies || {})
        .filter(key => /^d3-/.test(key))
        .map(key => ({ [key]: "d3" }))
    ),
    banner: preamble
  },
  plugins: [json(), sourcemaps()]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `build/${pkg.name}.min.js`
    },
    plugins: [json()]
  },
  {
    input: "index-require.js",
    output: {
      file: "build/d3-require.js",
      format: "umd",
      sourcemap: false,
      extend: true,
      name: "d3",
      banner: preamble
    },
    plugins: [
      resolve({
        browser: true
      })
    ]
  },
  {
    input: "src/bin/index.js",
    output: {
      file: "bin/view-require",
      format: "cjs",
      banner: `#!/usr/bin/env node\n${preamble}`
    },
    plugins: [
      json(),
      commonjs({
        include: "node_modules/**"
      })
    ],
    external: [
      "fs",
      "child_process",
      "commander",
      "console",
      "path",
      "module",
      "events",
      "assert",
      "os"
    ]
  }
];
