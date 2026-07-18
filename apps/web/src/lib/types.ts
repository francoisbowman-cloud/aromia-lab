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
  familia_olfativa: string;
  concentracion?: string;
  notas_salida?: string[];
  notas_corazon?: string[];
  notas_fondo?: string[];
  temporada_recomendada?: string[];
  ocasion?: string[];
  precio_referencia: number;
  moneda: string;
  categoria_precio: "económico" | "medio" | "premium" | "lujo";
  imagen_url: string;
  link_afiliado: string;
  tienda?: string;
  rating_promedio?: number;
  descripcion_corta?: string;
  nicho_o_comercial?: "nicho" | "comercial";
  resena_sintetizada?: string;
  longevidad?: number;
  estela?: number;
  proyeccion?: number;
  retailers?: Retailer[];
}
