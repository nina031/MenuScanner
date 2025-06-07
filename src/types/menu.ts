// Types pour la structure du menu
export interface Price {
  value: number;
  currency: string;
}

export interface MenuItem {
  name: string;
  price: Price;
  description: string;
  ingredients: string[];
  dietary: string[];
  allergens: string[];
}

export interface MenuSection {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  name: string;
  sections: MenuSection[];
}

// Types pour les allergènes
export type Allergen = 
  | "Gluten" 
  | "Crustacés" 
  | "Œufs" 
  | "Poissons" 
  | "Arachides"
  | "Soja" 
  | "Produits laitiers" 
  | "Fruits à coque" 
  | "Céleri" 
  | "Moutarde" 
  | "Sésame" 
  | "Sulfites" 
  | "Lupin" 
  | "Mollusques";

export const ALLERGENS: Allergen[] = [
  "Gluten", 
  "Crustacés", 
  "Œufs", 
  "Poissons", 
  "Arachides",
  "Soja", 
  "Produits laitiers", 
  "Fruits à coque", 
  "Céleri", 
  "Moutarde", 
  "Sésame", 
  "Sulfites", 
  "Lupin", 
  "Mollusques"
];

export interface MenuData {
  menu: Menu;
}
