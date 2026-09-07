import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Tailwind autodescubre tailwind.config.ts desde el CWD del proceso, no desde
// este archivo. Railway construye con root apps/web y funciona, pero cualquier
// invocación desde la raíz del monorepo (next dev apps/web) cae al config por
// defecto, deja `content` vacío y no emite ninguna utilidad. Resolverlo acá
// hace que el CSS sea idéntico se lance desde donde se lance.
const here = dirname(fileURLToPath(import.meta.url));

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: { config: join(here, "tailwind.config.ts") },
  },
};

export default config;
