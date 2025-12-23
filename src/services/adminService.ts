import { supabase } from '@/lib/supabase';

export interface Destination {
    id?: number;
    name: string;
    description: string;
    country: string;
    city: string;
    price: number;
    image: string;
    created_at?: string;
}

export interface Booking {
    id: string | number;
    user_id: string;
    destination_id: number;
    status: 'pending' | 'approved' | 'cancelled';
    created_at: string;
    // Add other fields as needed based on actual table structure
    user_name?: string;
    user_email?: string;
    destinations?: Destination;
}

export const adminService = {
    // Destinations
    getDestinations: async () => {
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    createDestination: async (destination: Destination) => {
        const { data, error } = await supabase
            .from('destinations')
            .insert([destination])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateDestination: async (id: number | string, updates: Partial<Destination>) => {
        const { data, error } = await supabase
            .from('destinations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteDestination: async (id: number | string) => {
        const { error } = await supabase
            .from('destinations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Bookings
    getBookings: async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                destinations (name, image)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    updateBookingStatus: async (id: number | string, status: 'approved' | 'cancelled') => {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteBooking: async (id: number | string) => {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
