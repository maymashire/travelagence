import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log('Checking if table "destinations" exists...');

    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting from destinations:', error.message);
        if (error.code === '42P01') { // undefined_table
            console.log('TABLE DOES NOT EXIST. Please create the "destinations" table in Supabase.');
        }
        return;
    }

    console.log('Table exists. Rows found:', data.length);

    console.log('Attempting to insert a test row...');
    const { data: insertData, error: insertError } = await supabase
        .from('destinations')
        .insert([{
            name: 'Debug Dest',
            description: 'Debug Desc',
            country: 'Debug Country',
            city: 'Debug City',
            price: 100,
            image: 'debug.jpg'
        }])
        .select();

    if (insertError) {
        console.error('Insert failed:', insertError.message);
        console.error('Error details:', insertError.details);
        console.error('Error hint:', insertError.hint);
        console.error('Error code:', insertError.code);
    } else {
        console.log('Insert successful:', insertData);
        // Clean up
        await supabase.from('destinations').delete().eq('id', insertData[0].id);
    }
}

debug();
