import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase/config'
import useUniverseStore from '../stores/useUniverseStore'

export function useRotation(collectionName, poolSize = 100) {
    const { user } = useUniverseStore()
    const [currentItem, setCurrentItem] = useState(null)
    const [loading, setLoading] = useState(true)

    // Helper to get random index
    const getRandomIndex = () => Math.floor(Math.random() * poolSize)

    useEffect(() => {
        if (!user) return

        const fetchRotation = async () => {
            setLoading(true)
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            let seenData = userDoc.exists() ? userDoc.data().seen || {} : {}
            let seenForCollection = seenData[collectionName] || []

            // Logic: Find an index NOT in seenForCollection
            let nextIndex = getRandomIndex()
            let attempts = 0

            // Try to find a new one
            while (seenForCollection.includes(nextIndex) && attempts < poolSize) {
                nextIndex = (nextIndex + 1) % poolSize
                attempts++
            }

            // If we've seen everything, reset!
            if (attempts >= poolSize) {
                console.log(`Cycle complete for ${collectionName}. Resetting.`)
                seenForCollection = []
                nextIndex = getRandomIndex()
            }

            // Update local state
            setCurrentItem(nextIndex)

            // Update DB (optimistic)
            await setDoc(userRef, {
                seen: {
                    ...seenData,
                    [collectionName]: [...seenForCollection, nextIndex]
                }
            }, { merge: true })

            setLoading(false)
        }

        fetchRotation()
    }, [collectionName, user])

    return { currentIndex: currentItem, loading }
}
