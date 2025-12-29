import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line, Text, Image } from '@react-three/drei'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function TimelineNode({ position, title, year, image, onClick }) {
    return (
        <group position={position} onClick={onClick}>
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
            </mesh>
            <Text position={[0, 0.5, 0]} fontSize={0.2} color="white" anchorX="center">{title}</Text>
            <Text position={[0, 0.3, 0]} fontSize={0.15} color="#aaa" anchorX="center">{year}</Text>
            {image && (
                <Image url={image} position={[0, -0.6, 0]} scale={[1, 0.7]} opacity={0.8} />
            )}
        </group>
    )
}

export default function TimelinePlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: events, loading } = useCollection('timelineEvents')

    // Define the serpent path
    const points = useMemo(() => [
        new Vector3(-5, -2, 0),
        new Vector3(-2, 0, 2),
        new Vector3(1, -1, -2),
        new Vector3(4, 2, 0),
        new Vector3(6, 0, 3),
        new Vector3(4, -2, 4) // Extended path
    ], [])

    const curve = useMemo(() => new CatmullRomCurve3(points), [points])

    // Map real data to path points. If no data, use default/empty or mock.
    const displayEvents = events.length > 0 ? events : [
        { title: "Waiting for Memories...", year: "202X", img: null }
    ]

    // Helper to place nodes along the curve evenly
    const getPointAt = (i, total) => {
        const t = i / (total - 1 || 1)
        return curve.getPoint(t)
    }

    return (
        <group>
            {/* Serpent Body */}
            <Line points={points} color="#00ffff" lineWidth={3} dashed={false} />

            {/* Nodes */}
            {displayEvents.map((m, i) => (
                <TimelineNode
                    key={m.id || i}
                    position={getPointAt(i, displayEvents.length)}
                    title={m.title}
                    year={m.date ? m.date.slice(0, 4) : m.year}
                    image={m.images ? m.images[0] : m.img}
                    onClick={() => console.log("Open milestone:", m.title)}
                />
            ))}

            {/* Back Button (Teleport to Atrium) */}
            <mesh position={[0, -3, 5]} onClick={exitPlanet}>
                <boxGeometry args={[1, 0.5, 0.1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <Text position={[0, -3, 5.1]} fontSize={0.2} color="white">EXIT TO ATRIUM</Text>
        </group>
    )
}
