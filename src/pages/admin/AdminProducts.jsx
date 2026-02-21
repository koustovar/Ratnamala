// src/pages/admin/AdminProducts.jsx
import { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchByProductId,
    uploadProductImage,
} from '../../services/productService';

const CATEGORIES = ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Pendants', 'Sets', 'Other'];

const EMPTY_FORM = {
    name: '',
    category: '',
    description: '',
    material: '',
    weight: '',
    purity: '',
    stone: '',
};

// ── Product Form Modal ──────────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSaved }) => {
    const isEdit = !!product;
    const [form, setForm] = useState(
        isEdit
            ? {
                name: product.name || '',
                category: product.category || '',
                description: product.description || '',
                material: product.material || '',
                weight: product.weight || '',
                purity: product.purity || '',
                stone: product.stone || '',
            }
            : EMPTY_FORM
    );
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState(
        isEdit ? [product.mainImage, ...(product.images || [])].filter(Boolean) : []
    );
    const [existingImages, setExistingImages] = useState(
        isEdit ? [product.mainImage, ...(product.images || [])].filter(Boolean) : []
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setImageFiles((prev) => [...prev, ...files]);
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (idx) => {
        const totalExisting = existingImages.length;
        if (idx < totalExisting) {
            setExistingImages((prev) => prev.filter((_, i) => i !== idx));
        } else {
            const fileIdx = idx - totalExisting;
            setImageFiles((prev) => prev.filter((_, i) => i !== fileIdx));
        }
        setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Product name is required.'); return; }
        setSaving(true);
        setError('');

        try {
            // Upload new images
            const productId = isEdit ? product.productId : 'TEMP';
            const uploadedUrls = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const url = await uploadProductImage(imageFiles[i], productId, Date.now() + i);
                uploadedUrls.push(url);
            }

            const allImages = [...existingImages, ...uploadedUrls];
            const mainImage = allImages[0] || null;
            const rest = allImages.slice(1);

            const payload = {
                ...form,
                mainImage,
                images: rest,
            };

            if (isEdit) {
                await updateProduct(product.id, payload);
            } else {
                const { productId: newId } = await addProduct(payload);
                // If we had temp uploaded images, they'll be under TEMP prefix — acceptable for now
                _ = newId;
            }
            onSaved();
        } catch (err) {
            setError(err.message || 'Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    // Suppress unused variable warning
    const _ = null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
            <div className="bg-emerald-950 border border-emerald-800 rounded-sm w-full max-w-xl shadow-card animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-emerald-800">
                    <h2 className="font-serif text-xl text-ivory">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-ivory-muted hover:text-ivory transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && (
                        <div className="bg-red-900/20 border border-red-700/40 rounded-sm px-4 py-3">
                            <p className="font-sans text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="label">Product Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                            placeholder="e.g. Royal Kundan Necklace"
                            className="input-field" />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="label">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="input-field">
                            <option value="">Select category…</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                            placeholder="Describe this jewellery piece…"
                            className="input-field resize-none" />
                    </div>

                    {/* Details row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Material</label>
                            <input name="material" value={form.material} onChange={handleChange}
                                placeholder="e.g. 22K Gold"
                                className="input-field" />
                        </div>
                        <div>
                            <label className="label">Weight</label>
                            <input name="weight" value={form.weight} onChange={handleChange}
                                placeholder="e.g. 12.5g"
                                className="input-field" />
                        </div>
                        <div>
                            <label className="label">Purity</label>
                            <input name="purity" value={form.purity} onChange={handleChange}
                                placeholder="e.g. 22 Karat"
                                className="input-field" />
                        </div>
                        <div>
                            <label className="label">Stone / Gem</label>
                            <input name="stone" value={form.stone} onChange={handleChange}
                                placeholder="e.g. Ruby, Emerald"
                                className="input-field" />
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="label">Images</label>
                        {/* Previews grid */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {imagePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-emerald-700">
                                        <img src={preview} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gold/80 text-emerald-950 text-[8px] font-sans font-semibold tracking-widest text-center py-0.5">
                                                MAIN
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload-input"
                        />
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="btn-outline-gold text-xs py-2 w-full"
                        >
                            + Add Images
                        </button>
                        <p className="font-sans text-ivory-muted text-[10px] mt-1">First image will be the main display image.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-emerald-800">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-emerald-700 rounded-sm">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            id="product-save-btn"
                            className="btn-gold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                                    Saving…
                                </span>
                            ) : (
                                isEdit ? 'Update Product' : 'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Delete Confirmation Modal ──────────────────────────────────────────────────
const DeleteModal = ({ product, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(product.id);
            onDeleted();
        } catch {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-emerald-950 border border-red-700/40 rounded-sm w-full max-w-sm shadow-card animate-fade-in p-6 space-y-5">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-red-900/30 border border-red-700/40 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="font-serif text-xl text-ivory">Delete Product?</h3>
                    <p className="font-sans text-ivory-muted text-sm leading-relaxed">
                        Are you sure you want to delete <strong className="text-ivory">{product.name}</strong>?
                        <br />This action cannot be undone.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-ghost flex-1 border border-emerald-700 rounded-sm text-xs">
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        id="confirm-delete-btn"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white font-sans text-xs tracking-widest uppercase rounded-sm transition-colors disabled:opacity-50"
                    >
                        {deleting ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Admin Products Page ───────────────────────────────────────────────────
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isSearchById, setIsSearchById] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const all = await getAllProducts();
            setProducts(all);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) { fetchProducts(); setIsSearchById(false); return; }
        if (search.trim().length === 5) {
            setLoading(true);
            try {
                const results = await searchByProductId(search.trim());
                setProducts(results);
                setIsSearchById(true);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        } else {
            // Client-side filter by name
            setIsSearchById(false);
        }
    };

    const filteredProducts = isSearchById
        ? products
        : products.filter((p) =>
            !search.trim() ||
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.productId?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-serif text-3xl text-ivory">Products</h1>
                    <p className="font-sans text-ivory-muted text-sm mt-0.5">{products.length} piece{products.length !== 1 ? 's' : ''} in catalogue</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    id="add-product-btn"
                    className="btn-gold text-xs py-2.5 px-5"
                >
                    + Add Product
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        id="admin-product-search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (!e.target.value.trim()) { fetchProducts(); setIsSearchById(false); }
                        }}
                        placeholder="Search by name or 5-char product ID…"
                        className="input-field pl-10"
                    />
                </div>
                <button type="submit" className="btn-outline-gold text-xs px-4">Search</button>
            </form>

            {/* Table / List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                    <div className="text-4xl opacity-20">💎</div>
                    <p className="font-serif text-lg text-ivory-muted italic">No products found</p>
                    {search && (
                        <button onClick={() => { setSearch(''); fetchProducts(); setIsSearchById(false); }}
                            className="btn-outline-gold text-xs mt-2">
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-emerald-950 border border-emerald-800 rounded-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[3rem_1fr_6rem_8rem_7rem_6rem] gap-4 px-5 py-3 border-b border-emerald-800 bg-emerald-900/40">
                        {['Image', 'Product', 'ID', 'Category', 'Weight', 'Actions'].map((h) => (
                            <span key={h} className="font-sans text-[10px] text-ivory-muted tracking-widest uppercase">{h}</span>
                        ))}
                    </div>

                    <div className="divide-y divide-emerald-800">
                        {filteredProducts.map((p) => {
                            const img = p.mainImage || p.images?.[0];
                            return (
                                <div
                                    key={p.id}
                                    className="flex flex-col md:grid md:grid-cols-[3rem_1fr_6rem_8rem_7rem_6rem] gap-3 md:gap-4 px-5 py-4 hover:bg-emerald-800/20 transition-colors duration-150"
                                >
                                    {/* Image */}
                                    <div className="hidden md:flex items-center">
                                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-emerald-900 border border-emerald-700 flex-shrink-0">
                                            {img ? (
                                                <img src={img} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-ivory-muted">💎</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name + mobile ID */}
                                    <div className="flex items-center min-w-0">
                                        {img && (
                                            <div className="md:hidden w-10 h-10 rounded-sm overflow-hidden bg-emerald-900 border border-emerald-700 flex-shrink-0 mr-3">
                                                <img src={img} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-sans text-sm text-ivory truncate">{p.name}</p>
                                            <span className="md:hidden font-sans text-[10px] text-gold tracking-widest">#{p.productId}</span>
                                        </div>
                                    </div>

                                    {/* ID */}
                                    <div className="hidden md:flex items-center">
                                        <span className="badge-gold text-[10px]">#{p.productId}</span>
                                    </div>

                                    {/* Category */}
                                    <div className="hidden md:flex items-center">
                                        <span className="font-sans text-xs text-ivory-muted">{p.category || '—'}</span>
                                    </div>

                                    {/* Weight */}
                                    <div className="hidden md:flex items-center">
                                        <span className="font-sans text-xs text-ivory-muted">{p.weight || '—'}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditProduct(p)}
                                            id={`edit-${p.productId}`}
                                            title="Edit"
                                            className="p-1.5 text-ivory-muted hover:text-gold transition-colors rounded-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(p)}
                                            id={`delete-${p.productId}`}
                                            title="Delete"
                                            className="p-1.5 text-ivory-muted hover:text-red-400 transition-colors rounded-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <ProductModal
                    onClose={() => setShowAddModal(false)}
                    onSaved={() => { setShowAddModal(false); fetchProducts(); }}
                />
            )}
            {editProduct && (
                <ProductModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSaved={() => { setEditProduct(null); fetchProducts(); }}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => { setDeleteTarget(null); fetchProducts(); }}
                />
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
