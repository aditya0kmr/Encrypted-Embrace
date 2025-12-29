import { useRef, useMemo } from 'react'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function FloatingNote({ position, title, body, date }) {
    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group position={position}>
                <mesh>
                    <boxGeometry args={[2, 2.8, 0.1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <Text position={[0, 1, 0.06]} fontSize={0.18} color="#333" maxWidth={1.8}>
                    {title}
                </Text>
                <Text position={[0, 0, 0.06]} fontSize={0.1} color="#666" maxWidth={1.8} textAlign="center">
                    {body}
                </Text>
                <Text position={[0, -1.2, 0.06]} fontSize={0.08} color="#999">
                    {date ? new Date(date).toLocaleDateString() : ''}
                </Text>
            </group>
        </Float>
    )
}

export default function HerCornerPlanet() {
    const { exitPlanet, user } = useUniverseStore()

    // Fetch Private Notes
    const { data: notes, loading } = useCollection('herCornerNotes')

    // Security Check
    const allowed = user?.displayName?.includes('Nanniii') || user?.displayName?.includes('Aadi') || user?.role === 'admin'
    // Note: Prompt said Guest cannot see. Aadi can see as visitor.
    if (!allowed) return null

    // Determine layout
    // Spiral or random scatter
    const displayNotes = notes.length > 0 ? notes : [
        { title: "Journal Entry #1", body: "The evidence suggests I am falling deeper every day.", date: new Date() }
    ]

    return (
        <group>
            {/* Pastel Sanctuary */}
            <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[15, 32, 32]} />
                <meshStandardMaterial
                    color="#ffe6f2" // Pastel Pink
                    side={THREE.BackSide}
                    roughness={0.5}
                />
            </mesh>

            <Text position={[0, 4, -4]} fontSize={0.6} color="#444">
                Her Corner
            </Text>

            {/* Notes Display */}
            {displayNotes.map((note, i) => {
                // Layout logic
                const angle = (i / (displayNotes.length || 1)) * Math.PI * 2
                const radius = 3
                const x = Math.cos(angle) * (radius + (i % 2))
                const y = Math.sin(angle) * (radius * 0.5)
                const z = -2 + (i % 3)

                return <FloatingNote key={note.id || i} position={[x, y, z]} title={note.title} body={note.body} date={note.createdAt?.seconds * 1000} />
            })}

            {/* Forensic Microscrope (Abstract Decoration) */}
            <group position={[3, -2, -2]} rotation={[0, -0.5, 0]}>
                <mesh><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="#333" /></mesh>
                <Text position={[0, 0.5, 0]} fontSize={0.1} color="black">Forensic Tools</Text>
            </group>

            {/* Exit Portal */}
            <mesh position={[0, -4, 0]} onClick={exitPlanet}>
                <boxGeometry args={[1, 0.5, 0.1]} />
                <meshStandardMaterial color="#ffb3d9" />
            </mesh>
            <Text position={[0, -4, 0.1]} fontSize={0.15} color="white">LEAVE SANCTUARY</Text>
        </group>
    )
}
