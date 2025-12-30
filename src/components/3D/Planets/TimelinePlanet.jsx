import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Text, Image, Float, Tube, Sparkles, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function TimelineNode({ position, title, year, image, onClick }) {
    const mesh = useRef()

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * 0.5
        }
    })

    return (
        <group position={position} onClick={onClick}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Memory Orb - Glass */}
                <mesh ref={mesh}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={8} // Lower samples for performance since multiple nodes
                        thickness={0.5}
                        chromaticAberration={0.2}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.1}
                        color="#00ffff"
                    />
                </mesh>

                {/* Inner Core (Glowing Memory) */}
                <mesh scale={0.5}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" wireframe />
                </mesh>

                <Text position={[0, 0.8, 0]} fontSize={0.25} color="#ccffff" anchorX="center"
                    font="/assets/fonts/Inter-Bold.woff" // Optional, fallback to default
                    outlineWidth={0.01} outlineColor="#004444"
                >
                    {title}
                </Text>
                <Text position={[0, 0.6, 0]} fontSize={0.15} color="#aaa" anchorX="center">{year}</Text>

                {image && (
                    <group position={[0, -0.9, 0]}>
                        <Image url={image} scale={[1.2, 0.9]} opacity={0.9} transparent radius={0.1} />
                        {/* Frame for Image */}
                        <mesh position={[0, 0, -0.01]}>
                            <planeGeometry args={[1.3, 1]} />
                            <meshBasicMaterial color="#003333" />
                        </mesh>
                    </group>
                )}

                <Sparkles count={15} scale={1.5} size={3} speed={0.4} opacity={0.5} color="#00ffff" />
            </Float>
        </group>
    )
}

export default function TimelinePlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: events, loading } = useCollection('timelineEvents')

    // Define the serpent path
    const points = useMemo(() => [
        new Vector3(-6, -3, 0),
        new Vector3(-3, 0, 3),
        new Vector3(0, -2, -3),
        new Vector3(3, 2, 0),
        new Vector3(6, 0, 3),
        new Vector3(5, -3, 5) // Extended path
    ], [])

    const curve = useMemo(() => new CatmullRomCurve3(points), [points])

    // Map real data to path points. If no data, use default/empty or mock.
    const displayEvents = events.length > 0 ? events : [
        { title: "Waiting for Memories...", year: "202X", img: null }
    ]

    // Helper to place nodes along the curve evenly
    const getPointAt = (i, total) => {
        const t = (i + 1) / (total + 1 || 2) // Distribute between 0 and 1 padding ends
        return curve.getPoint(t)
    }

    return (
        <group>
            {/* Serpent Body (Glowing Tube) */}
            <Tube args={[curve, 64, 0.2, 8, false]}>
                <meshStandardMaterial
                    color="#0088aa"
                    emissive="#004455"
                    emissiveIntensity={1}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={false}
                />
            </Tube>

            {/* Serpent Scales/Grid Overlay */}
            <Tube args={[curve, 64, 0.22, 8, false]}>
                <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
            </Tube>

            {/* Nodes */}
            {displayEvents.map((m, i) => (
                <TimelineNode
                    key={m.id || i}
                    position={getPointAt(i, displayEvents.length)}
                    title={m.title}
                    year={m.date ? m.date.slice(0, 4) : (m.year || "")}
                    image={m.images ? m.images[0] : m.img}
                    onClick={() => console.log("Open milestone:", m.title)}
                />
            ))}

            {/* Floating Serpent Head (Decoration) */}
            <mesh position={points[points.length - 1]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.4, 1, 16]} />
                <meshStandardMaterial color="#00ffff" />
            </mesh>

            {/* Exit Portal */}
            <mesh position={[0, -4, 6]} onClick={exitPlanet}>
                <cylinderGeometry args={[1, 1, 0.1, 32]} />
                <meshStandardMaterial color="#ff3333" emissive="#550000" />
            </mesh>
            <Text position={[0, -3.5, 6]} fontSize={0.3} color="#ff8888">EXIT TIMELINE</Text>
        </group>
    )
}
