import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grtnsnfvcedllbtskrhr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5zbmZ2Y2VkbGxidHNrcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjc4NjIsImV4cCI6MjA4MDMwMzg2Mn0.m0LMWFaLv0VK-29a1tC3By1n8tzYzqbSzzoWvsGLGgk'

export const supabase = createClient(supabaseUrl, supabaseKey)
