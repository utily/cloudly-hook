import { terser } from "rollup-plugin-terser"
// plugin-node-resolve and plugin-commonjs are required for a rollup bundled project
// to resolve dependencies from node_modules. See the documentation for these plugins
// for more details.
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import path from "path"

export default {
  input: "index.ts",
  output: {
    exports: "named",
    format: "es",
    file: "dist/_worker.js",
    sourcemap: true,
		sourcemapPathTransform: relativeSourcePath => path.resolve(__dirname, relativeSourcePath.replace(/^(..\/)+/, "")),
  },
  plugins: [commonjs(), nodeResolve({ browser: true }), terser(), typescript({ resolveJsonModule: true }), json()],
}
