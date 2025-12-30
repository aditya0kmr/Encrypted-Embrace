import { useRef, useState, useMemo } from 'react'
import { Text, Float, Sparkles, MeshRefractionMaterial, useTexture, Caustics } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function CrystalShard({ position, color, type, label, onClick }) {
    const mesh = useRef()
    const [hovered, setHover] = useState(false)

    useFrame((state) => {
        if (!mesh.current) return
        // Slow rotation
        mesh.current.rotation.y += 0.005
        mesh.current.rotation.x += 0.002

        // Hover expansion
        const targetScale = hovered ? 1.2 : 1
        mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8} floatingRange={[-0.2, 0.2]}>
            <group position={position} onClick={onClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                <mesh ref={mesh}>
                    <octahedronGeometry args={[0.8, 0]} />
                    <meshPhysicalMaterial
                        color={color}
                        thickness={1}
                        roughness={0}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        transmission={0.8} // Glass-like
                        ior={1.5}
                        attenuationDistance={1}
                        attenuationColor={color}
                    />
                </mesh>

                {/* Inner Glow Core */}
                <mesh scale={0.4}>
                    <octahedronGeometry args={[0.8, 0]} />
                    <meshBasicMaterial color="white" />
                </mesh>

                <Text position={[0, -1.2, 0]} fontSize={0.15} color="#eef" font="/assets/fonts/Inter-Bold.woff" outlineWidth={0.01} outlineColor="black">
                    {label}
                </Text>

                {hovered && (
                    <Text position={[0, 1.2, 0]} fontSize={0.1} color={color}>
                        CLICK TO WARP
                    </Text>
                )}
            </group>
        </Float>
    )
}

function CrystalCaveEnvironment() {
    // Generates a jagged cave shell
    return (
        <group>
            <mesh>
                <icosahedronGeometry args={[12, 1]} />
                <meshStandardMaterial
                    color="#200040"
                    side={THREE.BackSide}
                    flatShading={true}
                    roughness={0.8}
                    emissive="#100020"
                />
            </mesh>
            {/* Ambient Sparkles */}
            <Sparkles count={300} scale={10} size={4} speed={0.4} opacity={0.5} color="#00ffff" />
            <Sparkles count={100} scale={8} size={6} speed={0.2} opacity={0.3} color="#ff00ff" />
        </group>
    )
}

export default function FavoritesPlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: favorites, loading } = useCollection('favorites')

    // Helper to spiral items out
    const getCrystalPos = (i) => {
        const phi = Math.acos(-1 + (2 * i) / (favorites.length || 1));
        const theta = Math.sqrt((favorites.length || 1) * Math.PI) * phi;
        const r = 5;
        return [
            r * Math.cos(theta) * Math.sin(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(phi)
        ];
    }

    return (
        <group>
            {/* Cave Backdrop */}
            <CrystalCaveEnvironment />

            {/* Title */}
            <Text position={[0, 3, -4]} fontSize={0.8} color="#ccddff" font="/assets/fonts/Inter-Bold.woff">
                CELESTIAL VAULT
            </Text>
            <Text position={[0, 2.4, -4]} fontSize={0.3} color="#88aaff" font="/assets/fonts/Inter-Bold.woff">
                {favorites.length} Preserved Memories
            </Text>

            {/* Crystal Collection */}
            {favorites.length === 0 ? (
                <Text position={[0, 0, 0]} fontSize={0.3} color="#88aaff">The Vault is empty.</Text>
            ) : (
                favorites.map((fav, i) => (
                    <CrystalShard
                        key={fav.id || i}
                        position={getCrystalPos(i)}
                        color={fav.itemType === 'letter' ? '#ff66b2' : fav.itemType === 'photo' ? '#00ffff' : '#ffae00'}
                        type={fav.itemType}
                        label={`${fav.itemType.toUpperCase()}`}
                        onClick={() => console.log("Warp to:", fav.id)}
                    />
                ))
            )}

            {/* Exit Portal - Giant Diamond at Bottom */}
            <mesh position={[0, -6, 0]} onClick={exitPlanet}>
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshPhysicalMaterial
                    color="white"
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                    transmission={0.9}
                    thickness={2}
                />
            </mesh>
            <Text position={[0, -4.5, 0]} fontSize={0.3} color="white" font="/assets/fonts/Inter-Bold.woff">EXIT VAULT</Text>
            <pointLight position={[0, -6, 0]} color="white" intensity={2} distance={10} />
        </group>
    )
}
