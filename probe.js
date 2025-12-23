import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function probe() {
    // 1. Try insert with 'name'
    const { error: err1 } = await supabase.from('destinations').insert([{
        name: 'Probe Name',
        description: 'd', country: 'c', city: 'c', price: 1, image: 'i'
    }]);

    if (!err1) {
        console.log('Column is "name"');
        return;
    }
    console.log('Error with "name":', err1.message);

    // 2. Try insert with 'destination_name'
    const { error: err2 } = await supabase.from('destinations').insert([{
        destination_name: 'Probe Name',
        description: 'd', country: 'c', city: 'c', price: 1, image: 'i'
    }]);

    if (!err2) {
        console.log('Column is "destination_name"');
        return;
    }
    console.log('Error with "destination_name":', err2.message);
}

probe();
