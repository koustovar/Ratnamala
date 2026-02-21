// src/services/productService.js
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const PRODUCTS_COLLECTION = 'products';

// ── Generate unique 5-char alphanumeric ID ────────────────────────────────────
export const generateProductId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

// ── Ensure uniqueness by checking Firestore ────────────────────────────────────
export const generateUniqueProductId = async () => {
    let id = generateProductId();
    let exists = true;
    while (exists) {
        const q = query(collection(db, PRODUCTS_COLLECTION), where('productId', '==', id));
        const snap = await getDocs(q);
        if (snap.empty) {
            exists = false;
        } else {
            id = generateProductId();
        }
    }
    return id;
};

// ── Upload image to Firebase Storage ─────────────────────────────────────────
export const uploadProductImage = async (file, productId, index = 0) => {
    const ext = file.name.split('.').pop();
    const storageRef = ref(storage, `products/${productId}/image_${index}.${ext}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

// ── Delete image from Firebase Storage ───────────────────────────────────────
export const deleteProductImage = async (imageUrl) => {
    try {
        const imgRef = ref(storage, imageUrl);
        await deleteObject(imgRef);
    } catch {
        // ignore if image doesn't exist
    }
};

// ── Add product ────────────────────────────────────────────────────────────────
export const addProduct = async (productData) => {
    const productId = await generateUniqueProductId();
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        productId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, productId };
};

// ── Update product ─────────────────────────────────────────────────────────────
export const updateProduct = async (docId, productData) => {
    const productRef = doc(db, PRODUCTS_COLLECTION, docId);
    await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp(),
    });
};

// ── Delete product ─────────────────────────────────────────────────────────────
export const deleteProduct = async (docId) => {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, docId));
};

// ── Fetch all products ─────────────────────────────────────────────────────────
export const getAllProducts = async () => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── Fetch single product by Firestore doc ID ──────────────────────────────────
export const getProductById = async (docId) => {
    const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, docId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

// ── Search products by 5-char productId field ─────────────────────────────────
export const searchByProductId = async (productId) => {
    const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('productId', '==', productId.toUpperCase())
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── Fetch products by category ─────────────────────────────────────────────────
export const getProductsByCategory = async (category) => {
    const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── Fetch featured products ────────────────────────────────────────────────────
export const getFeaturedProducts = async (count = 6) => {
    const q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
