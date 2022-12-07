import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
// import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";

const packageJson = require(process.cwd() + "/package.json");
export default [
  {
    input: "src/index.ts",
    output: [
      // {
      //   file: packageJson.main,
      //   format: "cjs",
      //   sourcemap: true,
      //   name: "react-lib"
      // },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true
      }
    ],
    external: ["react"],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: __dirname + "/tsconfig.json" }),
      postcss()
      // terser()
    ]
  },
  {
    input: process.cwd() + "/dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts.default()]
  }
];
