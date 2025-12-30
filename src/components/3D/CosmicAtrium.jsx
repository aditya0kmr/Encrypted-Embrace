import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html, Torus } from '@react-three/drei'
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

    // Calculate orbital radius roughly from distance to center (0,0,0)
    const radius = Math.sqrt(position[0] ** 2 + position[2] ** 2)

    return (
        <group>
            {/* Orbital Ring Trace */}
            <group rotation={[Math.PI / 2, 0, 0]}>
                <mesh>
                    <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
                    <meshBasicMaterial color={color} opacity={0.1} transparent side={THREE.DoubleSide} />
                </mesh>
            </group>

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

            <Text position={[0, -1, 0]} fontSize={0.2} color="#888">CHRONOS SPHERE</Text>

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

            {/* 7. Favorites (New) */}
            <Planet
                position={[0, 0, -6]}
                color="#ccddff"
                label="Celestial Vault"
                size={0.9}
                onClick={() => enterPlanet('favorites')}
            />

            {/* 8. The Bin (Aadi Only) */}
            {(user?.displayName?.includes('Aadi') || (user?.role === 'admin' && !user?.displayName?.includes('Nanniii'))) && (
                <Planet
                    position={[0, -4, -4]}
                    color="#333"
                    label="The Bin"
                    size={0.6}
                    onClick={() => enterPlanet('bin')}
                />
            )}

            {/* Ambient particles */}
            {/* (Can add Sparkles or Stars here specific to Atrium) */}
        </group>
    )
}
