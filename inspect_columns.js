import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error querying destinations:', error);
    } else if (data && data.length > 0) {
        console.log('Columns:', JSON.stringify(Object.keys(data[0])));
    } else {
        console.log('No data in destinations table.');
    }
}

inspectColumns();
