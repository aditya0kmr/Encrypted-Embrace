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

## 2. Populating Content
Since there is no complex Admin Dashboard yet, use the **Firebase Console** to add initial data manually or use the 3D "Inject Signal" button in the Letters Planet.
- **Collection**: `timelineEvents`
  - Fields: `title` (string), `year` (string), `img` (URL string).
- **Collection**: `photos`
  - Fields: `imageURL` (string), `captionText` (string).
- **Collection**: `letters`
  - Fields: `title`, `body`, `type` ("love" or "flirty").

## 3. Deployment to GitHub Pages
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for launch"
   git push origin main
   ```
2. The `gh-pages` package is already installed. Deploy triggers manually via:
   ```bash
   npm run deploy
   ```
   *Make sure your repo settings on GitHub have Pages enabled for the `gh-pages` branch.*

## 4. Environment Secrets
Ensure your `.env` variables are added to GitHub Secrets if you use GitHub Actions for automated building, or just build locally with `npm run deploy`.
