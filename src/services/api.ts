import { supabase } from '@/lib/supabase';

// Mock data
export const MOCK_DESTINATIONS = [
    {
        id: 1,
        name: 'Kyoto',
        country: 'Japan',
        city: 'Kyoto',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
        rating: 4.9,
        price: 150,
        description: 'Kyoto is the cultural capital of Japan, famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
        location: 'Kansai Region',
        amenities: ['Free Wi-Fi', 'Breakfast Included', 'Spa', 'Airport Shuttle'],
        aiInsights: [
            'Best visited in late March for cherry blossoms or November for autumn foliage.',
            'Try the Kaiseki dining experience in Gion.',
            'Book temples early in the morning to avoid crowds.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop'
        ],
        bestSeason: 'Spring (March-May) or Autumn (October-November)',
        weather: 'Moderate climate with four distinct seasons.',
        activities: ['Temple Hopping', 'Tea Ceremony', 'Geisha District Tour', 'Bamboo Forest Walk'],
        relatedDestinations: [2, 3],
        category: 'City'
    },
    {
        id: 2,
        name: 'Maldives',
        country: 'Maldives',
        city: 'Malé Atoll',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop',
        rating: 5.0,
        price: 450,
        description: 'Experience the ultimate tropical paradise with crystal clear waters, white sandy beaches, and luxurious overwater villas.',
        location: 'Indian Ocean',
        amenities: ['Private Pool', 'Butler Service', 'All-Inclusive', 'Spa'],
        aiInsights: ['Book a sunset dolphin cruise.', 'Try the underwater restaurant.', 'Best time for diving is January to April.'],
        gallery: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2064&auto=format&fit=crop'
        ],
        bestSeason: 'November to April (Dry Season)',
        weather: 'Tropical, warm and sunny year-round.',
        activities: ['Snorkeling', 'Scuba Diving', 'Sunset Cruise', 'Island Hopping'],
        relatedDestinations: [3, 6],
        category: 'Luxury'
    },
    {
        id: 3,
        name: 'Bali',
        country: 'Indonesia',
        city: 'Ubud',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop',
        rating: 4.7,
        price: 120,
        description: 'Tropical paradise with lush jungles, ancient temples, and vibrant culture.',
        location: 'Ubud',
        amenities: ['Pool', 'Spa', 'Yoga Classes'],
        aiInsights: ['Visit the Monkey Forest early.', 'Try the local coffee.', 'Rent a scooter for easy travel.'],
        gallery: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=1980&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=2070&auto=format&fit=crop'
        ],
        bestSeason: 'April to October (Dry Season)',
        weather: 'Tropical, warm and humid.',
        activities: ['Rice Terrace Walk', 'Yoga Retreat', 'Surfing', 'Temple Visits'],
        relatedDestinations: [2, 6],
        category: 'Beach'
    },
    {
        id: 4,
        name: 'Reykjavik',
        country: 'Iceland',
        city: 'Reykjavik',
        image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2159&auto=format&fit=crop',
        rating: 4.9,
        price: 250,
        description: 'Witness the northern lights and dramatic landscapes in the land of fire and ice.',
        location: 'Capital Region',
        amenities: ['Northern Lights View', 'Hot Tub', 'Geothermal Heating'],
        aiInsights: ['Best time for Northern Lights is Sept-April.', 'Visit the Blue Lagoon.', 'Rent a 4x4 for exploring.'],
        gallery: [
            'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2159&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2159&auto=format&fit=crop'
        ],
        bestSeason: 'June-August (Midnight Sun) or Sept-March (Northern Lights)',
        weather: 'Cold, windy, and changeable.',
        activities: ['Northern Lights Tour', 'Golden Circle', 'Blue Lagoon', 'Glacier Hiking'],
        relatedDestinations: [1, 5],
        category: 'Adventure'
    },
    {
        id: 5,
        name: 'Santorini',
        country: 'Greece',
        city: 'Oia',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2072&auto=format&fit=crop',
        rating: 4.9,
        price: 300,
        description: 'Stunning sunsets, white-washed houses, and crystal clear waters in the Aegean Sea.',
        location: 'Cyclades',
        amenities: ['Infinity Pool', 'Sea View', 'Breakfast'],
        aiInsights: ['Watch the sunset in Oia.', 'Visit the Red Beach.', 'Go wine tasting.'],
        gallery: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2072&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1613395877344-13d4c280d288?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed2a?q=80&w=1974&auto=format&fit=crop'
        ],
        bestSeason: 'June to September',
        weather: 'Mediterranean, hot and sunny.',
        activities: ['Sunset Watching', 'Wine Tasting', 'Boat Tour', 'Hiking Fira to Oia'],
        relatedDestinations: [2, 3],
        category: 'Beach'
    },
    {
        id: 6,
        name: 'Bora Bora',
        country: 'French Polynesia',
        city: 'Vaitape',
        image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=1998&auto=format&fit=crop',
        rating: 4.9,
        price: 800,
        description: 'A small South Pacific island northwest of Tahiti in French Polynesia, surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef.',
        location: 'Leeward Islands',
        amenities: ['Overwater Bungalow', 'Lagoon Access', 'Spa'],
        aiInsights: ['Swim with sharks and rays.', 'Take a 4x4 island tour.', 'Enjoy a Polynesian dinner show.'],
        gallery: [
            'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=1998&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580725871838-1202819f7978?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1589979481223-deb893043163?q=80&w=2070&auto=format&fit=crop'
        ],
        bestSeason: 'May to October',
        weather: 'Tropical, warm and humid.',
        activities: ['Snorkeling', 'Shark Feeding', 'Jet Skiing', 'Relaxing'],
        relatedDestinations: [2, 3],
        category: 'Luxury'
    },
    {
        id: 7,
        name: 'Machu Picchu',
        country: 'Peru',
        city: 'Cusco Region',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
        rating: 4.9,
        price: 200,
        description: 'Iconic Incan citadel set high in the Andes Mountains in Peru.',
        location: 'Andes Mountains',
        amenities: ['Guided Tour', 'Hiking', 'History'],
        aiInsights: ['Book tickets months in advance.', 'Acclimatize in Cusco first.', 'Take the train for scenic views.'],
        gallery: [
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533692328991-08159ff19fca?q=80&w=2069&auto=format&fit=crop'
        ],
        bestSeason: 'April to October (Dry Season)',
        weather: 'Cool and dry.',
        activities: ['Hiking', 'History Tour', 'Photography', 'Llama Watching'],
        relatedDestinations: [4, 5],
        category: 'Adventure'
    },
    {
        id: 8,
        name: 'New York City',
        country: 'USA',
        city: 'New York',
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21?q=80&w=2070&auto=format&fit=crop',
        rating: 4.7,
        price: 350,
        description: 'The City That Never Sleeps, featuring iconic landmarks, world-class museums, and diverse culture.',
        location: 'New York',
        amenities: ['City View', 'Gym', 'Concierge'],
        aiInsights: ['Walk the High Line.', 'Visit museums on weekdays.', 'Use the subway to get around.'],
        gallery: [
            'https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=2060&auto=format&fit=crop'
        ],
        bestSeason: 'Spring or Fall',
        weather: 'Continental, hot summers and cold winters.',
        activities: ['Broadway Show', 'Central Park', 'Museum Hopping', 'Food Tour'],
        relatedDestinations: [1, 9],
        category: 'City'
    },
    {
        id: 9,
        name: 'Paris',
        country: 'France',
        city: 'Paris',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
        rating: 4.8,
        price: 300,
        description: 'The City of Light, known for its cafe culture, Eiffel Tower, and Louvre Museum.',
        location: 'Ile-de-France',
        amenities: ['Eiffel Tower View', 'Breakfast', 'Romantic Atmosphere'],
        aiInsights: ['Book Louvre tickets online.', 'Visit Montmartre at sunset.', 'Enjoy a Seine river cruise.'],
        gallery: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=2020&auto=format&fit=crop'
        ],
        bestSeason: 'Spring (April-June) or Fall (Sept-Nov)',
        weather: 'Mild, can be rainy.',
        activities: ['Museum Visits', 'Cafe Hopping', 'Shopping', 'River Cruise'],
        relatedDestinations: [1, 8],
        category: 'City'
    },
    {
        id: 10,
        name: 'Switzerland',
        country: 'Switzerland',
        city: 'Zermatt',
        image: 'https://images.pexels.com/photos/34192225/pexels-photo-34192225.jpeg',
        rating: 4.9,
        price: 400,
        description: 'Experience the breathtaking beauty of the Swiss Alps, where snow-capped peaks meet crystal-clear lakes and charming mountain villages.',
        location: 'Swiss Alps',
        amenities: ['Mountain View', 'Ski Access', 'Spa', 'Luxury Chalet'],
        aiInsights: [
            'Best visited in winter for skiing or summer for hiking.',
            'Take the Glacier Express for stunning views.',
            'Don\'t miss the chocolate tasting in Zurich.'
        ],
        gallery: [
            'https://images.pexels.com/photos/34192225/pexels-photo-34192225.jpeg',
            'https://images.pexels.com/photos/2779863/pexels-photo-2779863.jpeg'
        ],
        bestSeason: 'Winter (Dec-Mar) or Summer (June-Aug)',
        weather: 'Alpine climate with cold winters and mild summers.',
        activities: ['Skiing', 'Hiking', 'Chocolate Tasting', 'Scenic Train Rides'],
        relatedDestinations: [4, 7],
        category: 'Adventure'
    },
    {
        id: 11,
        name: 'Dubai',
        country: 'United Arab Emirates',
        city: 'Dubai',
        image: 'https://images.pexels.com/photos/2086765/pexels-photo-2086765.jpeg',
        rating: 5.0,
        price: 500,
        description: 'Discover the city of the future, where ultra-modern skyscrapers meet traditional souks and golden desert dunes.',
        location: 'Middle East',
        amenities: ['Luxury Spa', 'Private Beach', 'Desert Safari', 'Fine Dining'],
        aiInsights: [
            'Visit the Burj Khalifa at sunset for the best views.',
            'Explore the Gold Souk for traditional jewelry.',
            'Take a desert safari for an authentic experience.'
        ],
        gallery: [
            'https://images.pexels.com/photos/2086765/pexels-photo-2086765.jpeg',
            'https://images.pexels.com/photos/3378916/pexels-photo-3378916.jpeg',
            'https://images.pexels.com/photos/2867769/pexels-photo-2867769.jpeg'
        ],
        bestSeason: 'Winter (November-March)',
        weather: 'Arid climate with hot summers and mild winters.',
        activities: ['Burj Khalifa Visit', 'Desert Safari', 'Shopping at Dubai Mall', 'Dhow Cruise'],
        relatedDestinations: [2, 6],
        category: 'Luxury'
    },
    {
        id: 12,
        name: 'Somalia',
        country: 'Somalia',
        city: 'Mogadishu',
        image: 'https://scontent.fbsa1-1.fna.fbcdn.net/v/t39.30808-6/490548852_1276782474021448_8230830644543489680_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=AhA4Pw5Cl30Q7kNvwHu25Z0&_nc_oc=Adnf_aCqMnLeSXlSZ_3R8TntenzpZbTy6PlTPDxM0YqIqk20u-V52hv7LVVVMqoInKw&_nc_zt=23&_nc_ht=scontent.fbsa1-1.fna&_nc_gid=xAkvUC1Ga76tFzQlEr9ePQ&oh=00_AfnQ5eXwUfz_T2YRINzDi7DEouJdb1Cuhw73YNHKzMnpXQ&oe=69501BC7',
        rating: 4.8,
        price: 200,
        description: 'Discover the hidden gem of the Horn of Africa, where pristine white beaches meet rich history and vibrant culture in a land of resilience and beauty.',
        location: 'Horn of Africa',
        amenities: ['Beach Access', 'Cultural Tours', 'Traditional Cuisine', 'Guided History Walks'],
        aiInsights: [
            'Visit the Liido Beach for a vibrant local experience.',
            'Explore the historic Hamar Weyne district.',
            'Try the traditional Somali tea and Sambusas.'
        ],
        gallery: [
            'https://scontent.fbsa1-1.fna.fbcdn.net/v/t39.30808-6/490548852_1276782474021448_8230830644543489680_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=AhA4Pw5Cl30Q7kNvwHu25Z0&_nc_oc=Adnf_aCqMnLeSXlSZ_3R8TntenzpZbTy6PlTPDxM0YqIqk20u-V52hv7LVVVMqoInKw&_nc_zt=23&_nc_ht=scontent.fbsa1-1.fna&_nc_gid=xAkvUC1Ga76tFzQlEr9ePQ&oh=00_AfnQ5eXwUfz_T2YRINzDi7DEouJdb1Cuhw73YNHKzMnpXQ&oe=69501BC7',
            'https://scontent.fbsa1-1.fna.fbcdn.net/v/t39.30808-6/490408332_1276782524021443_1171133727162700014_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=wbO5LcpYOqoQ7kNvwGN9Olk&_nc_oc=AdnE6lVT8nDzlMyDNBbN5TOhdF1AS5S1tQ367UNkEYAWmi0uLhRSH93YAMGa5VYeFp8&_nc_zt=23&_nc_ht=scontent.fbsa1-1.fna&_nc_gid=X9UUuj6rQJN-AWnsfGtxDA&oh=00_AfmmCAXDIaKMJhTmsPmniwHR0TtWJWwR7qLl73m1PyKRng&oe=69501712'
        ],
        bestSeason: 'December to March',
        weather: 'Tropical climate, hot and humid year-round.',
        activities: ['Beach Relaxation', 'City Tour', 'Cultural Immersion', 'Local Market Visit'],
        relatedDestinations: [2, 11],
        category: 'Beach'
    }
];

export const api = {
    getTrendingDestinations: async () => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // If DB is empty, return mock data
            if (!data || data.length === 0) {
                return MOCK_DESTINATIONS;
            }

            // Merge DB data with mock data for rich fields if possible, or just return DB data
            // Since DB only has basic fields, we might want to map it to match the UI structure
            // For now, we'll return the DB data and let the UI handle missing optional fields if any
            // Or better, we can try to find a matching mock destination to get the rich data
            return data.map(dbDest => {
                const mockDest = MOCK_DESTINATIONS.find(m => m.name === dbDest.name);
                return mockDest ? { ...mockDest, ...dbDest } : {
                    ...dbDest,
                    rating: 4.5, // Default
                    amenities: ['Free Wi-Fi', 'Breakfast'], // Default
                    gallery: [dbDest.image], // Default
                    reviews: [],
                    activities: ['Sightseeing'] // Default
                };
            });
        } catch (error) {
            console.error('Failed to fetch destinations', error);
            return MOCK_DESTINATIONS;
        }
    },

    getDestinationById: async (id: number | string) => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                // If not found in DB, try mock data (legacy support)
                const mock = MOCK_DESTINATIONS.find(d => d.id == id);
                if (mock) return mock;
                throw error;
            }

            // Hydrate with rich data if available
            const mockDest = MOCK_DESTINATIONS.find(m => m.name === data.name);
            return mockDest ? { ...mockDest, ...data } : {
                ...data,
                rating: 4.5,
                amenities: ['Free Wi-Fi', 'Breakfast'],
                gallery: [data.image],
                reviews: [],
                activities: ['Sightseeing'],
                aiInsights: ['Great place to visit!']
            };
        } catch (error) {
            console.error('Failed to fetch destination', error);
            // Fallback to mock
            const mock = MOCK_DESTINATIONS.find(d => d.id == id);
            return mock || MOCK_DESTINATIONS[0];
        }
    },

    searchDestinations: async (query: string) => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .ilike('name', `%${query}%`);

            if (error) throw error;

            if (!data || data.length === 0) {
                // Fallback search on mock data
                return MOCK_DESTINATIONS.filter(d =>
                    d.name.toLowerCase().includes(query.toLowerCase()) ||
                    d.location.toLowerCase().includes(query.toLowerCase())
                );
            }

            return data.map(dbDest => {
                const mockDest = MOCK_DESTINATIONS.find(m => m.name === dbDest.name);
                return mockDest ? { ...mockDest, ...dbDest } : {
                    ...dbDest,
                    rating: 4.5,
                    amenities: ['Free Wi-Fi', 'Breakfast'],
                    gallery: [dbDest.image],
                    activities: ['Sightseeing']
                };
            });
        } catch (error) {
            console.error('Search failed', error);
            return MOCK_DESTINATIONS.filter(d =>
                d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.location.toLowerCase().includes(query.toLowerCase())
            );
        }
    }
};
