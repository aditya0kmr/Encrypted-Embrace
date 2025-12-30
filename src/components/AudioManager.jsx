import { useEffect, useRef } from 'react'
import useUniverseStore from '../stores/useUniverseStore'
import { MOOD_AUDIO } from '../utils/audioData'

export default function AudioManager() {
    const { mood } = useUniverseStore()
    const audioRef = useRef(new Audio())

    // Track Mapping - Uses Base64 placeholders to ensure no 404s
    const tracks = MOOD_AUDIO

    useEffect(() => {
        const src = tracks[mood] || tracks.happy

        // Basic smooth transition simulation
        const audio = audioRef.current

        // In a real app, we'd crossfade volume here.
        // For now, simpler switch.

        if (!audio.paused) {
            // Fade out?
            audio.pause()
        }

        audio.src = src
        audio.loop = true
        audio.volume = 0.5

        // Browser autoplay policies might block this without user interaction first.
        // We rely on the initial "Login" click to unlock audio context.
        audio.play().catch(e => console.warn("Audio autoplay blocked until interaction", e))

        return () => {
            audio.pause()
        }
    }, [mood])

    return null // Headless component
}
