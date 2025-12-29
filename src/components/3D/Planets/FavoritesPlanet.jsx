import { useRef } from 'react'
import { Text, Float, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function FavoriteOrb({ position, color, type, label }) {
    const mesh = useRef()

    return (
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
            <group position={position}>
                <mesh ref={mesh}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.5}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
                <Text position={[0, -0.8, 0]} fontSize={0.15} color="#ddd">
                    {label}
                </Text>
            </group>
        </Float>
    )
}

export default function FavoritesPlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: favorites, loading } = useCollection('favorites')

    return (
        <group>
            {/* Crystal Vault Environment */}
            <mesh>
                <icosahedronGeometry args={[10, 2]} />
                <meshStandardMaterial color="#88ccff" wireframe side={THREE.BackSide} />
            </mesh>

            <Text position={[0, 4, 0]} fontSize={0.6} color="#afd">
                CELESTIAL VAULT ({favorites.length})
            </Text>

            {/* Orbs */}
            {favorites.length === 0 ? (
                <Text position={[0, 0, 0]} fontSize={0.3} color="white">No stars collected yet.</Text>
            ) : (
                favorites.map((fav, i) => {
                    const x = (i % 5) * 2 - 4
                    const y = Math.floor(i / 5) * 2 - 2
                    return (
                        <FavoriteOrb
                            key={fav.id || i}
                            position={[x, y, 0]}
                            color={fav.itemType === 'letter' ? '#ff66b2' : '#4db8ff'}
                            type={fav.itemType}
                            label={fav.itemType.toUpperCase()}
                        />
                    )
                })
            )}

            {/* Exit */}
            <mesh position={[0, -5, 0]} onClick={exitPlanet}>
                <boxGeometry args={[1, 0.5, 1]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    )
}
