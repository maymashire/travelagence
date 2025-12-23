import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { User, Mail, Phone, Camera, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { toast } from 'sonner';

export function Profile() {
    const { user, refreshUser, updateLocalUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            // Check if it's the bypass admin
            if (user?.id === 'admin-id') {
                updateLocalUser({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                });
                setIsEditing(false);
                toast.success('Profile updated successfully (Local Admin)!');
                return;
            }

            // Real Supabase Auth update
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Auth session missing! Please log in again.');
            }

            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                }
            });

            if (authError) throw authError;

            // Also update public users table if it exists
            await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user?.id);

            await refreshUser();
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(`Failed to update profile: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl pt-24">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid gap-8">
                {/* Profile Card */}
                <Card className="shadow-lg border-none overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <CardContent className="relative pt-0 pb-8 px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-6 gap-6">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                                    <AvatarImage src={formData.avatar_url} />
                                    <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                                        S
                                    </AvatarFallback>
                                </Avatar>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Update Profile Picture</DialogTitle>
                                            <DialogDescription>
                                                Upload a new photo from your device or provide an image URL.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-4">
                                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors cursor-pointer relative group" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                                    <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                                        <Camera className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">Click to upload from device</p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF (max. 2MB)</p>
                                                    <input
                                                        id="avatar-upload"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            setIsLoading(true);
                                                            try {
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

                                                                const { error: uploadError } = await supabase.storage
                                                                    .from('avatars')
                                                                    .upload(fileName, file);

                                                                if (uploadError) throw uploadError;

                                                                const { data: { publicUrl } } = supabase.storage
                                                                    .from('avatars')
                                                                    .getPublicUrl(fileName);

                                                                setFormData({ ...formData, avatar_url: publicUrl });

                                                                // Update profile immediately
                                                                if (user?.id === 'admin-id') {
                                                                    updateLocalUser({ avatar_url: publicUrl });
                                                                    toast.success('Avatar uploaded successfully (Local Admin)!');
                                                                } else {
                                                                    const { error: authError } = await supabase.auth.updateUser({
                                                                        data: { avatar_url: publicUrl }
                                                                    });
                                                                    if (authError) throw authError;
                                                                    await refreshUser();
                                                                    toast.success('Avatar uploaded successfully!');
                                                                }
                                                            } catch (error: any) {
                                                                console.error('Upload error:', error);
                                                                toast.error(`Upload failed: ${error.message}. Ensure you have a public "avatars" bucket in Supabase Storage.`);
                                                            } finally {
                                                                setIsLoading(false);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <span className="w-full border-t" />
                                                    </div>
                                                    <div className="relative flex justify-center text-xs uppercase">
                                                        <span className="bg-white px-2 text-muted-foreground">Or use URL</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Image URL</Label>
                                                    <Input
                                                        value={formData.avatar_url}
                                                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                                        placeholder="https://example.com/avatar.jpg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                                <Avatar className="w-24 h-24 border-2 border-white shadow-sm">
                                                    <AvatarImage src={formData.avatar_url} />
                                                    <AvatarFallback><span className="text-2xl font-bold">S</span></AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={() => handleUpdateProfile()} disabled={isLoading} className="w-full">
                                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Save Changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex-1 pt-2">
                                <h2 className="text-2xl font-bold text-gray-900">{user?.full_name}</h2>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {user?.email}
                                </p>
                                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {user?.role} Account
                                </div>
                            </div>
                            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "default"}>
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </Button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="fullName"
                                                className="pl-9"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                className="pl-9"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 mt-8 border-t pt-8">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs">Email Address</p>
                                                <p className="font-medium">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs">Phone Number</p>
                                                <p className="font-medium">{user?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                            Change Password
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start">
                                            Notification Preferences
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
