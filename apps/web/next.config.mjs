/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Páginas raíz de v1 con equivalente directo
      { source: "/catalogo.html", destination: "/perfumes", permanent: true },
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
      { source: "/resena-acqua-di-gio.html", destination: "/perfumes/acqua-di-gio-edt", permanent: true },
      { source: "/resena-le-male.html", destination: "/perfumes/le-male", permanent: true },
      { source: "/resena-light-blue.html", destination: "/perfumes/light-blue", permanent: true },
      { source: "/resena-oud-wood.html", destination: "/perfumes/oud-wood", permanent: true },
      { source: "/resena-terre-hermes.html", destination: "/perfumes/terre-d-hermes-edt", permanent: true },

      // Artículos de v1 sin ningún equivalente en v2 — al hub del Magazine en vez de 404
      { source: "/comparativa-sauvage-vs-y-ysl.html", destination: "/magazine", permanent: true },
      { source: "/como-elegir-perfume-oficina.html", destination: "/magazine", permanent: true },
      { source: "/estela-proyeccion-longevidad-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/nicho-vs-disenador-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-noche-eventos-especiales.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-otono-invierno-calidos.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-unisex-recomendados.html", destination: "/magazine", permanent: true },
      { source: "/guia-perfumes-verano-2026.html", destination: "/magazine", permanent: true },

      // Artículos de Academia (contenido migrado 18/07) — ahora con equivalente directo
      { source: "/piramide-olfativa-explicada.html", destination: "/magazine/academia-piramide-olfativa", permanent: true },
      { source: "/academia.html", destination: "/magazine", permanent: true },
      { source: "/club.html", destination: "/club", permanent: true },

      // /articulos reemplazado por /magazine (21/07) — la ruta vieja pasa a redirect
      { source: "/articulos", destination: "/magazine", permanent: true },
      { source: "/articulos/:slug", destination: "/magazine/:slug", permanent: true },

      // Sin redirect todavía (pendiente de decisión/contenido — ver ESTADO-aromia.md):
      // /catalogo.html?p=ID — deep-links por ID numérico, sin mapeo a slug
    ];
  },
};

export default nextConfig;
