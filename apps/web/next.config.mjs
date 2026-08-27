/** @type {import('next').NextConfig} */
const nextConfig = {
  // No expone la versión de Next en el header X-Powered-By.
  poweredByHeader: false,
  async redirects() {
    return [
      // Páginas raíz de v1 con equivalente directo
      { source: "/catalogo.html", destination: "/magazine", permanent: true },
      { source: "/magazine.html", destination: "/magazine", permanent: true },
      { source: "/lab.html", destination: "/quiz", permanent: true },
      { source: "/privacidad.html", destination: "/privacidad", permanent: true },

      // Artículos de v1 con slug idéntico en v2
      { source: "/resena-baccarat-rouge-540.html", destination: "/magazine/resena-baccarat-rouge-540", permanent: true },
      { source: "/resena-santal-33.html", destination: "/magazine/resena-santal-33", permanent: true },

      // Reseñas de v1 sin artículo propio en v2, con comparativa equivalente
      { source: "/resena-sauvage-dior.html", destination: "/magazine/comparativa-sauvage-vs-bleu-de-chanel", permanent: true },
      { source: "/resena-bleu-de-chanel.html", destination: "/magazine/comparativa-sauvage-vs-bleu-de-chanel", permanent: true },
      { source: "/resena-black-opium.html", destination: "/magazine/comparativa-black-opium-vs-good-girl", permanent: true },
      { source: "/resena-good-girl.html", destination: "/magazine/comparativa-black-opium-vs-good-girl", permanent: true },
      { source: "/resena-aventus-creed.html", destination: "/magazine/comparativa-aventus-vs-layton", permanent: true },

      // Reseñas de v1 sin comparativa ni artículo — fallback a la ficha de producto
      { source: "/resena-acqua-di-gio.html", destination: "/catalogo/acqua-di-gio-edt", permanent: true },
      { source: "/resena-le-male.html", destination: "/catalogo/le-male", permanent: true },
      { source: "/resena-light-blue.html", destination: "/catalogo/light-blue", permanent: true },
      { source: "/resena-oud-wood.html", destination: "/catalogo/oud-wood", permanent: true },
      { source: "/resena-terre-hermes.html", destination: "/catalogo/terre-d-hermes-edt", permanent: true },

      // Artículos de v1 sin ningún equivalente en v2 — al hub del Magazine en vez de 404
      { source: "/comparativa-sauvage-vs-y-ysl.html", destination: "/magazine", permanent: true },
      { source: "/como-elegir-perfume-oficina.html", destination: "/magazine", permanent: true },
      { source: "/estela-proyeccion-longevidad-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/nicho-vs-disenador-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-noche-eventos-especiales.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-otono-invierno-calidos.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-unisex-recomendados.html", destination: "/magazine", permanent: true },
      { source: "/guia-perfumes-verano-2026.html", destination: "/magazine", permanent: true },

      // Academia restaurada como página propia (22/07) — ya no vive en el Magazine
      { source: "/piramide-olfativa-explicada.html", destination: "/academia", permanent: true },
      { source: "/academia.html", destination: "/academia", permanent: true },
      { source: "/club.html", destination: "/club", permanent: true },

      // Artículos de Magazine taggeados "academia" (Sprint 1) — contenido absorbido
      // por /academia (22/07), ya no quedan como artículos propios
      { source: "/magazine/academia-piramide-olfativa", destination: "/academia", permanent: true },
      { source: "/magazine/academia-historia-de-la-perfumeria", destination: "/academia", permanent: true },
      { source: "/magazine/academia-familias-olfativas", destination: "/academia", permanent: true },
      { source: "/magazine/academia-concentraciones-perfume", destination: "/academia", permanent: true },

      // /articulos reemplazado por /magazine (21/07) — la ruta vieja pasa a redirect
      { source: "/articulos", destination: "/magazine", permanent: true },
      { source: "/articulos/:slug", destination: "/magazine/:slug", permanent: true },

      // /perfumes fue reemplazado por /catalogo (21/07); con el pivote a revista
      // (decisión #103) el grid público desaparece — la landing va al Magazine.
      // La ficha individual /catalogo/:slug sobrevive (destino del Quiz + long-tail).
      { source: "/perfumes", destination: "/magazine", permanent: true },
      { source: "/perfumes/:slug", destination: "/catalogo/:slug", permanent: true },

      // Retiro del catálogo público navegable (decisión #103, bloque 1.2):
      // la landing con grid/buscador/filtros y el comparador cara a cara van al Magazine.
      { source: "/catalogo", destination: "/magazine", permanent: true },
      { source: "/comparar", destination: "/magazine", permanent: true },

      // Sin redirect todavía (pendiente de decisión/contenido — ver ESTADO-aromia.md):
      // /catalogo.html?p=ID — deep-links por ID numérico, sin mapeo a slug
    ];
  },
};

export default nextConfig;
