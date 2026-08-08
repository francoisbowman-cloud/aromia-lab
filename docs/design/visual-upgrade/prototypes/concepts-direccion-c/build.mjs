// Reconstruye index.html a partir de shell.html + concept-1/2/3.html + fonts-embedded.css.
// index.html ya está commiteado pre-construido (autocontenido, abrible tal cual en el navegador) —
// este script solo documenta cómo se generó y permite regenerarlo tras editar los fragmentos fuente.
//
// Uso: node build.mjs   (desde este directorio)
import { readFileSync, writeFileSync } from "node:fs";

const shell = readFileSync(new URL("./shell.html", import.meta.url), "utf8");
const fonts = readFileSync(new URL("./fonts-embedded.css", import.meta.url), "utf8");
const c1 = readFileSync(new URL("./concept-1.html", import.meta.url), "utf8");
const c2 = readFileSync(new URL("./concept-2.html", import.meta.url), "utf8");
const c3 = readFileSync(new URL("./concept-3.html", import.meta.url), "utf8");

let out = shell.replace("/*__FONT_FACES__*/", fonts);
out = out.replace("<!--__CONCEPT_MARKUP__-->", `${c1}\n${c2}\n${c3}`);

writeFileSync(new URL("./index.html", import.meta.url), out);
console.log(`index.html regenerado — ${out.length} bytes`);
