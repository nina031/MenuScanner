// app/stores/filterStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DietaryFilter = 'végétarien' | 'végétalien' | 'sans_gluten' | 'sans_lactose';
export type SortOption = 'none' | 'price' | 'name';

interface FilterState {
  dietary: DietaryFilter[];
  priceRange: [number, number];
  sortBy: SortOption;
  
  // Actions
  toggleDietaryFilter: (diet: DietaryFilter) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
}

const initialState = {
  dietary: [] as DietaryFilter[],
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
        
      setPriceRange: (range) => set({ priceRange: range }),
      
      setSortBy: (sort) => set({ sortBy: sort }),
      
      resetFilters: () => set(initialState),
    }),
    {
      name: 'menu-filters',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);