export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  aboutText: string;
  contactEmail: string;
  telegram: string;
  instagram: string;
  whatsapp: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface AppData {
  products: Product[];
  settings: SiteSettings;
}