export interface AdminPerfumeRow {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  familia_olfativa: string;
  categoria_precio: string;
  precio_referencia: string;
  moneda: string;
  imagen_url: string;
  estado: "borrador" | "publicado";
}

export interface AdminPerfumeList {
  items: AdminPerfumeRow[];
  total: number;
  page: number;
  pageSize: number;
}
