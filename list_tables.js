import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        console.error('Error listing tables:', error);
        // Fallback: try a simple query on 'destinations' to see if it exists
        const { data: destData, error: destError } = await supabase.from('destinations').select('*').limit(1);
        if (destError) {
            console.error('Error querying destinations:', destError.message);
        } else {
            console.log('Destinations table exists. Sample data:', destData);
        }
    } else {
        console.log('Tables:', data);
    }
}

listTables();
