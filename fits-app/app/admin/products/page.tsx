'use client';

import { useEffect, useState } from 'react';
import { getCollectionInDb } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteProductAction } from '@/actions/product-actions';
import { toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        // Find product to get images
        const productToDelete = products.find(p => p.id === deleteId);
        const images = productToDelete?.images || [];

        console.log(`🗑️ [CLIENT] Confirming delete for ${deleteId}`);
        const result = await deleteProductAction(deleteId, images);

        if (result.success) {
            toast.success("Product deleted", {
                description: "Images removed from Cloudinary and data cleared.",
            });
            setDeleteId(null);
            window.location.reload();
        } else {
            toast.error("Deletion failed", {
                description: "Could not remove product. Check console.",
            });
        }
        setIsDeleting(false);
    };

    useEffect(() => {
        console.log('📄 [CLIENT] ProductsPage mounted. Fetching data...');
        const fetchProducts = async () => {
            try {
                const data = await getCollectionInDb('products');
                console.log(`✅ [CLIENT] Fetched ${data?.length} total products.`);
                console.log(`✅ [CLIENT] Products Fetched ${data} `);
                setProducts(data);
            } catch (error) {
                console.error('❌ [CLIENT] Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);


    const formatCurrency = (amount: number | undefined) => {
        const currency = "Ksh";
        if (amount == null) {
            return `${currency} 0.00`;
        }
        return `${currency} ${amount.toLocaleString()}`;
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><p className="animate-pulse">Loading...</p></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Products Inventory</h2>
                <Link href="/admin/products/new">
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="border rounded-lg p-12 text-center bg-white">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <Link href="/admin/products/new"><Button>Add Product</Button></Link>
                </div>
            ) : (
                // WRAPPER USAGE
                <PaginationWrapper
                    totalItems={products.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                >
                    {({ startIndex, endIndex }) => {
                        // Slice the data based on indices provided by the wrapper
                        const currentProducts = products.slice(startIndex, endIndex);

                        return (
                            <div className="border rounded-lg bg-white overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Sizes</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentProducts.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell className="capitalize">{product.category}</TableCell>
                                                <TableCell>{formatCurrency(product?.basePrice)}</TableCell>
                                                <TableCell><span className="text-xs text-gray-500">{product.availableSizes?.join(', ') || 'N/A'}</span></TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/products/edit/${product.id}`}>
                                                            <Button variant="outline" size="sm"><Edit size={16} /></Button>
                                                        </Link>

                                                        <Dialog open={deleteId === product.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                                            <DialogTrigger asChild>
                                                                <Button variant="destructive" size="sm" onClick={() => setDeleteId(product.id!)}>
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This will permanently delete the product <strong>{product.name}</strong> and remove all associated images from Cloudinary. This cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                                                                    <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
                                                                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        );
                    }}
                </PaginationWrapper>
            )}
        </div>
    );
}