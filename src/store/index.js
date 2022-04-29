import create from 'zustand';

export const useActivePlanet = create((set) => ({
  activePlanet: null,
  setActivePlanet: (planet) => {
    console.log(planet);
    set((state) => ({
      activePlanet: planet,
    }));
  },
}));
