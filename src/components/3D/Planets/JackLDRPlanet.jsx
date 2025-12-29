import { useMemo } from 'react'
import { Line, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function LocationMarker({ position, label, date, color = "orange", onClick }) {
    return (
        <group position={position} onClick={onClick}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh>
                    <coneGeometry args={[0.2, 0.5, 16]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
            </Float>
            <Text position={[0, 0.5, 0]} fontSize={0.2} color="white" anchorX="center">
                {label}
            </Text>
            {date && <Text position={[0, 0.3, 0]} fontSize={0.1} color="#aaa" anchorX="center">{date}</Text>}
        </group>
    )
}

export default function JackLDRPlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: events, loading } = useCollection('jackEvents')

    // Default path (Northern India Arc) if no dynamic events, or map events to this arc
    // In a real 3D map, we'd project lat/lon to Sphere coords.
    // For now, we place the dynamic events along a curve.

    // Fallback/Seed events if empty
    const displayEvents = events.length > 0 ? events : [
        { label: "Greater Noida", date: "Start", pos: [2, 1, 0], color: "#00ff00" },
        { label: "Jaipur", date: "Current", pos: [-1, -1, 0], color: "#ff0055" },
        { label: "Distance", date: "285km", pos: [0.5, 0, 0], color: "orange" }
    ]

    const pathPoints = useMemo(() => {
        // Create a simple curve passing through the event positions
        // If we only have 2 points, straight line.
        if (displayEvents.length < 2) return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]

        return displayEvents.map((e, i) => {
            // If event has 'pos' (seed), use it. If from DB, generate a pos based on index.
            if (e.pos) return new THREE.Vector3(...e.pos)

            // Generate curved positions for DB items
            const t = i / (displayEvents.length - 1) * Math.PI
            const x = Math.cos(t) * 3
            const y = Math.sin(t) * 2
            return new THREE.Vector3(x, y, 0)
        })
    }, [displayEvents])

    return (
        <group rotation={[-0.5, 0, 0]}>
            <Text position={[0, 3, 0]} fontSize={0.5} color="orange">
                JACK'S JOURNEY (LDR)
            </Text>

            {/* The Map Base */}
            <mesh position={[0, 0, -1]}>
                <planeGeometry args={[12, 8, 32, 32]} />
                <meshStandardMaterial color="#001133" wireframe />
            </mesh>

            {/* The Path */}
            <Line points={pathPoints} color="orange" lineWidth={4} dashed={false} />

            {/* Markers */}
            {displayEvents.map((e, i) => {
                const pos = pathPoints[i]
                return (
                    <LocationMarker
                        key={e.id || i}
                        position={pos}
                        label={e.location || e.label}
                        date={e.date}
                        color={e.color || "orange"}
                        onClick={() => console.log(e)}
                    />
                )
            })}

            {/* Distance Indicator (Static for LDR context) */}
            <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
                <group position={[0, -2, 1]}>
                    <Text position={[0, 0, 0.1]} fontSize={0.3} color="#00ff00">
                        285 km Connected
                    </Text>
                </group>
            </Float>

            {/* Exit */}
            <mesh position={[0, -5, 0]} onClick={exitPlanet}>
                <boxGeometry args={[1, 0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <Text position={[0, -5.5, 0]} fontSize={0.2} color="white">BACK TO ORBIT</Text>
        </group>
    )
}
