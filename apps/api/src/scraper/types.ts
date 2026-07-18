export interface FeedProduct {
  marca: string;
  nombre: string;
  precio: number;
  moneda: string;
  link: string;
  imagenUrl?: string;
}

export interface RetailerFeedConfig {
  fuente: string;
  nombreVisible: string;
  fetchFeed: () => Promise<FeedProduct[]>;
}

export interface SyncResult {
  fuente: string;
  total: number;
  actualizados: number;
  sinMatch: number;
}
