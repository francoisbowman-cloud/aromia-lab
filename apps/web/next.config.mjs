/** @type {import('next').NextConfig} */
const nextConfig = {
  // No expone la versión de Next en el header X-Powered-By.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
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

      // Reseñas de v1 sin artículo propio — fallback a la ficha de producto
      { source: "/resena-acqua-di-gio.html", destination: "/catalogo/acqua-di-gio-edt", permanent: true },
      { source: "/resena-le-male.html", destination: "/catalogo/le-male", permanent: true },
      { source: "/resena-light-blue.html", destination: "/catalogo/light-blue", permanent: true },
      { source: "/resena-oud-wood.html", destination: "/catalogo/oud-wood", permanent: true },
      { source: "/resena-terre-hermes.html", destination: "/catalogo/terre-d-hermes-edt", permanent: true },

      // Artículos de v1 sin equivalente directo
      { source: "/comparativa-sauvage-vs-y-ysl.html", destination: "/magazine", permanent: true },
      { source: "/como-elegir-perfume-oficina.html", destination: "/magazine", permanent: true },
      { source: "/estela-proyeccion-longevidad-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/nicho-vs-disenador-diferencias.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-noche-eventos-especiales.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-otono-invierno-calidos.html", destination: "/magazine", permanent: true },
      { source: "/perfumes-unisex-recomendados.html", destination: "/magazine", permanent: true },
      { source: "/guia-perfumes-verano-2026.html", destination: "/magazine", permanent: true },

      // Academia restaurada como página propia
      { source: "/piramide-olfativa-explicada.html", destination: "/academia", permanent: true },
      { source: "/academia.html", destination: "/academia", permanent: true },
      { source: "/club.html", destination: "/club", permanent: true },

      { source: "/magazine/academia-piramide-olfativa", destination: "/academia", permanent: true },
      { source: "/magazine/academia-historia-de-la-perfumeria", destination: "/academia", permanent: true },
      { source: "/magazine/academia-familias-olfativas", destination: "/academia", permanent: true },
      { source: "/magazine/academia-concentraciones-perfume", destination: "/academia", permanent: true },

      { source: "/articulos", destination: "/magazine", permanent: true },
      { source: "/articulos/:slug", destination: "/magazine/:slug", permanent: true },

      // Cutover editorial
      { source: "/editorial-v1", destination: "/", permanent: true },
      { source: "/editorial-v1/:slug([^.]+)", destination: "/historias/:slug", permanent: true },

      // Catálogo público retirado; las fichas individuales sobreviven
      { source: "/perfumes", destination: "/magazine", permanent: true },
      { source: "/perfumes/:slug", destination: "/catalogo/:slug", permanent: true },
      { source: "/catalogo", destination: "/magazine", permanent: true },
      { source: "/comparar", destination: "/magazine", permanent: true },
    ];
  },
};

export default nextConfig;
