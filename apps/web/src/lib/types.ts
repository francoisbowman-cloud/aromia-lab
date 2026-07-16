export interface Perfume {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  genero: "masculino" | "femenino" | "unisex";
  familia_olfativa: string;
  precio_referencia: number;
  moneda: string;
  categoria_precio: "económico" | "medio" | "premium" | "lujo";
  imagen_url: string;
  link_afiliado: string;
  descripcion_corta?: string;
  nicho_o_comercial?: "nicho" | "comercial";
}
