// src/services/userService.js
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const USERS_COLLECTION = 'users';

export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { email } = user;
        try {
            await setDoc(userRef, {
                email,
                role: 'user',
                favorites: [],
                createdAt: new Date(),
                ...additionalData,
            });
        } catch (error) {
            console.error('Error creating user document', error);
        }
    }
};

export const toggleFavorite = async (uid, productId) => {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const favorites = snapshot.data().favorites || [];
        if (favorites.includes(productId)) {
            await updateDoc(userRef, {
                favorites: arrayRemove(productId)
            });
            return false; // Removed
        } else {
            await updateDoc(userRef, {
                favorites: arrayUnion(productId)
            });
            return true; // Added
        }
    }
};

export const getUserFavorites = async (uid) => {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data().favorites || [];
    }
    return [];
};
