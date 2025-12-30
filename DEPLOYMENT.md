# Deployment & Operations Guide

## 1. Firebase Rules (RBAC)
Copy these rules to your Firebase Console > Firestore Database > Rules tab to enforce the security model:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    
    // 1. Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }

    // 2. Public Content (Timeline, Photos, Quotes)
    match /timelineEvents/{docId} {
        allow read: if resource.data.isPublic == true || isAdmin();
        allow write: if isAdmin();
    }
    match /photos/{docId} {
        allow read: if resource.data.isPublic == true || isAdmin();
        allow write: if isAdmin();
    }
    
    // 3. Private Content (Letters, Naughty Quotes, Bin)
    match /letters/{docId} {
        allow read, write: if isAdmin();
    }
    match /bin/{docId} {
        // Only Aadi can see the bin
        allow read, write: if isAdmin() && request.auth.token.name == 'Aadi';
    }
    
    // 4. Moods
    match /moods/{docId} {
        allow read: if request.auth != null;
        allow write: if isAdmin();
    }
  }
}
```

## 5. Visual Guide (What to Look For)
When physically verifying the universe, look for these specific upgrade signatures:

| Zone | Signature Feature | Premium Detail |
| :--- | :--- | :--- |
| **Atmosphere** | **Mood Physics** | Fog density and color shifting strictly matches Prompt specs (Pink/Teal/Gold/Purple). |
| **Timeline** | **Serpent of Memory** | A glowing, winding tube in space. Memories are **Glass Orbs** with floating sparkles. |
| **Gallery** | **Holographic Cloud** | Photos have **Holographic Glass layers** and react to hover with neon borders. |
| **Letters** | **Liquid Cores** | The Love/Flirty reactors use **Distorted Fluid materials** that ripple like liquid light. |
| **Her Corner** | **Forensic Lab** | Three giant rotating **DNA Helices** and **Glass Evidence Folders**. |
| **Jack LDR** | **Holographic Map** | A blue terrain grid with a **3D Mini Jack** hopping at current location. |
| **Favorites** | **Crystal Cave** | Memories encased in **Geometric Diamond Shards** spiraling in a Fibonacci pattern. |

## 6. Audio System
The universe supports mood-based ambient music.
1.  Add MP3 files to `public/assets/audio/` in your local folder.
2.  Filenames: `ambient_happy.mp3`, `ambient_loving.mp3`, `ambient_missing.mp3`, `ambient_conflict.mp3`, `ambient_tired.mp3`.

## 4. Environment Secrets
Ensure your `.env` variables are added to GitHub Secrets if you use GitHub Actions for automated building, or just build locally with `npm run deploy`.
