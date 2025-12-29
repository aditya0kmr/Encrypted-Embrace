import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection, addLetter, toggleFavorite } from '../../../firebase/hooks'
import { where, orderBy } from 'firebase/firestore'

function ReactorCore({ position, color, label, type, onClick }) {
    const mesh = useRef()
    const [hovered, setHover] = useState(false)

    useFrame((state) => {
        mesh.current.rotation.y += 0.01
        mesh.current.rotation.z += 0.005
        if (hovered) {
            mesh.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
        } else {
            mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        }
    })

    return (
        <group position={position}>
            <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={mesh}
                    onClick={onClick}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <icosahedronGeometry args={[1.5, 2]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                        wireframe
                    />
                    <pointLight color={color} distance={10} intensity={2} />
                </mesh>
            </Float>
            <Text position={[0, -2.5, 0]} fontSize={0.3} color={color}>
                {label}
            </Text>
            <Sparkles count={50} scale={4} color={color} size={4} speed={0.4} opacity={0.5} />
        </group>
    )
}

function FloatingLetter({ position, title, body, color }) {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh>
                    <planeGeometry args={[3, 4]} />
                    <meshStandardMaterial color="#111" transparent opacity={0.8} side={THREE.DoubleSide} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
                        <lineBasicMaterial color={color} />
                    </lineSegments>
                </mesh>
                <Text position={[0, 1.5, 0.1]} fontSize={0.3} color={color} anchorX="center" maxWidth={2.5}>
                    {title}
                </Text>
                <Text position={[0, 0, 0.1]} fontSize={0.15} color="#eee" anchorX="center" anchorY="middle" maxWidth={2.5} lineHeight={1.5}>
                    {body}
                </Text>
            </Float>
        </group>
    )
}

export default function LettersPlanet() {
    const { exitPlanet, user } = useUniverseStore()
    const [activeCore, setActiveCore] = useState(null) // 'love' or 'flirty'
    const [writing, setWriting] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newBody, setNewBody] = useState('')

    // 1. Fetch Real Data from Firestore
    const { data: letters, loading } = useCollection('letters')

    // Filter letters based on active core and RBAC
    const visibleLetters = letters.filter(l => {
        if (activeCore === 'flirty') return l.type === 'flirty'
        if (activeCore === 'love') return l.type === 'love'
        return false
    })

    // Position logic (distribute in circle)
    const getPos = (i, total) => {
        const angle = (i / total) * Math.PI * 2
        const radius = 6
        return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newBody) return
        await addLetter({
            title: newTitle || 'Untitled Signal',
            body: newBody,
            type: activeCore,
            isPrivate: activeCore === 'flirty',
            from: user.displayName || 'Unknown Star'
        })
        setWriting(false)
        setNewTitle('')
        setNewBody('')
    }

    const coreColor = activeCore === 'flirty' ? '#ff0055' : '#ff66b2'

    return (
        <group>
            <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            <Text position={[0, 5, 0]} fontSize={0.8} color="#ffb3d9">EMOTIONAL REACTOR</Text>

            {!activeCore ? (
                <group>
                    <ReactorCore position={[-4, 0, 0]} color="#ff66b2" label="Love Core" onClick={() => setActiveCore('love')} />
                    {user?.role === 'admin' ? (
                        <ReactorCore position={[4, 0, 0]} color="#ff0000" label="Flirty Core (Private)" onClick={() => setActiveCore('flirty')} />
                    ) : (
                        <group position={[4, 0, 0]}>
                            <mesh><sphereGeometry args={[1.5, 16, 16]} /><meshStandardMaterial color="#333" transparent opacity={0.5} wireframe /></mesh>
                            <Text position={[0, -2.5, 0]} fontSize={0.2} color="#666">Locked</Text>
                        </group>
                    )}
                </group>
            ) : (
                <group>
                    <Text position={[0, 3.5, 0]} fontSize={0.4} color={coreColor}>
                        {activeCore === 'flirty' ? "Protocol: Intimacy" : "Protocol: Devotion"}
                    </Text>

                    {visibleLetters.map((l, i) => (
                        <group key={l.id}>
                            <FloatingLetter
                                position={getPos(i, visibleLetters.length)}
                                title={l.title}
                                body={l.body}
                                color={coreColor}
                            />
                            {/* Favorite Button */}
                            <mesh
                                position={[getPos(i, visibleLetters.length)[0], -2.5, getPos(i, visibleLetters.length)[2]]}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite('letter', l.id, user.uid, !l.isPrivate)
                                }}
                            >
                                <sphereGeometry args={[0.2]} />
                                <meshStandardMaterial color="red" />
                            </mesh>
                        </group>
                    ))}

                    {/* Write Interface (Admin Only) */}
                    {user?.role === 'admin' && !writing && (
                        <Html position={[0, -2, 2]} center transform>
                            <button
                                onClick={() => setWriting(true)}
                                style={{ background: coreColor, border: 'none', padding: '10px 20px', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Inject New Signal sequence
                            </button>
                        </Html>
                    )}

                    {writing && (
                        <Html position={[0, 0, 2]} center>
                            <div style={{ background: 'rgba(0,0,0,0.9)', padding: '20px', borderRadius: '10px', width: '300px', border: `1px solid ${coreColor}` }}>
                                <input
                                    placeholder="Signal Header..."
                                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                                <textarea
                                    placeholder="Enter message data..."
                                    style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '5px' }}
                                    value={newBody}
                                    onChange={e => setNewBody(e.target.value)}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handleSend} style={{ flex: 1, background: coreColor, color: 'white', border: 'none', padding: '5px' }}>TRANSMIT</button>
                                    <button onClick={() => setWriting(false)} style={{ flex: 1, background: '#555', color: 'white', border: 'none', padding: '5px' }}>CANCEL</button>
                                </div>
                            </div>
                        </Html>
                    )}

                    <mesh position={[0, -5, 0]} onClick={() => setActiveCore(null)}>
                        <boxGeometry args={[2, 0.5, 0.1]} />
                        <meshStandardMaterial color={coreColor} />
                    </mesh>
                    <Text position={[0, -4.9, 0.1]} fontSize={0.2} color="black">RETURN</Text>
                </group>
            )}

            <mesh position={[0, -7, 0]} onClick={exitPlanet}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <Text position={[0, -6, 0]} fontSize={0.2} color="white">EXIT TO ATRIUM</Text>
        </group>
    )
}
