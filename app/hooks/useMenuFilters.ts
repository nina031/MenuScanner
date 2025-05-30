// app/hooks/useMenuFilters.ts
import { useMemo } from 'react';
import { MenuItem, MenuSection } from '../types/menu';
import { useMenuFilterStore } from '../stores/MenuFilterStore';

export const useMenuFilters = (sections: MenuSection[]) => {
  const { dietary, priceRange, sortBy } = useMenuFilterStore();
  
  const filteredSections = useMemo(() => {
    return sections.map((section) => {
      let filteredItems = section.items;
      
      // Filtre par régime alimentaire
      if (dietary.length > 0) {
        filteredItems = filteredItems.filter((item) =>
          dietary.every((diet) => item.dietary.includes(diet))
        );
      }
      
      // Filtre par prix
      filteredItems = filteredItems.filter(
        (item) => item.price.value >= priceRange[0] && item.price.value <= priceRange[1]
      );
      
      // Tri
      if (sortBy === 'price') {
        filteredItems = [...filteredItems].sort((a, b) => a.price.value - b.price.value);
      } else if (sortBy === 'name') {
        filteredItems = [...filteredItems].sort((a, b) => 
          a.name.localeCompare(b.name, 'fr')
        );
      }
      
      return {
        ...section,
        items: filteredItems,
      };
    }).filter((section) => section.items.length > 0); // Retire les sections vides
  }, [sections, dietary, priceRange, sortBy]);
  
  const totalFilteredItems = useMemo(() => {
    return filteredSections.reduce((acc, section) => acc + section.items.length, 0);
  }, [filteredSections]);
  
  const hasActiveFilters = dietary.length > 0 || priceRange[0] > 0 || priceRange[1] < 50 || sortBy !== 'none';
  
  return {
    filteredSections,
    totalFilteredItems,
    hasActiveFilters,
  };
};