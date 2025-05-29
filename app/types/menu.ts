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
}

export interface MenuSection {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  name: string;
  sections: MenuSection[];
}

export interface MenuData {
  menu: Menu;
}
