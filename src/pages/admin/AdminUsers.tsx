import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Search, User } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    phone?: string;
    avatar_url?: string;
    created_at: string;
}

export function AdminUsers() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({ full_name: '', email: '', role: 'user' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            let allUsers = data || [];

            // Add bypass admin if not present
            if (!allUsers.find(u => u.email === 'maymashire177@gmail.com')) {
                allUsers = [{
                    id: 'admin-id',
                    email: 'maymashire177@gmail.com',
                    full_name: 'System Admin',
                    role: 'admin',
                    created_at: new Date().toISOString()
                }, ...allUsers];
            }

            setUsers(allUsers);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                // Check if it's the bypass admin
                if (editingUser.id === 'admin-id') {
                    // Update locally only
                    setUsers(users.map(u => u.id === 'admin-id' ? { ...u, full_name: formData.full_name, role: formData.role } : u));
                    setIsDialogOpen(false);
                    setEditingUser(null);
                    return;
                }

                // Update existing user in database
                const { error } = await supabase
                    .from('users')
                    .update({
                        full_name: formData.full_name,
                        role: formData.role
                    })
                    .eq('id', editingUser.id);

                if (error) throw error;
            } else {
                // Create new user (Note: This only creates a profile record, not an auth user. 
                // Real auth user creation requires admin API or client-side signUp which logs in the new user)
                // For this demo, we will simulate creating a profile.
                alert("Note: To create a fully functional user, they must sign up via the registration page. This action only creates a profile record.");

                const { error } = await supabase
                    .from('users')
                    .insert([{
                        id: crypto.randomUUID(), // Mock ID since we aren't creating a real auth user here
                        email: formData.email,
                        full_name: formData.full_name,
                        role: formData.role
                    }]);

                if (error) throw error;
            }

            fetchUsers();
            setIsDialogOpen(false);
            setEditingUser(null);
            setFormData({ full_name: '', email: '', role: 'user' });
        } catch (error) {
            console.error('Failed to save user', error);
            alert('Failed to save user');
        }
    };

    const handleDelete = async (id: string) => {
        if (id === 'admin-id') {
            alert('Cannot delete the system admin account.');
            return;
        }
        if (!confirm('Are you sure you want to delete this user profile?')) return;
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-muted-foreground">Manage system users and their roles.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingUser(null); setFormData({ full_name: '', email: '', role: 'user' }); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? 'Update the details for this user profile.' : 'Create a new user profile record.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    disabled={!!editingUser} // Prevent changing email for existing users to avoid sync issues
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm max-w-md">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setFormData({
                                                            full_name: user.full_name,
                                                            email: user.email,
                                                            role: user.role
                                                        });
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
