import { useMemo, useRef } from 'react'
import { Line, Text, Float, Stars, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

// Mini Jack for Map
function MiniJack({ position, color }) {
    const mesh = useRef()
    useFrame((state) => {
        // Run animation (hop)
        mesh.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.2
        mesh.current.rotation.y += 0.05
    })
    return (
        <group position={position} ref={mesh}>
            <mesh scale={0.2}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0.2, 0]} scale={0.15}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.3]} scale={0.05}>
                <sphereGeometry args={[1]} />
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
    )
}

function LocationMarker({ position, label, date, color = "orange", icon }) {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
                {icon === 'jack' ? (
                    <MiniJack position={[0, 0, 0]} />
                ) : (
                    <mesh>
                        <cylinderGeometry args={[0, 0.3, 1, 4]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
                    </mesh>
                )}
            </Float>
            <Text position={[0, 0.8, 0]} fontSize={0.2} color="white" anchorX="center" outlineWidth={0.02} outlineColor="black">
                {label}
            </Text>
            {date && <Text position={[0, 0.5, 0]} fontSize={0.12} color="#ccc" anchorX="center">{date}</Text>}
        </group>
    )
}

export default function JackLDRPlanet() {
    const { exitPlanet } = useUniverseStore()
    const { data: events, loading } = useCollection('jackEvents')

    // Seed events
    const displayEvents = events.length > 0 ? events : [
        { label: "Greater Noida (Start)", date: "Sep 2022", pos: [3, 1, 0], color: "#00ff00" },
        { label: "Jaipur (Current)", date: "Now", pos: [-3, -1, 0], color: "#ff0055", icon: 'jack' },
        { label: "Dehradun Trip", date: "Jan 2024", pos: [1, 2, -1], color: "yellow" }
    ]

    const pathPoints = useMemo(() => {
        if (displayEvents.length < 2) return []
        // Simple spline
        const curve = new THREE.CatmullRomCurve3(
            displayEvents.map(e => new THREE.Vector3(...(e.pos || [0, 0, 0])))
        )
        return curve.getPoints(50)
    }, [displayEvents])

    return (
        <group rotation={[0.2, 0, 0]}>
            <Stars count={1000} />
            <Text position={[0, 4, -2]} fontSize={0.6} color="orange" >
                JACK'S CROSS-COUNTRY JOURNEY
            </Text>

            {/* Holographic Terrain Map */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, 8, 64, 64]} />
                <meshStandardMaterial
                    color="#001a33"
                    wireframe
                    transparent
                    opacity={0.3}
                    displacementScale={2}
                />
            </mesh>

            {/* The Path Element */}
            <Line points={pathPoints} color="#ffff00" lineWidth={5} opacity={0.8} transparent />

            {/* Markers */}
            {displayEvents.map((e, i) => (
                <LocationMarker
                    key={i}
                    position={e.pos || [0, 0, 0]}
                    label={e.label}
                    date={e.date}
                    color={e.color}
                    icon={e.icon}
                />
            ))}

            {/* Distance Hud */}
            <Float speed={1} floatIntensity={0.2}>
                <group position={[0, -3, 2]}>
                    <mesh>
                        <boxGeometry args={[4, 1, 0.1]} />
                        <meshStandardMaterial color="black" transparent opacity={0.8} />
                        <lineSegments>
                            <edgesGeometry args={[new THREE.BoxGeometry(4, 1, 0.1)]} />
                            <lineBasicMaterial color="orange" />
                        </lineSegments>
                    </mesh>
                    <Text position={[0, 0, 0.1]} fontSize={0.3} color="#00ff00" >
                        Connected: 285 km / 0.0s latency
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
