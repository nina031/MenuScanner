// app/stores/filterStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Allergen } from '../types/menu';

export type DietaryFilter = 'végétarien' | 'vegan' | 'pescetarien';
export type SortOption = 'none' | 'price' | 'name';

interface FilterState {
  dietary: DietaryFilter[];
  allergens: Allergen[];
  priceRange: [number, number];
  sortBy: SortOption;
  
  // Actions
  toggleDietaryFilter: (diet: DietaryFilter) => void;
  toggleAllergen: (allergen: Allergen) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  resetDietaryFilters: () => void;
  resetAllergenFilters: () => void;
}

const initialState = {
  dietary: [] as DietaryFilter[],
  allergens: [] as Allergen[],
  priceRange: [0, 50] as [number, number],
  sortBy: 'none' as SortOption,
};

export const useMenuFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,
      
      toggleDietaryFilter: (diet) =>
        set((state) => ({
          dietary: state.dietary.includes(diet)
            ? state.dietary.filter((d) => d !== diet)
            : [...state.dietary, diet],
        })),
      
      toggleAllergen: (allergen) =>
        set((state) => ({
          allergens: state.allergens.includes(allergen)
            ? state.allergens.filter((a) => a !== allergen)
            : [...state.allergens, allergen],
        })),
        
      setPriceRange: (range) => set({ priceRange: range }),
      
      setSortBy: (sort) => set({ sortBy: sort }),
      
      resetFilters: () => set(initialState),
      
      resetDietaryFilters: () => set({ dietary: [] }),
      
      resetAllergenFilters: () => set({ allergens: [] }),
    }),
    {
      name: 'menu-filters',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);