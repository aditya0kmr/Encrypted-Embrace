import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

export default function JackCompanion() {
    const group = useRef()
    const { mood } = useUniverseStore()

    // Smoother Geometry using Spheres instead of Capsules for a "Baymax-ish" cute look

    useFrame(({ clock, mouse }) => {
        // Follow logic (same as before but smoother lerp)
        const targetX = (mouse.x * 10) / 2
        const targetY = (mouse.y * 10) / 2

        if (group.current) {
            group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX + 1.2, 0.08)
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY - 1.2, 0.08)

            // Animation: Happy Hop
            const t = clock.getElapsedTime()
            const hopSpeed = mood === 'happy' ? 12 : 6
            const hopHeight = mood === 'happy' ? 0.15 : 0.05
            group.current.position.y += Math.sin(t * hopSpeed) * hopHeight

            // Face cursor
            group.current.lookAt(targetX, targetY, 5)
        }
    })

    return (
        <group ref={group} scale={0.4}>
            {/* Body: Merged Spheres for organic look */}
            <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial color="white" roughness={0.4} metalness={0.1} />
            </Sphere>

            {/* Head */}
            <Sphere args={[0.5, 32, 32]} position={[0, 0.9, 0.2]}>
                <meshStandardMaterial color="white" roughness={0.4} />
            </Sphere>

            {/* Eyes (Black beads) */}
            <Sphere args={[0.08]} position={[-0.15, 1.0, 0.6]}>
                <meshStandardMaterial color="black" roughness={0} />
            </Sphere>
            <Sphere args={[0.08]} position={[0.15, 1.0, 0.6]}>
                <meshStandardMaterial color="black" roughness={0} />
            </Sphere>

            {/* Ears (Floppy Lab ears) */}
            <mesh position={[-0.45, 1.0, 0.2]} rotation={[0, 0, 0.5]}>
                <capsuleGeometry args={[0.15, 0.6]} />
                <meshStandardMaterial color="#eeeeee" />
            </mesh>
            <mesh position={[0.45, 1.0, 0.2]} rotation={[0, 0, -0.5]}>
                <capsuleGeometry args={[0.15, 0.6]} />
                <meshStandardMaterial color="#eeeeee" />
            </mesh>

            {/* Legs (Stubby cute) */}
            <Sphere args={[0.25]} position={[-0.4, -0.6, 0.3]} />
            <Sphere args={[0.25]} position={[0.4, -0.6, 0.3]} />
            <Sphere args={[0.25]} position={[-0.4, -0.6, -0.3]} />
            <Sphere args={[0.25]} position={[0.4, -0.6, -0.3]} />

            {/* Tail */}
            <mesh position={[0, -0.2, -0.6]} rotation={[-2, 0, 0]}>
                <capsuleGeometry args={[0.08, 0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Collar */}
            <mesh position={[0, 0.6, 0.2]}>
                <torusGeometry args={[0.52, 0.08, 16, 32]} />
                <meshStandardMaterial color={mood === 'loving' ? '#ff69b4' : '#ff3333'} />
            </mesh>

            {/* Glow */}
            <pointLight distance={3} intensity={0.8} color="white" />
        </group>
    )
}
