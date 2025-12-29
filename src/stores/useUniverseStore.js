import { create } from 'zustand'

const useUniverseStore = create((set) => ({
    // Auth & Role State
    user: null,
    role: 'guest', // 'admin' | 'guest'
    isAuthenticated: false,

    // Navigation State
    currentView: 'login', // 'login', 'atrium', 'planet'
    activePlanet: null, // 'timeline', 'gallery', 'letters', 'herCorner', 'quotes', 'favorites', 'jack'

    // Mood & Environment (The "Personal Weather" system)
    mood: 'happy', // 'happy', 'loving', 'missing', 'conflict', 'tired'
    setMood: (mood) => set({ mood }),

    // Actions
    login: (user, role = 'guest') => set({ user, role, isAuthenticated: true, currentView: 'atrium' }),
    logout: () => set({ user: null, role: 'guest', isAuthenticated: false, currentView: 'login' }),
    enterPlanet: (planetName) => set({ activePlanet: planetName, currentView: 'planet' }),
    exitPlanet: () => set({ activePlanet: null, currentView: 'atrium' }),
}))

export default useUniverseStore
