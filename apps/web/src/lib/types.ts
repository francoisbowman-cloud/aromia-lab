export interface Retailer {
  id: number;
  perfume_id: number;
  nombre: string;
  detalle?: string;
  precio: number;
  moneda: string;
  link_afiliado: string;
  logo_url?: string;
  orden: number;
}

export interface Perfume {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  genero: "masculino" | "femenino" | "unisex";
  familia_olfativa: string | null;
  concentracion?: string | null;
  notas_salida?: string[];
  notas_corazon?: string[];
  notas_fondo?: string[];
  temporada_recomendada?: string[];
  ocasion?: string[];
  precio_referencia: number | null;
  moneda: string | null;
  categoria_precio: "económico" | "medio" | "premium" | "lujo" | null;
  imagen_url: string | null;
  image_source?: string | null;
  amazon_url?: string | null;
  link_afiliado: string | null;
  tienda?: string;
  rating_promedio?: number;
  descripcion_corta?: string;
  nicho_o_comercial?: "nicho" | "comercial";
  resena_sintetizada?: string;
  longevidad?: number;
  estela?: number;
  proyeccion?: number;
  source_url?: string | null;
  data_confidence?: string | null;
  notes_status?: string | null;
  catalog_source?: string | null;
  retailers?: Retailer[];
}

// DTO acotado que devuelven /api/perfumes/search y /api/perfumes/discovery-seed
// (Discovery/Search bounded queries, handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md).
// Trae los campos que PerfumeCard renderiza más los que discovery.ts/
// personalization.ts necesitan para rankear en el cliente — nada de
// retailers, precios ni reseñas largas, eso vive solo en la ficha completa.
// `Perfume` cumple esta forma estructuralmente, así que las funciones que
// migran a este tipo siguen aceptando perfumes completos sin cambios.
export type DiscoveryPerfume = Pick<
  Perfume,
  | "slug"
  | "nombre"
  | "marca"
  | "genero"
  | "familia_olfativa"
  | "concentracion"
  | "notas_salida"
  | "notas_corazon"
  | "notas_fondo"
  | "temporada_recomendada"
  | "ocasion"
  | "categoria_precio"
  | "nicho_o_comercial"
  | "imagen_url"
  | "rating_promedio"
>;

export interface PerfumeSearchResponse {
  items: DiscoveryPerfume[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PerfumeFacet {
  name: string;
  count: number;
}

export interface PerfumeFacetsResponse {
  families: PerfumeFacet[];
}

export interface Article {
  id: number;
  slug: string;
  titulo: string;
  categoria: "resena" | "guia" | "analisis" | "academia" | "tendencias";
  contenido_html?: string;
  imagen_portada_url: string | null;
  autor?: string | null;
  meta_title?: string | null;
  meta_description: string | null;
  perfumes_relacionados: number[];
  publicado_en: string;
  nivel?: "n1" | "n2" | "n3" | "n4" | null;
  contenido_markdown?: string | null;
}
