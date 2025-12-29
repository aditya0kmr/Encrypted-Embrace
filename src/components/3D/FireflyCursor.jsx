import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

export default function FireflyCursor() {
    const mesh = useRef()
    const light = useRef()
    const { mood } = useUniverseStore()

    // Mood-based colors
    const colors = {
        happy: '#FFD700', // Gold
        loving: '#FF69B4', // Pink
        missing: '#87CEEB', // Sky Blue
        conflict: '#9370DB', // Purple
        tired: '#A9A9A9'  // Grey
    }

    const currentColor = colors[mood] || colors.happy

    useFrame(({ mouse, viewport }) => {
        if (mesh.current) {
            // Lerp cursor position for smooth movement
            const x = (mouse.x * viewport.width) / 2
            const y = (mouse.y * viewport.height) / 2

            mesh.current.position.lerp(new THREE.Vector3(x, y, 0), 0.1)

            // Pulse effect
            const time = Date.now() * 0.005
            const scale = 1 + Math.sin(time) * 0.2
            mesh.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <>
            <mesh ref={mesh} position={[0, 0, 5]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial
                    emissive={currentColor}
                    emissiveIntensity={2}
                    color={currentColor}
                    transparent
                    opacity={0.8}
                />
                <pointLight ref={light} color={currentColor} intensity={1.5} distance={2} />
            </mesh>
            {/* Simple particle trail could be added here */}
        </>
    )
}
