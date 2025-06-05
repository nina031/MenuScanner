// app/stores/MenuStore.ts
import { create } from 'zustand';
import { Menu, MenuSection } from '../types/menu';

export type MenuSource = 'scan' | 'recent';
export type MenuState = 'loading' | 'streaming' | 'complete';

interface SectionWithTimestamp {
  section: MenuSection;
  timestamp: number;
  id: string;
}

interface MenuStore {
  // État actuel du menu
  currentMenu: Menu | null;
  menuState: MenuState;
  menuSource: MenuSource;
  
  // Streaming state
  menuTitle: string;
  detectedSections: string[];
  completedSections: SectionWithTimestamp[];
  isComplete: boolean;
  
  // Loading state
  loading: boolean;
  error: string | null;
  scanId: string | null;
  
  // Actions pour le streaming
  setMenuTitle: (title: string) => void;
  setDetectedSections: (sections: string[]) => void;
  addCompletedSection: (section: MenuSection, current: number, total: number) => void;
  setComplete: (complete: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setScanId: (scanId: string | null) => void;
  
  // Actions pour les menus récents/complets
  setMenu: (menu: Menu, source: MenuSource) => void;
  
  // Reset
  resetMenu: () => void;
}

const initialState = {
  currentMenu: null,
  menuState: 'loading' as MenuState,
  menuSource: 'scan' as MenuSource,
  menuTitle: '',
  detectedSections: [],
  completedSections: [],
  isComplete: false,
  loading: true,
  error: null,
  scanId: null,
};

export const useMenuStore = create<MenuStore>((set, get) => ({
  ...initialState,
  
  setMenuTitle: (title) => set({ menuTitle: title }),
  
  setDetectedSections: (sections) => set({ detectedSections: sections }),
  
  addCompletedSection: (section, current, total) => {
    const timestamp = Date.now();
    const sectionId = `${section.name}_${current}_${timestamp}`;
    
    const newSectionData: SectionWithTimestamp = {
      section,
      timestamp,
      id: sectionId
    };
    
    set((state) => ({
      completedSections: [...state.completedSections, newSectionData],
      menuState: 'streaming'
      // On ne met PAS à jour currentMenu pendant le streaming
    }));
  },
  
  setComplete: (complete) => {
    set({ isComplete: complete });
    if (complete) {
      const { menuTitle, completedSections } = get();
      set({
        currentMenu: {
          name: menuTitle || 'Menu',
          sections: completedSections.map(s => s.section)
        },
        menuState: 'complete'
      });
    } else {
      set({ menuState: 'streaming' });
    }
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setScanId: (scanId) => set({ scanId }),
  
  setMenu: (menu, source) => set({
    currentMenu: menu,
    menuSource: source,
    menuState: 'complete',
    menuTitle: menu.name,
    isComplete: true,
    loading: false,
    error: null
  }),
  
  resetMenu: () => set(initialState),
}));