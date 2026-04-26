// app/admin/quotes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getQuotesAction, updateQuoteStatus, QuoteRequest } from '@/actions/quote-actions';
import { toast } from 'sonner';
import { Loader2, Search, Phone, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
    quoted: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
};

const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    try {
        const date = timestamp.toDate?.() || new Date(timestamp);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
        });
    } catch {
        return 'Invalid date';
    }
};

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    const loadQuotes = async () => {
        setLoading(true);
        const data = await getQuotesAction();
        setQuotes(data);
        setLoading(false);
    };

    useEffect(() => {
        loadQuotes();
    }, []);



    const handleStatusUpdate = async () => {
        if (!selectedQuote || !newStatus) return;

        setUpdating(true);
        const result = await updateQuoteStatus(selectedQuote.id!, newStatus as any, notes);

        if (result.success) {
            toast.success('Quote updated', { description: result.message });
            loadQuotes();
            setIsDialogOpen(false);
            setSelectedQuote(null);
            setNotes('');
        } else {
            toast.error('Update failed', { description: result.error });
        }
        setUpdating(false);
    };

    const openStatusDialog = (quote: QuoteRequest) => {
        setSelectedQuote(quote);
        setNewStatus(quote.status);
        setNotes(quote.notes || '');
        setIsDialogOpen(true);
    };

    const filteredQuotes = quotes.filter((quote) => {
        const matchesSearch =
            quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.customerPhone?.includes(searchTerm) ||
            quote.organization?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: quotes.length,
        pending: quotes.filter((q) => q.status === 'pending').length,
        converted: quotes.filter((q) => q.status === 'converted').length,
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Quote Requests</h1>
                    <p className="text-slate-600 text-sm mt-1">Manage bulk order inquiries</p>
                </div>
                <Button onClick={loadQuotes} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">Total Quotes</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">Converted</p>
                    <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, phone, or organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Quotes Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredQuotes.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No quotes found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Customer</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Item</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Quantity</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                                    <th className="text-right p-4 text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotes.map((quote) => (
                                    <tr key={quote.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="font-medium text-slate-900">{quote.customerName}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Phone className="h-3 w-3" />
                                                    {quote.customerPhone}
                                                </div>
                                                {quote.organization && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Building className="h-3 w-3" />
                                                        {quote.organization}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{quote.itemType}</td>
                                        <td className="p-4 text-sm font-medium text-slate-900">{quote.quantity}</td>
                                        <td className="p-4">
                                            <Badge className={STATUS_COLORS[quote.status] || 'bg-slate-100 text-slate-700'}>
                                                {quote.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(quote.createdAt)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openStatusDialog(quote)}
                                            >
                                                Update
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Status Update Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Quote Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {selectedQuote && (
                            <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                <p className="font-medium">{selectedQuote.customerName}</p>
                                <p className="text-slate-500">{selectedQuote.itemType} × {selectedQuote.quantity}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="status">New Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="quoted">Quoted</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                    <SelectItem value="lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                rows={3}
                                placeholder="Add internal notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleStatusUpdate} disabled={updating}>
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}