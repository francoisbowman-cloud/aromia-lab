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
}
