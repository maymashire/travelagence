import { useState, useEffect } from 'react';
import { adminService, Destination } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { MOCK_DESTINATIONS } from '@/services/api';

export function AdminDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<Destination>({
        name: '',
        description: '',
        country: '',
        city: '',
        price: 0,
        image: ''
    });

    useEffect(() => {
        loadDestinations();
    }, []);

    const loadDestinations = async () => {
        try {
            const data = await adminService.getDestinations();
            setDestinations(data || []);
        } catch (error) {
            console.error('Failed to load destinations', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will add mock destinations to the database. Continue?')) return;
        setIsLoading(true);
        try {
            for (const dest of MOCK_DESTINATIONS) {
                await adminService.createDestination({
                    name: dest.name,
                    description: dest.description,
                    country: dest.country,
                    city: dest.city,
                    price: dest.price,
                    image: dest.image
                });
            }
            await loadDestinations();
            alert('Database seeded successfully!');
        } catch (error: any) {
            console.error('Failed to seed database', error);
            alert(`Failed to seed database: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (destination?: Destination) => {
        if (destination) {
            setEditingId(destination.id!);
            setFormData({
                name: destination.name,
                description: destination.description,
                country: destination.country,
                city: destination.city,
                price: destination.price,
                image: destination.image
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                country: '',
                city: '',
                price: 0,
                image: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (editingId) {
                await adminService.updateDestination(editingId, formData);
            } else {
                await adminService.createDestination(formData);
            }
            await loadDestinations();
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Failed to save destination', error);
            alert('Failed to save destination');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;
        try {
            await adminService.deleteDestination(id);
            setDestinations(destinations.filter(d => d.id !== id));
        } catch (error) {
            console.error('Failed to delete destination', error);
            alert('Failed to delete destination');
        }
    };

    const filteredDestinations = destinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
                    <p className="text-muted-foreground">Manage travel destinations.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSeed} disabled={destinations.length > 0}>
                            Seed
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => handleOpenDialog()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Paris" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Country</Label>
                                            <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="e.g. France" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>City</Label>
                                            <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Paris" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price ($)</Label>
                                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="299" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image URL</Label>
                                        <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description..." rows={4} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border bg-white shadow-sm">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {filteredDestinations.map((dest) => (
                            <tr key={dest.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">
                                    <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 align-middle font-medium">{dest.name}</td>
                                <td className="p-4 align-middle text-muted-foreground">{dest.city}, {dest.country}</td>
                                <td className="p-4 align-middle font-bold text-primary">${dest.price}</td>
                                <td className="p-4 align-middle text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(dest)}>
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(dest.id!)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredDestinations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No destinations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredDestinations.map((dest) => (
                    <Card key={dest.id} className="overflow-hidden">
                        <div className="relative h-48">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => handleOpenDialog(dest)}>
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => handleDelete(dest.id!)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{dest.name}</h3>
                                    <p className="text-sm text-muted-foreground">{dest.city}, {dest.country}</p>
                                </div>
                                <span className="font-bold text-primary">${dest.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{dest.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
