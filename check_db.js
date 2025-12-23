import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- START ---');

    // Try to insert with 'name'
    const row1 = {
        name: 'Test Dest Name',
        description: 'Desc',
        country: 'Country',
        city: 'City',
        price: 100,
        image: 'img.jpg'
    };

    console.log('Attempting insert with "name"...');
    const { error: err1 } = await supabase.from('destinations').insert([row1]);

    if (err1) {
        console.log('Insert with "name" failed:', err1.message, err1.details, err1.hint);

        // Try with 'destination_name'
        const row2 = {
            destination_name: 'Test Dest Name',
            description: 'Desc',
            country: 'Country',
            city: 'City',
            price: 100,
            image: 'img.jpg'
        };
        console.log('Attempting insert with "destination_name"...');
        const { error: err2 } = await supabase.from('destinations').insert([row2]);

        if (err2) {
            console.log('Insert with "destination_name" also failed:', err2.message);
        } else {
            console.log('Insert with "destination_name" SUCCESS!');
        }
    } else {
        console.log('Insert with "name" SUCCESS!');
    }

    console.log('--- END ---');
}

checkSchema();
