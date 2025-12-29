import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

function Crystal({ position, color, label, onClick, rotationSpeed = 0.2 }) {
    const mesh = useRef()
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        mesh.current.rotation.y += delta * rotationSpeed
        if (hovered) {
            mesh.current.rotation.x += delta * 0.5
            mesh.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
        } else {
            mesh.current.rotation.x = 0
            mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        }
    })

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh
                    ref={mesh}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    onClick={onClick}
                >
                    <octahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial
                        color={color}
                        transmission={0.6}
                        thickness={2}
                        roughness={0}
                        clearcoat={1}
                        emissive={color}
                        emissiveIntensity={0.2}
                    />
                </mesh>
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label}
                </Text>
            </Float>
            {hovered && <Sparkles count={20} scale={3} size={2} speed={0.4} opacity={0.5} color={color} />}
        </group>
    )
}

export default function DualCrystalLogin() {
    const { login } = useUniverseStore()

    const handleLogin = (role) => {
        // In a real implementation this would trigger the Auth Overlay
        // For prototype visualization we define the interaction
        console.log(`Selected ${role} path`)
        // Temporary Direct Login for testing visuals
        // login({ name: role }, role === 'guest' ? 'guest' : 'admin')
    }

    return (
        <group>
            {/* Left Crystal - Aadi (Admin) */}
            <Crystal
                position={[-3, 0, 0]}
                color="#0066cc" // Deep Blue
                label="Aadi (Architect)"
                onClick={() => handleLogin('aadi')}
            />

            {/* Right Crystal - Nanniii (Admin) */}
            <Crystal
                position={[3, 0, 0]}
                color="#ff66b2" // Pink
                label="Nanniii (Investigator)"
                onClick={() => handleLogin('nanniii')}
            />

            {/* Center/Lower Star - Guest */}
            <Crystal
                position={[0, -2, 0]}
                color="#888888" // Gray/White
                label="Guest / Other Star"
                onClick={() => handleLogin('guest')}
                rotationSpeed={0.5}
            />

            <Text position={[0, 3, 0]} fontSize={0.5} color="gold" anchorX="center">
                Encrypted Embrace
            </Text>
        </group>
    )
}
