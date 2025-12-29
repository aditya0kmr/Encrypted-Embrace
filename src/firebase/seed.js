import { collection, writeBatch, doc } from 'firebase/firestore'
import { db } from './config'

const LOVE_LETTERS = [
    {
        title: "The Algorithm of Encrypted Souls",
        body: "My Dearest Nanniii,\n\nIf love were a code, we would be the compiled binary that runs the universe. Before you, my life was a series of unhandled exceptions—chaos waiting for structure. You walked in, not just as a variable, but as the constant that balanced my entire equation.\n\nI look at the probability of us meeting—two stars drifting in the vast entropy of existence—and I realize that this wasn't random. It was hard-coded into the fabric of time. You are my source code, my logic, and my infinite loop.\n\nForever debugging life with you,\nAadi.",
        type: "love",
        isPrivate: false
    },
    {
        title: "Exhibit A: The Fingerprint on My Heart",
        body: "Subject: You.\nCase No: 15062024\n\nI’ve analyzed the evidence, Investigator. The traces you’ve left are undeniable. There are fingerprints on my soul that match no one else in this database of 8 billion people. \n\nYou analyze crime scenes for a living, finding the hidden details others miss. But have you noticed how my eyes dilate when you walk into the room? That’s the biological response to finding one's home.\n\nVerdict: Guilty of stealing my heart, sentenced to a lifetime of hugs.",
        type: "love",
        isPrivate: false
    },
    {
        title: "The Dehradun Hypothesis",
        body: "Do you remember the wind in Dehradun? It wasn't just air moving; it was the universe exhaling in relief that we were finally there, together. \n\nThat scooter ride wasn't just transport. It was a time machine. In those moments, holding onto you, I saw our past and our future blurring into a single streak of light. Jack barking at the mountains, the cold air biting our cheeks, and the warmth of you close to me.\n\nI want to map every coordinate of this world with you.",
        type: "love",
        isPrivate: false
    }
]

const FLIRTY_LETTERS = [
    {
        title: "Protocol: Midnight Override",
        body: "System Alert: Temperature Rising.\n\nYou know, when the lights go down and the server logs are cleared, I think about the way you looked at me yesterday. It serves as a reminder that some data is too hot to be stored in the cloud.\n\nI want to decrypt every layer of you, slowly, until we reach the kernel. No firewalls tonight. Just raw connection.",
        type: "flirty",
        isPrivate: true
    },
    {
        title: "Classified Evidence #69",
        body: "This file is strictly for the Investigator's eyes.\n\nI've been thinking about your 'investigation' techniques. You say you look for clues? Well, I've hidden a few on my body. I challenge you to find them all. \n\nWarning: The suspect is armed with dangerous levels of passion and may retaliate with aggressive kissing.",
        type: "flirty",
        isPrivate: true
    }
]

const QUOTES = [
    { text: "You are the semi-colon to my code; without you, everything breaks.", category: "playful", isPublic: true },
    { text: "In a world of variables, you are my only constant.", category: "love", isPublic: true },
    { text: "I love you more than Jack loves chicken. And that's saying a lot.", category: "playful", isPublic: true },
    { text: "Your smile is the only forensic evidence I need to prove magic exists.", category: "love", isPublic: true },
    { text: "Let's commit our changes to the main branch tonight.", category: "naughty", isPublic: false }
]

const TIMELINE_EVENTS = [
    { title: "The Collision", date: "2022-09-01", description: "The day our orbits first intersected at Sharda University. Gravity did the rest.", isPublic: true },
    { title: "First Spark", date: "2023-02-14", description: "Not just a Valentine's day, but the day the firewall came down.", isPublic: true },
    { title: "The Great Escape", date: "2024-01-10", description: "Dehradun. Just us, the mountains, and the promise of forever.", isPublic: true }
]

export async function seedContent() {
    const batch = writeBatch(db)

    // Add Love Letters
    LOVE_LETTERS.forEach(l => {
        const ref = doc(collection(db, 'letters'))
        batch.set(ref, { ...l, createdAt: new Date(), cycleIndex: Math.floor(Math.random() * 100) })
    })

    // Add Flirty Letters
    FLIRTY_LETTERS.forEach(l => {
        const ref = doc(collection(db, 'letters'))
        batch.set(ref, { ...l, createdAt: new Date(), cycleIndex: Math.floor(Math.random() * 100) })
    })

    // Add Quotes
    QUOTES.forEach(q => {
        const ref = doc(collection(db, 'quotes'))
        batch.set(ref, { ...q, createdAt: new Date() })
    })

    // Add Timeline
    TIMELINE_EVENTS.forEach(t => {
        const ref = doc(collection(db, 'timelineEvents'))
        batch.set(ref, { ...t, createdAt: new Date() })
    })

    await batch.commit()
    console.log("Universe Seeded Successfully")
}
