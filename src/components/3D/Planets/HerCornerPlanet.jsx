import { useRef, useMemo, useState } from 'react'
import { Text, Float, Instances, Instance, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function DNAHelix({ position }) {
    const group = useRef()

    // Create DNA strands points
    const count = 40
    const points = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = i / count
            const angle = t * Math.PI * 4
            const y = (t - 0.5) * 6
            temp.push({ x: Math.cos(angle), y, z: Math.sin(angle) })
            temp.push({ x: Math.cos(angle + Math.PI), y, z: Math.sin(angle + Math.PI) })
        }
        return temp
    }, [])

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.2
        }
    })

    return (
        <group position={position} ref={group}>
            {points.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#ff66b2" : "#00ffff"} emissive={i % 2 === 0 ? "#ff0055" : "#0088ff"} emissiveIntensity={0.5} />
                </mesh>
            ))}
            {/* Connecting rungs */}
            {points.map((p, i) => {
                if (i % 2 === 0) return (
                    <mesh key={`rung-${i}`} position={[0, p.y, 0]} rotation={[0, (i / count) * Math.PI * 4, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 2, 8]} rotation={[0, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="white" opacity={0.3} transparent />
                    </mesh>
                )
                return null
            })}
        </group>
    )
}

function EvidenceFile({ position, title, body, date }) {
    const [hovered, setHover] = useState(false)
    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {/* Glass Folder */}
                <mesh>
                    <boxGeometry args={[2.2, 3, 0.05]} />
                    <meshPhysicalMaterial
                        color={hovered ? "#fff" : "#eee"}
                        transmission={0.5}
                        roughness={0.2}
                        thickness={0.1}
                    />
                </mesh>

                {/* Paper Content */}
                <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[2, 2.8]} />
                    <meshBasicMaterial color="#fafafa" />
                </mesh>

                {/* Evidence Tag */}
                <mesh position={[0.8, 1.3, 0.04]} rotation={[0, 0, -0.2]}>
                    <planeGeometry args={[0.6, 0.3]} />
                    <meshBasicMaterial color="red" />
                </mesh>
                <Text position={[0.8, 1.3, 0.05]} fontSize={0.1} color="white" rotation={[0, 0, -0.2]}>EVIDENCE</Text>

                <Text position={[0, 1, 0.04]} fontSize={0.18} color="#333" maxWidth={1.8} anchorY="top">
                    {title}
                </Text>
                <Text position={[0, 0.5, 0.04]} fontSize={0.1} color="#666" maxWidth={1.8} textAlign="left" anchorY="top">
                    {body}
                </Text>
                <Text position={[0, -1.2, 0.04]} fontSize={0.08} color="#999">
                    ID: {date ? new Date(date).toLocaleDateString() : 'UNKNOWN'}
                </Text>
            </group>
        </Float>
    )
}

export default function HerCornerPlanet() {
    const { exitPlanet, user } = useUniverseStore()
    const { data: notes, loading } = useCollection('herCornerNotes')

    const allowed = user?.displayName?.includes('Nanniii') || user?.displayName?.includes('Aadi') || user?.role === 'admin'
    if (!allowed) return null

    const displayNotes = notes.length > 0 ? notes : [
        { title: "Case File: 1506", body: "The subject (Aadi) shows high levels of affection. Monitoring heart rate...", date: new Date() }
    ]

    return (
        <group>
            {/* Sanctuary Sphere */}
            <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[20, 32, 32]} />
                <meshStandardMaterial color="#fff0f5" side={THREE.BackSide} roughness={0.8} />
            </mesh>

            <Text position={[0, 4.5, -4]} fontSize={0.6} color="#555">
                NANNIII'S LAB
            </Text>

            {/* Giant DNA Visual */}
            <DNAHelix position={[0, 0, -5]} />
            <DNAHelix position={[-6, 0, -8]} />
            <DNAHelix position={[6, 0, -8]} />

            {/* Floating Notes */}
            {displayNotes.map((note, i) => {
                const angle = (i / (displayNotes.length || 1)) * Math.PI * 2
                const radius = 3.5
                return <EvidenceFile
                    key={note.id || i}
                    position={[Math.cos(angle) * radius, (i % 3) - 1, Math.sin(angle) * radius - 2]}
                    title={note.title}
                    body={note.body}
                    date={note.createdAt?.seconds * 1000}
                />
            })}

            {/* Exit Portal */}
            <mesh position={[0, -4, 2]} onClick={exitPlanet}>
                <boxGeometry args={[1.5, 0.5, 0.1]} />
                <meshStandardMaterial color="#ffb3d9" emissive="#ff66b2" />
            </mesh>
            <Text position={[0, -4, 2.1]} fontSize={0.2} color="white">CLOSE CASE FILE</Text>
        </group>
    )
}
