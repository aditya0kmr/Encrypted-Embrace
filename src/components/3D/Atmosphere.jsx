import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../stores/useUniverseStore'

export default function Atmosphere() {
    const { mood } = useUniverseStore()
    const fogRef = useRef()

    // Mood Color Palette
    const colors = {
        happy: '#ff00ff', // Pink/Purple Nebula
        loving: '#00ffff', // Teal
        missing: '#ffcc00', // Gold
        conflict: '#5500aa', // Deep Purple Storm
        tired: '#444444' // Grey
    }

    const activeColor = colors[mood] || colors.happy
    const speed = mood === 'happy' ? 1 : 0.2
    const opacity = mood === 'missing' ? 0.8 : 0.3

    useFrame((state, delta) => {
        // Animate background color shift smoothly
        // This is a simplified approach; normally we'd lerp state.gl.setClearColor
    })

    return (
        <group>
            {/* Dynamic Fog */}
            <fog attach="fog" args={[activeColor, 5, 40]} />
            <common color={activeColor} />

            {/* Ambient Light Tint */}
            <ambientLight intensity={0.5} color={activeColor} />

            {/* Moving Clouds / Nebula Effect */}
            <group rotation={[0, 0, 0.2]}>
                <Cloud
                    opacity={opacity}
                    speed={speed * 0.4} // Rotation speed
                    width={20}
                    depth={5}
                    segments={10}
                    color={activeColor}
                />
            </group>

            {/* Distant Stars */}
            <Stars
                radius={80}
                depth={50}
                count={5000}
                factor={4}
                saturation={1}
                fade
                speed={speed}
            />
        </group>
    )
}
