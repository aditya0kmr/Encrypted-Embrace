import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

export default function JackCompanion() {
    const group = useRef()
    const { mood } = useUniverseStore()

    // Simple Low Poly Dog (Abstract Construction)
    // Body, Head, Legs, Tail

    useFrame(({ clock, mouse }) => {
        // 1. Follow logic: Jack follows the mouse/cursor with a delay (lerp)
        // We can use a dummy vector for the target
        const targetX = (mouse.x * 10) / 2 // Approximate world space mapping
        const targetY = (mouse.y * 10) / 2

        // Lerp position
        if (group.current) {
            group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX + 1, 0.05) // Offset by 1 unit
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY - 1, 0.05)

            // 2. Animation: Happy Hop (Sine wave on Y)
            const t = clock.getElapsedTime()
            const hopSpeed = mood === 'happy' ? 10 : 5
            const hopHeight = mood === 'happy' ? 0.1 : 0.05
            group.current.position.y += Math.sin(t * hopSpeed) * hopHeight

            // 3. Rotation: Look at cursor
            group.current.lookAt(targetX, targetY, 2)
        }
    })

    return (
        <group ref={group} scale={0.5}>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
                <meshStandardMaterial color="white" roughness={0.9} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.4, 0.3]}>
                <sphereGeometry args={[0.25]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Ears */}
            <mesh position={[-0.15, 0.55, 0.3]} rotation={[0, 0, 0.5]}>
                <coneGeometry args={[0.1, 0.2]} />
                <meshStandardMaterial color="#ddd" />
            </mesh>
            <mesh position={[0.15, 0.55, 0.3]} rotation={[0, 0, -0.5]}>
                <coneGeometry args={[0.1, 0.2]} />
                <meshStandardMaterial color="#ddd" />
            </mesh>

            {/* Tail */}
            <mesh position={[0, -0.2, -0.4]} rotation={[-1, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.02, 0.4]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Collar */}
            <mesh position={[0, 0.25, 0.2]}>
                <torusGeometry args={[0.22, 0.05, 8, 16]} />
                <meshStandardMaterial color={mood === 'loving' ? 'pink' : 'red'} />
            </mesh>

            <pointLight distance={2} intensity={0.5} color="white" />
        </group>
    )
}
