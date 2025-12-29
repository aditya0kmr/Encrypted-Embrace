import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import useUniverseStore from './stores/useUniverseStore'
import FireflyCursor from './components/3D/FireflyCursor'
import DualCrystalLogin from './components/3D/DualCrystalLogin'
import AuthOverlay from './components/UI/AuthOverlay'
import CosmicAtrium from './components/3D/CosmicAtrium'
import JackCompanion from './components/3D/JackCompanion'
import TimelinePlanet from './components/3D/Planets/TimelinePlanet'
import GalleryPlanet from './components/3D/Planets/GalleryPlanet'
import LettersPlanet from './components/3D/Planets/LettersPlanet'
import QuotesPlanet from './components/3D/Planets/QuotesPlanet'
import HerCornerPlanet from './components/3D/Planets/HerCornerPlanet'
import FavoritesPlanet from './components/3D/Planets/FavoritesPlanet'
import JackLDRPlanet from './components/3D/Planets/JackLDRPlanet'
import BinPlanet from './components/3D/Planets/BinPlanet'
import { Text } from '@react-three/drei'

import Atmosphere from './components/3D/Atmosphere'
import AudioManager from './components/AudioManager'
import { useLatestMood } from './firebase/hooks'

function SceneContent() {
    const { currentView, activePlanet } = useUniverseStore() // Destructure activePlanet here for cleaner access

    // Real-time synchronization of Planet Mood
    useLatestMood()

    return (
        <>
            <color attach="background" args={['#050510']} />

            {/* Audio System */}
            <AudioManager />

            {/* Mood-based Personal Weather */}
            <Atmosphere />

            {/* Global Lighting Support */}
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Routes Switch */}
            {currentView === 'login' && <DualCrystalLogin />}
            {currentView === 'atrium' && <CosmicAtrium />}

            {/* Active Planet Views */}
            {currentView === 'planet' && activePlanet === 'timeline' && <TimelinePlanet />}
            {currentView === 'planet' && activePlanet === 'gallery' && <GalleryPlanet />}
            {currentView === 'planet' && activePlanet === 'letters' && <LettersPlanet />}
            {currentView === 'planet' && activePlanet === 'quotes' && <QuotesPlanet />}
            {currentView === 'planet' && activePlanet === 'herCorner' && <HerCornerPlanet />}
            {currentView === 'planet' && activePlanet === 'favorites' && <FavoritesPlanet />}
            {currentView === 'planet' && activePlanet === 'jack' && <JackLDRPlanet />}
            {currentView === 'planet' && activePlanet === 'bin' && <BinPlanet />}

            {currentView === 'planet' && !['timeline', 'gallery', 'letters', 'quotes', 'herCorner', 'favorites', 'jack', 'bin'].includes(activePlanet) && (
                // Placeholder for others
                <group>
                    <Text color="white" fontSize={1}>Work in Progress: {activePlanet}</Text>
                    <mesh onClick={() => useUniverseStore.getState().exitPlanet()} position={[0, -2, 0]}>
                        <boxGeometry args={[2, 1, 1]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </group>
            )}

            {/* Always present elements */}
            <FireflyCursor />
            <JackCompanion />

            {/* Post Processing for Glow/Bloom Effects */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    )
}

function App() {
    return (
        <>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ width: '100vw', height: '100vh' }}>
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 2.5} />
            </Canvas>

            {/* HTML Overlay for UI elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
                    <AuthOverlay />
                </div>
            </div>
        </>
    )
}

export default App
