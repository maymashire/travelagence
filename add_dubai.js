import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDubai() {
    console.log('Adding Dubai to Supabase...');

    const { data, error } = await supabase
        .from('destinations')
        .insert([{
            name: 'Dubai',
            description: 'Discover the city of the future, where ultra-modern skyscrapers meet traditional souks and golden desert dunes.',
            country: 'United Arab Emirates',
            city: 'Dubai',
            price: 500,
            image: 'https://images.pexels.com/photos/2086765/pexels-photo-2086765.jpeg'
        }])
        .select();

    if (error) {
        console.error('Error adding Dubai:', error.message);
    } else {
        console.log('Dubai added successfully:', data);
    }
}

addDubai();
