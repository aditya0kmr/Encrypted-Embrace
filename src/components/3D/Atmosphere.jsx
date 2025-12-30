import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { useLatestMood } from '../../firebase/hooks'

export default function Atmosphere() {
    const { mood } = useLatestMood()

    // Specifications from Prompt:
    // happy: bright pink (#ff66b2), faster gentle motion, low fog (high far value).
    // loving: teal (#00ced1), smooth motion, medium fog.
    // missing: golden (#ffd700), very slow movement, higher fog.
    // conflict: purple (#8a2be2), pulsing, heavy fog.
    // tired: grey/blue (#708090)

    const config = useMemo(() => {
        switch (mood) {
            case 'happy':
                return { color: '#ff66b2', fog: 100, speed: 1.5, pulsing: false }
            case 'loving':
                return { color: '#00ced1', fog: 60, speed: 1.0, pulsing: false }
            case 'missing':
                return { color: '#ffd700', fog: 20, speed: 0.2, pulsing: false }
            case 'conflict':
                return { color: '#8a2be2', fog: 15, speed: 2.0, pulsing: true }
            case 'tired':
                return { color: '#708090', fog: 40, speed: 0.5, pulsing: false }
            default:
                return { color: '#ff66b2', fog: 80, speed: 1.0, pulsing: false }
        }
    }, [mood])

    const group = useRef()
    useFrame((state, delta) => {
        if (!group.current) return

        // Gentle rotation based on mood speed
        group.current.rotation.y += delta * 0.05 * config.speed

        // Pulsing effect for 'conflict'
        if (config.pulsing) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.02
            group.current.scale.set(scale, scale, scale)
        } else {
            group.current.scale.set(1, 1, 1)
        }
    })

    return (
        <group ref={group}>
            {/* Background Color matching mood */}
            <color attach="background" args={[config.color]} />

            {/* Dynamic Fog: args=[color, near, far] */}
            {/* Lower 'far' means heavier fog */}
            <fog attach="fog" args={[config.color, 1, config.fog]} />

            {/* Stars */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={config.speed}
            />

            {/* Nebula Clouds */}
            <Cloud
                opacity={0.3}
                speed={0.1 * config.speed}
                width={10}
                depth={1.5}
                segments={20}
                color={config.color}
            />

            {/* Ambient Light Tint */}
            <ambientLight intensity={0.5} color={config.color} />
        </group>
    )
}
