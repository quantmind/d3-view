import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");
const d3deps = ["d3-dispatch", "d3-selection", "d3-timer"].concat(
  Object.keys(pkg.dependencies).filter(key => /^d3-/.test(key))
);
const year = new Date().getFullYear();
const preamble = `// ${pkg.homepage || pkg.name} v${
  pkg.version
} Copyright ${year} ${pkg.author.name}`;

const config = {
  input: "index.js",
  external: d3deps,
  output: {
    file: `build/${pkg.name}.js`,
    format: "umd",
    indent: false,
    extend: true,
    sourcemap: true,
    name: "d3",
    globals: d3deps.reduce((o, d) => {
      o[d] = "d3";
      return o;
    }, {}),
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
    plugins: [
      json(),
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
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
