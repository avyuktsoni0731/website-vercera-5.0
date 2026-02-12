# Firebase Setup for Vercera 5.0

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database**
5. Create **Storage** bucket

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.example .env.local
```

Get the config from Firebase Console → Project Settings → General → Your apps.

## 3. Firestore Security Rules

**Firestore rules** (Firebase Console → Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vercera_5_participants/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /registrations/{regId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    match /members_2025/{docId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## 4. members_2025 Collection & Composite Index

The AMURoboclub member verification queries `members_2025` with:
- `enrollmentNumber`
- `facultyNumber`
- `mobile`
- `email`

Ensure your `members_2025` documents have these fields and `paymentStatus: true` for verified members.

**Composite Index:** If the verification query fails, Firebase will log a link to create the required composite index. Click it to auto-create in the Firebase Console.

## 5. Storage Rules

For Firebase Storage (images, resources):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Authentication

- Email/password is the only auth method
- Users are stored in `vercera_5_participants` collection with profile data (events they register for will be mapped in their document)
- AMURoboclub members are verified against `members_2025` before signup
