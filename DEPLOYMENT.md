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

## 2. Populating Content (The "Start Sequence")
Once the site is live:
1.  **Open the Application**: Go to your GitHub Pages URL (e.g., `https://aditya0kmr.github.io/Encrypted-Embrace/`).
2.  **Login as Architect**:
    - Click **Aadi**.
    - Code: `15062024`
    - Password: `admin123`
3.  **Inject Memories**: 
    - **Before** clicking "Fuse Crystals", look at the bottom of the login box.
    - Click the small hidden button: `[ARCHITECT PROTOCOL: SEED CONTENT]`.
    - Wait for the alert: "Universe Expanded with New Memories".
    - *Now* click **Fuse Crystals** to enter.

## 3. Audio System
The universe supports mood-based ambient music.
1.  Add MP3 files to `public/assets/audio/` in your local folder.
2.  Filenames must be:
    - `ambient_happy.mp3`
    - `ambient_loving.mp3`
    - `ambient_missing.mp3`
    - `ambient_conflict.mp3`
    - `ambient_tired.mp3`
3.  Commit and push:
    ```bash
    git add public/assets/audio/*.mp3
    git commit -m "Add ambient music"
    git push origin main
    ```

## 4. Deployment to GitHub Pages
Deployment is now **AUTOMATED**.
1.  Anytime you push to `main`, a GitHub Action will build and deploy the site.
2.  Check the "Actions" tab in your GitHub Repo to see the progress.
3.  No need to run `npm run deploy` manually anymore.

## 4. Environment Secrets
Ensure your `.env` variables are added to GitHub Secrets if you use GitHub Actions for automated building, or just build locally with `npm run deploy`.
