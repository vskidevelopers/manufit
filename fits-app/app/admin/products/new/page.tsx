'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProductAction } from '@/actions/product-actions';
import { uploadImageAction } from '@/actions/uploadImage-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';


// Install textarea if you haven't: npx shadcn@latest add textarea

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 't-shirt',
        basePrice: '',
        sizes: '',
        colors: '',
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploadingImage(true);
        const file = e.target.files[0];
        const form = new FormData();
        form.append('file', file);

        const result = await uploadImageAction(form);
        console.log('☁️ [CLIENT] Image upload result:', result);
        if ('url' in result) {
            // TypeScript now knows result is { url: string }
            toast.success("Image uploaded successfully!");
            setImageUrls((prev) => [...prev, result.url]);
        } else {
            // TypeScript now knows result is { error: string }
            toast.error(result.error || "Upload failed");
        }
        setUploadingImage(false);
        e.target.value = ''; // Reset input
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (imageUrls.length === 0) {
            setError('Please upload at least one product image.');
            setLoading(false);
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
            isActive: true,
        };

        const result = await createProductAction(productData);
        console.log('🛍️ [CLIENT] Create product result:', result);

        if (result.success) {
            router.push('/admin/products');
        } else {
            setError('Failed to save product.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Name & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Premium Cotton T-Shirt"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, category: val })} defaultValue={formData.category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="t-shirt">T-Shirt</SelectItem>
                                        <SelectItem value="hoodie">Hoodie</SelectItem>
                                        <SelectItem value="kids">Kids Wear</SelectItem>
                                        <SelectItem value="decor">Office Decor</SelectItem>
                                        <SelectItem value="merchandise">Merchandise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Product Images</Label>
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors">
                                        <Upload size={16} />
                                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {imageUrls.map((url, idx) => (
                                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden border">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the product material, fit, etc."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>



                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Base Price (KSh)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="1500"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                required
                            />
                        </div>

                        {/* Sizes & Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sizes">Available Sizes (comma separated)</Label>
                                <Input
                                    id="sizes"
                                    placeholder="S, M, L, XL"
                                    value={formData.sizes}
                                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colors">Available Colors (comma separated)</Label>
                                <Input
                                    id="colors"
                                    placeholder="Red, Blue, Black"
                                    value={formData.colors}
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                />
                            </div>
                        </div>



                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading || uploadingImage}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}