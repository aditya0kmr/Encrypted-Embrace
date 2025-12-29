import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line, Text, Image } from '@react-three/drei'
import useUniverseStore from '../../../stores/useUniverseStore'

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

    // Define the serpent path
    const points = useMemo(() => [
        new Vector3(-5, -2, 0),
        new Vector3(-2, 0, 2),
        new Vector3(1, -1, -2),
        new Vector3(4, 2, 0),
        new Vector3(6, 0, 3)
    ], [])

    const curve = useMemo(() => new CatmullRomCurve3(points), [points])

    // Mock Data (replace with Firestore later)
    const milestones = [
        { pos: points[0], title: "First Met", year: "2022", img: "/assets/images/us/we together 001.jpg" },
        { pos: points[1], title: "Sharda Uni", year: "2023", img: "/assets/images/aadi/aadi001.jpg" },
        { pos: points[2], title: "First Date", year: "2023", img: "/assets/images/us/we together 002.jpg" },
        { pos: points[3], title: "Dehradun Trip", year: "2024", img: "/assets/images/jack/jack 001.jpg" },
        { pos: points[4], title: "Forever", year: "Future", img: null },
    ]

    return (
        <group>
            {/* Serpent Body */}
            <Line points={points} color="#00ffff" lineWidth={3} dashed={false} />

            {/* Nodes */}
            {milestones.map((m, i) => (
                <TimelineNode
                    key={i}
                    position={m.pos}
                    title={m.title}
                    year={m.year}
                    image={m.img} // Using the copied assets
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
