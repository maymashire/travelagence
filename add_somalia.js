import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk';

const supabase = createClient(supabaseUrl, supabaseKey);

const somalia = {
    name: 'Somalia',
    country: 'Somalia',
    city: 'Mogadishu',
    image: 'https://scontent.fbsa1-1.fna.fbcdn.net/v/t39.30808-6/490548852_1276782474021448_8230830644543489680_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=AhA4Pw5Cl30Q7kNvwHu25Z0&_nc_oc=Adnf_aCqMnLeSXlSZ_3R8TntenzpZbTy6PlTPDxM0YqIqk20u-V52hv7LVVVMqoInKw&_nc_zt=23&_nc_ht=scontent.fbsa1-1.fna&_nc_gid=xAkvUC1Ga76tFzQlEr9ePQ&oh=00_AfnQ5eXwUfz_T2YRINzDi7DEouJdb1Cuhw73YNHKzMnpXQ&oe=69501BC7',
    price: 200,
    rating: 4.8
};

async function addSomalia() {
    const { data, error } = await supabase
        .from('destinations')
        .insert([somalia])
        .select();

    if (error) {
        console.error('Error inserting Somalia:', error);
    } else {
        console.log('Somalia inserted successfully:', data);
    }
}

addSomalia();
