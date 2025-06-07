// app/stores/MenuStore.ts
import { create } from 'zustand';
import { Menu, MenuSection } from '../types/menu';

export type MenuSource = 'scan' | 'recent';
export type MenuState = 'loading' | 'analyzing' | 'streaming' | 'complete';

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
  loadExampleMenu: () => void;
  
  // Reset
  resetMenu: () => void;
  resetScanState: () => void;
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
  
  setMenuTitle: (title) => set({ 
    menuTitle: title, 
    menuState: 'analyzing' // Passer en mode analyse quand on reçoit le titre
  }),
  
  setDetectedSections: (sections) => set({ 
    detectedSections: sections,
    menuState: 'streaming' // Passer en streaming dès qu'on a les sections
  }),
  
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

  loadExampleMenu: () => {
    console.log('📦 DEMO: Début chargement menu exemple');
    
    // Import du menu d'exemple
    const exampleMenu = require('../lib/data/menuExample.json');
    
    // Reset d'abord avec flag démo
    set({
      ...initialState,
      loading: true,
      error: 'Mode démo - Backend indisponible'
    });
    
    console.log('📦 DEMO: État initial défini');
    
    // Simuler le streaming progressif
    setTimeout(() => {
      const currentState = get();
      console.log('📦 DEMO: Timeout 1 - loading:', currentState.loading);
      if (currentState.loading) {
        set({ 
          menuTitle: exampleMenu.menu.name,
          menuState: 'analyzing',
          error: 'Mode démo - Backend indisponible'
        });
        console.log('📦 DEMO: Titre défini:', exampleMenu.menu.name);
      }
    }, 500);
    
    setTimeout(() => {
      const currentState = get();
      console.log('📦 DEMO: Timeout 2 - loading:', currentState.loading);
      if (currentState.loading) {
        const sectionNames = exampleMenu.menu.sections.map((s: any) => s.name);
        set({ 
          detectedSections: sectionNames,
          menuState: 'streaming'
        });
        console.log('📦 DEMO: Sections détectées:', sectionNames.length);
      }
    }, 1000);
    
    // Ajouter les sections une par une
    exampleMenu.menu.sections.forEach((section: any, index: number) => {
      setTimeout(() => {
        const currentState = get();
        console.log(`📦 DEMO: Section ${index + 1} - loading:`, currentState.loading);
        if (currentState.loading) {
          const { addCompletedSection } = get();
          addCompletedSection(section, index + 1, exampleMenu.menu.sections.length);
          console.log(`📦 DEMO: Section ajoutée: ${section.name}`);
        }
      }, 1500 + (index * 800));
    });
    
    // Compléter
    setTimeout(() => {
      const currentState = get();
      console.log('📦 DEMO: Timeout final - loading:', currentState.loading);
      if (currentState.loading) {
        const { completedSections, menuTitle } = get();
        set({ 
          isComplete: true,
          loading: false,
          menuState: 'complete',
          currentMenu: {
            name: menuTitle || 'Prima Fabrica',
            sections: completedSections.map(s => s.section)
          }
        });
        console.log('📦 DEMO: Menu complété avec', completedSections.length, 'sections');
      }
    }, 1500 + (exampleMenu.menu.sections.length * 800) + 500);
  },
  
  resetMenu: () => set(initialState),
  
  resetScanState: () => set({
    menuState: 'loading',
    menuTitle: '',
    detectedSections: [],
    completedSections: [],
    isComplete: false,
    loading: true,
    error: null,
    scanId: null,
    // Garder currentMenu et menuSource intacts
  }),
}));