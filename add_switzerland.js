import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSwitzerland() {
    console.log('Adding Switzerland to Supabase...');

    const { data, error } = await supabase
        .from('destinations')
        .insert([{
            name: 'Switzerland',
            description: 'Experience the breathtaking beauty of the Swiss Alps, where snow-capped peaks meet crystal-clear lakes and charming mountain villages.',
            country: 'Switzerland',
            city: 'Zermatt',
            price: 400,
            image: 'https://images.pexels.com/photos/34192225/pexels-photo-34192225.jpeg'
        }])
        .select();

    if (error) {
        console.error('Error adding Switzerland:', error.message);
    } else {
        console.log('Switzerland added successfully:', data);
    }
}

addSwitzerland();
