import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Reglas nuevas de react-hooks v7 (React Compiler) que marcan patrones
    // preexistentes (setState en efectos de reseteo). Se mantienen visibles
    // como warning; refactor pendiente, no parte de la migración a Next 16.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);
