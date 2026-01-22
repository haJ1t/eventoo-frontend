export interface Organiser {
    id: number;
    name: string;
    location: string;
    tag: string;
    eventsCount: string;
    rating: number;
    image: string;
    featured: boolean;
    bio: string;
    socialMedia: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        facebook?: string;
        website?: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    tags: string[];
}

export const organisers: Organiser[] = [
    {
        id: 1,
        name: "Tech Events Inc.",
        location: "San Francisco, CA",
        tag: "Technology",
        eventsCount: "12 Events",
        rating: 4.8,
        image: "/images/companyImages/Company_A.jpg",
        featured: true,
        bio: "Leading technology event organiser specializing in conferences, workshops, and networking events for tech professionals.",
        socialMedia: {
            twitter: "@techevents",
            linkedin: "techevents",
            website: "www.techevents.com"
        },
        contact: {
            email: "info@techevents.com",
            phone: "+1 (555) 123-4567"
        },
        tags: ["Technology", "Networking", "Professional"]
    },
    {
        id: 2,
        name: "Music Events Co.",
        location: "Austin, TX",
        tag: "Music",
        eventsCount: "24 Events",
        rating: 4.6,
        image: "/images/companyImages/Company_B.jpg",
        featured: true,
        bio: "Creating unforgettable music experiences from intimate venues to large-scale festivals across the country.",
        socialMedia: {
            twitter: "@musiceventsco",
            instagram: "musiceventsco",
            website: "www.musiceventsco.com"
        },
        contact: {
            email: "bookings@musiceventsco.com",
            phone: "+1 (555) 987-6543"
        },
        tags: ["Music", "Entertainment", "Festivals"]
    },
    {
        id: 3,
        name: "Mentor Wise",
        location: "London, UK",
        tag: "Education",
        eventsCount: "8 Events",
        rating: 4.9,
        image: "/images/companyImages/MentorWise.png",
        featured: false,
        bio: "Empowering the next generation through mentorship programs, workshops, and community engagement to foster personal and professional growth.",
        socialMedia: {
            instagram: "mentorwise",
            facebook: "mentorwise",
            website: "www.mentor.org.uk"
        },
        contact: {
            email: "info@mentorwise.org",
            phone: "+1 (555) 456-7890"
        },
        tags: ["Art", "Culture", "Exhibition"]
    },
    {
        id: 4,
        name: "Sohbet Society",
        location: "Istanbul, Turkey",
        tag: "Cultural",
        eventsCount: "15 Events",
        rating: 4.7,
        image: "/images/companyImages/SohbetSociety.png",
        featured: true,
        bio: "Bringing people together through cultural exchange, conversation, and community-building events that celebrate diversity and heritage.",
        socialMedia: {
            twitter: "@sohbetsociety",
            instagram: "sohbetsociety",
            website: "www.sohbetsociety.org"
        },
        contact: {
            email: "connect@sohbetsociety.org",
            phone: "+90 (212) 555-1234"
        },
        tags: ["Cultural", "Community", "Education"]
    },
    {
        id: 5,
        name: "Sports United",
        location: "Chicago, IL",
        tag: "Sports",
        eventsCount: "20 Events",
        rating: 4.5,
        image: "/images/companyImages/SportsUnited.png",
        featured: false,
        bio: "Uniting communities through sports events, tournaments, and fitness challenges for all skill levels and ages.",
        socialMedia: {
            twitter: "@sportsunited",
            instagram: "sportsunited",
            website: "www.sportsunited.com"
        },
        contact: {
            email: "info@sportsunited.com",
            phone: "+1 (312) 555-7890"
        },
        tags: ["Sports", "Community", "Health"]
    },
    {
        id: 6,
        name: "Foodie Festivals",
        location: "New York, NY",
        tag: "Food & Drink",
        eventsCount: "30 Events",
        rating: 4.9,
        image: "/images/companyImages/FoodieFestivals.png",
        featured: true,
        bio: "Curating exceptional culinary experiences through food festivals, tasting events, and cooking workshops.",
        socialMedia: {
            twitter: "@foodiefests",
            instagram: "foodiefestivals",
            website: "www.foodiefestivals.com"
        },
        contact: {
            email: "taste@foodiefestivals.com",
            phone: "+1 (212) 555-3456"
        },
        tags: ["Food & Drink", "Culture", "Entertainment"]
    },
    {
        id: 7,
        name: "Art Collective",
        location: "Los Angeles, CA",
        tag: "Art",
        eventsCount: "18 Events",
        rating: 4.6,
        image: "/images/companyImages/ArtCollective.png",
        featured: false,
        bio: "Supporting emerging artists through exhibitions, galleries, and interactive art experiences.",
        socialMedia: {
            twitter: "@artcollective",
            instagram: "artcollectivela",
            website: "www.artcollective.org"
        },
        contact: {
            email: "create@artcollective.org",
            phone: "+1 (323) 555-9012"
        },
        tags: ["Art", "Culture", "Entertainment"]
    },
    {
        id: 8,
        name: "Business Summit",
        location: "London, UK",
        tag: "Business",
        eventsCount: "25 Events",
        rating: 4.8,
        image: "/images/companyImages/BusinessSummit.png",
        featured: true,
        bio: "Connecting industry leaders through professional conferences, networking events, and business workshops.",
        socialMedia: {
            twitter: "@bizsummit",
            linkedin: "businesssummit",
            website: "www.businesssummit.co.uk"
        },
        contact: {
            email: "contact@businesssummit.co.uk",
            phone: "+44 20 7123 4567"
        },
        tags: ["Business", "Professional", "Networking"]
    },
    {
        id: 9,
        name: "Green Events",
        location: "San Francisco, CA",
        tag: "Environment",
        eventsCount: "22 Events",
        rating: 4.7,
        image: "/images/companyImages/GreenEvents.png",
        featured: false,
        bio: "Promoting sustainability through eco-friendly events, environmental workshops, and green technology showcases.",
        socialMedia: {
            twitter: "@greenevents",
            instagram: "greeneventssf",
            website: "www.greenevents.org"
        },
        contact: {
            email: "sustainable@greenevents.org",
            phone: "+1 (415) 555-6789"
        },
        tags: ["Environment", "Technology", "Education"]
    }
];
