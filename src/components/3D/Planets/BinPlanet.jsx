import { useRef, useState } from 'react'
import { Text, Float, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import useUniverseStore from '../../../stores/useUniverseStore'
import { useCollection } from '../../../firebase/hooks'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'

function DeletedItem({ position, data, onRestore, onErase }) {
    const [hovered, setHover] = useState(false)
    useCursor(hovered)

    return (
        <group position={position}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh>
                    <dodecahedronGeometry args={[0.5]} />
                    <meshStandardMaterial color="#333" wireframe={!hovered} emissive={hovered ? "#444" : "black"} />
                </mesh>
                <Text position={[0, 0.8, 0]} fontSize={0.15} color="#666">
                    {data.type?.toUpperCase() || 'UNKNOWN'}
                </Text>
                <Text position={[0, 0.6, 0]} fontSize={0.1} color="#444" maxWidth={1}>
                    {data.title || data.text || 'Untitled'}
                </Text>
            </Float>
            {hovered && (
                <group position={[0, -0.8, 0]}>
                    <mesh position={[-0.3, 0, 0]} onClick={onRestore}>
                        <boxGeometry args={[0.5, 0.2, 0.05]} />
                        <meshStandardMaterial color="#00ff00" />
                    </mesh>
                    <Text position={[-0.3, 0, 0.06]} fontSize={0.08} color="black">RESTORE</Text>

                    <mesh position={[0.3, 0, 0]} onClick={onErase}>
                        <boxGeometry args={[0.5, 0.2, 0.05]} />
                        <meshStandardMaterial color="#ff0000" />
                    </mesh>
                    <Text position={[0.3, 0, 0.06]} fontSize={0.08} color="black">ERASE</Text>
                </group>
            )}
        </group>
    )
}

export default function BinPlanet() {
    const { exitPlanet, user } = useUniverseStore()

    // Security Check
    if (user?.role !== 'admin' || !user?.displayName?.includes('Aadi')) {
        return (
            <group>
                <Text color="red">ACCESS DENIED. DNA MISMATCH.</Text>
                <mesh onClick={exitPlanet} position={[0, -2, 0]}>
                    <boxGeometry args={[2, 1, 1]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </group>
        )
    }

    // Fetch deleted items from multiple collections (Simplified: just letters for now)
    // In a real app, we'd query a dedicated 'bin' collection or multiple queries.
    // Here we assume items are moved to 'bin' collection on delete.
    const { data: binItems, loading } = useCollection('bin')

    const handleRestore = async (id, originalCollection, originalData) => {
        // 1. Restore to original
        // ... logic to write back to 'letters' etc
        // 2. Remove from bin
        await deleteDoc(doc(db, 'bin', id))
    }

    const handleErase = async (id) => {
        if (window.confirm("Permanently delete this memory? It cannot be recovered.")) {
            await deleteDoc(doc(db, 'bin', id))
        }
    }

    return (
        <group>
            {/* Dark Vault Environment */}
            <mesh>
                <boxGeometry args={[20, 10, 20]} />
                <meshStandardMaterial color="#111" side={THREE.BackSide} roughness={0.8} />
            </mesh>

            {/* Dim Lighting */}
            <pointLight position={[0, 5, 0]} color="#444" intensity={0.5} />

            <Text position={[0, 4, -8]} fontSize={0.6} color="#333">
                ARCHIVE (RESTRICTED)
            </Text>

            {/* Render Grid of Deleted Items */}
            {binItems.length === 0 ? (
                <Text position={[0, 0, 0]} fontSize={0.3} color="#222">vault empty</Text>
            ) : (
                binItems.map((item, i) => {
                    const x = (i % 4) * 2 - 3
                    const z = Math.floor(i / 4) * 2
                    return (
                        <DeletedItem
                            key={item.id}
                            position={[x, 0, -z]}
                            data={item}
                            onRestore={() => handleRestore(item.id, item.collection, item.data)}
                            onErase={() => handleErase(item.id)}
                        />
                    )
                })
            )}

            {/* Exit */}
            <mesh position={[0, -4, 5]} onClick={exitPlanet}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="#555" />
            </mesh>
            <Text position={[0, -3, 5]} fontSize={0.2} color="#555">SEAL VAULT</Text>
        </group>
    )
}
