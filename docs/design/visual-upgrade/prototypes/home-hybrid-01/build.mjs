// Reconstruye index.html a partir de shell.html + content.html + fonts-embedded.css.
// index.html ya está commiteado pre-construido (autocontenido, abrible tal cual en el navegador) —
// este script solo documenta cómo se generó y permite regenerarlo tras editar shell.html o content.html.
//
// Uso: node build.mjs   (desde este directorio)
import { readFileSync, writeFileSync } from "node:fs";

const shell = readFileSync(new URL("./shell.html", import.meta.url), "utf8");
const fonts = readFileSync(new URL("./fonts-embedded.css", import.meta.url), "utf8");
const content = readFileSync(new URL("./content.html", import.meta.url), "utf8");

let out = shell.replace("/*__FONT_FACES__*/", fonts);
out = out.replace("<!--__HOME_MARKUP__-->", content);

writeFileSync(new URL("./index.html", import.meta.url), out);
console.log(`index.html regenerado — ${out.length} bytes`);
