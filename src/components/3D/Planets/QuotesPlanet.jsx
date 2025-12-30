import { useRef, useEffect, useState } from 'react'
import { Text, Torus } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useRotation } from '../../../utils/rotation'
import { useCollection } from '../../../firebase/hooks'

// Simplified Ring signature in parent map
function QuoteRing({ radius, color, quotes, speed, wave }) {
    const group = useRef()

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.z += delta * speed
            if (wave) {
                group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + radius) * 0.1
                group.current.position.y = Math.cos(state.clock.elapsedTime * 0.5 + radius) * 0.2
            }
        }
    })

    const items = quotes || []

    return (
        <group ref={group}>
            {/* The Physical Ring */}
            <Torus args={[radius, 0.05, 16, 100]}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                />
            </Torus>

            {items.map((q, i) => {
                const angle = (i / (items.length || 1)) * Math.PI * 2
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                return (
                    <group key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
                        <Text
                            fontSize={0.2}
                            color="white"
                            maxWidth={4}
                            textAlign="center"
                            anchorY="bottom"
                        >
                            {q.text}
                        </Text>
                    </group>
                )
            })}
        </group>
    )
}
                        </Text >
                    </group >
                )
            })}
        </group >
    )
}

export default function QuotesPlanet() {
    const { exitPlanet, user } = useUniverseStore()

    // Rotation Logic for "Daily Quote"
    const { currentIndex } = useRotation('quotes', 20) // Pool of 20 for test

    // Rings Config
    const rings = [
        { radius: 5, color: "#ffd700", category: "playful", speed: 0.2, count: 6, rot: [0, 0, 0] },
        { radius: 3, color: "#ff66b2", category: "love", speed: -0.3, count: 5, rot: [0.5, 0, 0] },
        { radius: 8, color: "#ff0000", category: "naughty", speed: 0.1, count: 4, rot: [-0.3, 0, 0] }
    ]

    // Filter Naughty ring for guests
    const visibleRings = user?.role === 'admin'
        ? rings
        : rings.filter(r => r.category !== 'naughty')

    return (
        <group>
            <Text position={[0, 0, 0]} fontSize={0.5} color="gold">
                The Rings of Speech
            </Text>

            {visibleRings.map((r, i) => (
                <QuoteRing
                    key={i}
                    radius={r.radius}
                    color={r.color}
                    category={r.category}
                    items={[...Array(r.count)]}
                    speed={r.speed}
                    rotationAxis={r.rot}
                    activeIndex={currentIndex}
                />
            ))}

            {/* Exit Portal */}
            <mesh position={[0, -4, 5]} onClick={exitPlanet}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <Text position={[0, -3.2, 5]} fontSize={0.2} color="white">EXIT</Text>
        </group>
    )
}
