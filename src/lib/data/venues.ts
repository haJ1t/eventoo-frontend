export const venues = [
    {
        id: 1,
        name: "Grand Ballroom Elite",
        location: "Downtown Manhattan, NY",
        address: "123 Broadway, New York, NY 10013",
        capacity: 200,
        pricePerHour: 150,
        rating: 4.8,
        reviewCount: 127,
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2098&q=80",
        images: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2098&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        type: "Ballroom",
        status: "active",
        upcomingEvents: 12,
        description: "Experience luxury and elegance in our premier event space located in the heart of Manhattan. This spacious and modern conference hall is perfect for large corporate events, seminars, and presentations.",
        amenities: ["WiFi", "Valet Parking", "Catering Kitchen", "Sound System", "Professional Lighting", "Security"],
        highlights: [
            "Soaring 20-foot ceilings",
            "Crystal chandeliers",
            "Floor-to-ceiling windows",
            "Hardwood floors"
        ],
        policies: [
            {
                title: "Cancellation Policy",
                description: "Free cancellation up to 48 hours before the event. 50% refund within 24-48 hours.",
                type: "warning"
            },
            {
                title: "Security Deposit",
                description: "$500 refundable security deposit required for all bookings.",
                type: "info"
            }
        ]
    },
    {
        id: 2,
        name: "Elegant Wedding Venue",
        location: "Garden District",
        address: "456 Garden Lane, Garden City, NY",
        capacity: 200,
        pricePerHour: 400,
        rating: 4.9,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        images: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
        ],
        type: "Wedding",
        status: "active",
        upcomingEvents: 8,
        description: "Beautiful garden venue with elegant interiors, perfect for weddings and special celebrations. The lush manicured grounds provide a stunning backdrop for outdoor ceremonies.",
        amenities: ["WiFi", "Parking", "Catering", "Garden", "Bridal Suite"],
        highlights: [
            "Manicured gardens",
            "Bridal suite included",
            "Indoor reception hall",
            "Scenic photo spots"
        ],
        policies: []
    },
    {
        id: 3,
        name: "Modern Party Lounge",
        location: "Entertainment Quarter",
        address: "789 Party Ave, Night City",
        capacity: 150,
        pricePerHour: 180,
        rating: 4.6,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        images: [
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
        ],
        type: "Party",
        status: "active",
        upcomingEvents: 15,
        description: "Trendy lounge space with modern lighting and sound system, ideal for parties and social events.",
        amenities: ["WiFi", "Sound System", "Bar", "Dance Floor", "Lighting"],
        highlights: ["State-of-the-art sound", "LED lighting system", "Full bar setup"],
        policies: []
    },
    {
        id: 4,
        name: "Executive Boardroom",
        location: "Financial District",
        address: "101 Wall St, New York, NY",
        capacity: 25,
        pricePerHour: 120,
        rating: 4.7,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
        ],
        type: "Corporate",
        status: "inactive",
        upcomingEvents: 0,
        description: "Premium boardroom with state-of-the-art technology for executive meetings and presentations.",
        amenities: ["WiFi", "Video Conferencing", "Whiteboard", "Coffee Service"],
        highlights: ["Video conferencing", "Ergonomic chairs", "Catering options"],
        policies: []
    },
    {
        id: 5,
        name: "Rooftop Terrace",
        location: "City Center",
        address: "202 Skyline Dr, Metropolis",
        capacity: 100,
        pricePerHour: 300,
        rating: 4.5,
        reviewCount: 45,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"
        ],
        type: "Outdoor",
        status: "active",
        upcomingEvents: 5,
        description: "Beautiful rooftop terrace with panoramic city views, perfect for evening cocktails and networking.",
        amenities: ["WiFi", "Bar", "City View"],
        highlights: ["Panoramic views", "Outdoor bar", "Lounge seating"],
        policies: []
    },
    {
        id: 6,
        name: "Art Gallery Space",
        location: "Arts District",
        address: "303 Gallery Row, Artsy Town",
        capacity: 80,
        pricePerHour: 200,
        rating: 4.4,
        reviewCount: 32,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ],
        type: "Gallery",
        status: "active",
        upcomingEvents: 3,
        description: "Contemporary art gallery perfect for exhibitions, product launches, and cultural events.",
        amenities: ["WiFi", "Gallery Lighting", "Security System"],
        highlights: ["Professional track lighting", "Minimalist aesthetic", "White walls"],
        policies: []
    }
];
