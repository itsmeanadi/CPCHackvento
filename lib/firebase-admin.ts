import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

let _adminDb: ReturnType<typeof getFirestore> | null = null;

export const initAdmin = () => {
    if (getApps().length <= 0) {
        // Validate credentials first
        if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
            throw new Error(
                "Missing Firebase Admin credentials. Please add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to your .env.local file.\n" +
                "Get these from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key"
            );
        }

        try {
            initializeApp({
                credential: cert(serviceAccount),
            });
            _adminDb = getFirestore();
        } catch (error) {
            console.error("Firebase Admin initialization failed:", error);
            throw error;
        }
    } else if (!_adminDb) {
        _adminDb = getFirestore();
    }
};

export const getAdminDb = () => {
    if (!_adminDb) {
        initAdmin();
    }
    return _adminDb!;
};
