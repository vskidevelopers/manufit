'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { updateProductAction } from '@/actions/product-actions';
import { uploadImageAction } from '@/actions/uploadImage-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 't-shirt',
        basePrice: '',
        sizes: '',
        colors: '',
        isActive: true,
    });

    // Fetch Product Data
    useEffect(() => {
        console.log(`📥 [CLIENT] Fetching product ${id} for editing...`);
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Product;
                    console.log('✅ [CLIENT] Product loaded:', data.name);
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        category: data.category || '',
                        basePrice: data.basePrice ? data.basePrice.toString() : '0',
                        sizes: data.availableSizes?.join(', ') || '',
                        colors: data.availableColors?.join(', ') || '',
                        isActive: data.isActive || false,
                    });
                    setImageUrls(data.images || []);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('❌ [CLIENT] Fetch failed:', err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingImage(true);
        const file = e.target.files[0];
        const form = new FormData();
        form.append('file', file);

        const result = await uploadImageAction(form);
        if ('url' in result) {
            // TypeScript now knows result is { url: string }
            toast.success("Image uploaded successfully!");
            setImageUrls((prev) => [...prev, result.url]);
        } else {
            // TypeScript now knows result is { error: string }
            toast.error(result.error || "Upload failed");
        }
        setUploadingImage(false);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (imageUrls.length === 0) {
            setError('At least one image is required.');
            setSaving(false);
            return;
        }

        const productData = {
            name: formData.name,
            description: formData.description,
            category: formData.category as any,
            basePrice: parseFloat(formData.basePrice),
            images: imageUrls,
            availableSizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            availableColors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
            isActive: formData.isActive,
        };

        console.log('🚀 [CLIENT] Sending update request...');
        const result = await updateProductAction(id, productData);

        if (result.success) {
            toast.success("Product updated successfully!", {
                description: `${productData.name} has been saved.`,
            });
            router.push('/admin/products');
        } else {
            toast.error("Failed to update product.");
        }
    }

    if (loading) return <div className="p-8">Loading product details...</div>;
    if (error && !formData.name) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/admin/products"><Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button></Link>
                    <h2 className="text-2xl font-bold">Edit Product</h2>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    {/* (Reuse the same form fields as New Product Page, just bound to formData) */}
                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="t-shirt">T-Shirt</SelectItem>
                                <SelectItem value="hoodie">Hoodie</SelectItem>
                                <SelectItem value="kids">Kids</SelectItem>
                                <SelectItem value="decor">Decor</SelectItem>
                                <SelectItem value="merchandise">Merchandise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} required />
                    </div>

                    {/* Sizes & Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Sizes (comma separated)</Label>
                            <Input value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Colors (comma separated)</Label>
                            <Input value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label>Images</Label>
                        <div className="flex gap-2">
                            <label className="cursor-pointer px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">
                                <span>{uploadingImage ? 'Uploading...' : 'Add Image'}</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                            </label>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-square">
                                    <img src={url} className="w-full h-full object-cover rounded border" />
                                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                    <Button type="submit" disabled={saving || uploadingImage} className="w-full">
                        {saving ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}