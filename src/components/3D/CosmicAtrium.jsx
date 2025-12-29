import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

function Planet({ position, color, label, size = 1, texture, onClick }) {
    const mesh = useRef()
    const textRef = useRef()

    useFrame((state) => {
        // Gentle rotation
        mesh.current.rotation.y += 0.005
        // Text always faces camera
        if (textRef.current) textRef.current.lookAt(state.camera.position)
    })

    return (
        <group position={position}>
            <mesh ref={mesh} onClick={onClick}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.7}
                    metalness={0.2}
                    emissive={color}
                    emissiveIntensity={0.1}
                />
                {/* Atmosphere glow */}
                <pointLight color={color} distance={size * 3} intensity={0.5} />
            </mesh>
            <Text
                ref={textRef}
                position={[0, size + 0.5, 0]}
                fontSize={0.3}
                color="white"
            >
                {label}
            </Text>
        </group>
    )
}

export default function CosmicAtrium() {
    const { enterPlanet, user } = useUniverseStore()

    // Layout planets in a ring/orbit
    return (
        <group>
            {/* Central Star or Void */}
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="white" />
                <pointLight intensity={2} distance={20} />
            </mesh>

            {/* 1. Serpent of Memory (Timeline) */}
            <Planet
                position={[5, 0, 0]}
                color="#4db8ff"
                label="Serpent of Memory"
                onClick={() => enterPlanet('timeline')}
            />

            {/* 2. Holographic Cloud (Gallery) */}
            <Planet
                position={[3, 0, 4]}
                color="#bf00ff"
                label="Holographic Cloud"
                onClick={() => enterPlanet('gallery')}
            />

            {/* 3. Emotional Reactor (Letters) - Admin Only Visual Hint */}
            {(user?.role === 'admin') && (
                <Planet
                    position={[-3, 0, 4]}
                    color="#ff0066"
                    label="Emotional Reactor"
                    size={1.2}
                    onClick={() => enterPlanet('letters')}
                />
            )}

            {/* 4. Quotes Rings */}
            <Planet
                position={[-5, 0, 0]}
                color="#ffd700"
                label="Quotes Rings"
                onClick={() => enterPlanet('quotes')}
            />

            {/* 5. Jack LDR Track */}
            <Planet
                position={[0, -2, 6]}
                color="#ff8c00"
                label="Jack LDR Map"
                onClick={() => enterPlanet('jack')}
            />

            {/* 6. Her Corner (Nanniii only) */}
            {(user?.displayName?.includes('Nanniii') || user?.role === 'admin') && (
                <Planet
                    position={[0, 4, -2]}
                    color="#ffb3d9"
                    label="Her Corner"
                    size={0.8}
                    onClick={() => enterPlanet('herCorner')}
                />
            )}

            {/* Ambient particles */}
            {/* (Can add Sparkles or Stars here specific to Atrium) */}
        </group>
    )
}
