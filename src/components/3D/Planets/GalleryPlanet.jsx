import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'

function PhotoFrame({ url, position, rotation, caption }) {
    const ref = useRef()
    const [hovered, setHover] = useMemo(() => [false, () => { }], []) // Simplified for this snippet

    useFrame((state) => {
        // Floating effect
        ref.current.rotation.y += 0.002
    })

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group ref={ref}>
                    {/* Frame Backing */}
                    <mesh position={[0, 0, -0.05]}>
                        <boxGeometry args={[1.6, 1.1, 0.05]} />
                        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* The Image */}
                    <Image url={url} scale={[1.5, 1]} />

                    {/* Caption on hover could go here */}
                    <Text position={[0, -0.6, 0]} fontSize={0.1} color="white">{caption}</Text>
                </group>
            </Float>
        </group>
    )
}

export default function GalleryPlanet() {
    const { exitPlanet } = useUniverseStore()

    // Mock Gallery Data (using our moved assets)
    const photos = [
        { url: "/assets/images/us/we together 003.jpg", pos: [-3, 0, 0], rot: [0, 0.5, 0], cap: "Us" },
        { url: "/assets/images/nanniii/nanniii001.jpg", pos: [0, 1, -2], rot: [0, 0, 0], cap: "Her" },
        { url: "/assets/images/aadi/aadi002.jpg", pos: [3, 0, 0], rot: [0, -0.5, 0], cap: "Him" },
        { url: "/assets/images/jack/jack 002.jpg", pos: [0, -1.5, 2], rot: [0, 0, 0], cap: "Jack" },
        { url: "/assets/images/us/we together 004.jpg", pos: [-2, 2, 2], rot: [0, 0.2, 0], cap: "Together" },
    ]

    return (
        <group>
            {/* Cloud Atmosphere */}
            <mesh>
                <sphereGeometry args={[10, 32, 32]} />
                <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.1} />
            </mesh>

            <Text position={[0, 3, 0]} fontSize={0.5} color="#bf00ff">Holographic Cloud</Text>

            {photos.map((p, i) => (
                <PhotoFrame key={i} {...p} position={p.pos} rotation={p.rot} caption={p.cap} />
            ))}

            {/* Exit Portal */}
            <mesh position={[0, -4, 0]} onClick={exitPlanet}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
            </mesh>
        </group>
    )
}
