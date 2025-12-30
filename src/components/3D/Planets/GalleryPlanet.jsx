import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Text, Float, Sparkles, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'

function PhotoFrame({ url, position, rotation, caption }) {
    const ref = useRef()
    const [hovered, setHover] = React.useState(false)

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group
                    ref={ref}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    {/* Frame Backing */}
                    <mesh position={[0, 0, -0.05]}>
                        <boxGeometry args={[1.7, 1.2, 0.05]} />
                        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
                    </mesh>

                    {/* The Image */}
                    {url && <Image url={url} scale={hovered ? [1.6, 1.1] : [1.5, 1]} transparent opacity={0.9} />}

                    {/* Holographic Glass Front */}
                    <mesh position={[0, 0, 0.05]}>
                        <boxGeometry args={[1.7, 1.2, 0.02]} />
                        <MeshTransmissionMaterial
                            samples={6} thickness={0.1} chromaticAberration={0.5} anisotropy={0.1}
                            color="#aaeeff" resolution={512}
                        />
                    </mesh>

                    {/* Simple Glow Border */}
                    <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[1.75, 1.25]} />
                        <meshBasicMaterial color={hovered ? "#00ffff" : "#555555"} wireframe />
                    </mesh>

                    {/* Caption */}
                    <Text position={[0, -0.7, 0]} fontSize={0.15} color="#ccffff" outlineWidth={0.01} outlineColor="black">
                        {caption}
                    </Text>
                </group>
            </Float>
        </group>
    )
}

// Need React for state
import React from 'react'

export default function GalleryPlanet() {
    const { exitPlanet } = useUniverseStore()

    // Fetch from Firestore 'photos'
    const { data: dbPhotos, loading } = useCollection('photos')

    // Fallback to static assets if DB is empty
    const staticPhotos = [
        { url: "/assets/images/us/we together 003.jpg", pos: [-3, 0, 0], rot: [0, 0.5, 0], cap: "Us" },
        { url: "/assets/images/nanniii/nanniii001.jpg", pos: [0, 1, -2], rot: [0, 0, 0], cap: "Her" },
        { url: "/assets/images/aadi/aadi002.jpg", pos: [3, 0, 0], rot: [0, -0.5, 0], cap: "Him" },
        { url: "/assets/images/jack/jack 002.jpg", pos: [0, -1.5, 2], rot: [0, 0, 0], cap: "Jack" },
        { url: "/assets/images/us/we together 004.jpg", pos: [-2, 2, 2], rot: [0, 0.2, 0], cap: "Together" },
    ]

    const displayPhotos = dbPhotos.length > 0 ? dbPhotos.map((p, i) => ({
        url: p.imageURL,
        cap: p.captionText,
        pos: [
            (i % 3 - 1) * 4 + (Math.random() - 0.5),
            Math.floor(i / 3) * 2 - 2,
            (i % 2) * 2
        ],
        rot: [0, (Math.random() - 0.5) * 0.5, 0]
    })) : staticPhotos

    return (
        <group>
            {/* Cloud Atmosphere */}
            <Sparkles count={200} scale={12} size={6} speed={0.4} opacity={0.4} color="#bf00ff" />

            <mesh>
                <sphereGeometry args={[15, 32, 32]} />
                <meshBasicMaterial color="#1a0033" side={THREE.BackSide} />
            </mesh>

            <Text position={[0, 4, 0]} fontSize={0.7} color="#e0b0ff" >
                HOLOGRAPHIC CLOUD
            </Text>

            {displayPhotos.map((p, i) => (
                <PhotoFrame key={i} {...p} />
            ))}

            {/* Exit Portal */}
            <mesh position={[0, -5, 0]} onClick={exitPlanet}>
                <torusGeometry args={[1, 0.1, 16, 100]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
            </mesh>
            <Text position={[0, -5, 0]} fontSize={0.2} color="white">EXIT</Text>
        </group>
    )
}
