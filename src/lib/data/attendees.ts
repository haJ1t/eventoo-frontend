export interface Attendee {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    location: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    ticketType: 'VIP' | 'Standard';
    checkedIn: boolean;
    avatar?: string;
}

export const attendees: Attendee[] = [
    {
        id: '1',
        name: "John Smith",
        email: "john.smith@techcorp.com",
        phone: "+1 (555) 123-4567",
        company: "Tech Corp",
        position: "Software Engineer",
        location: "San Francisco, CA",
        status: "confirmed",
        ticketType: "VIP",
        checkedIn: true,
        avatar: "JS"
    },
    {
        id: '2',
        name: "Sarah Johnson",
        email: "sarah.j@designstudio.io",
        phone: "+1 (555) 987-6543",
        company: "Design Studio",
        position: "UX Designer",
        location: "New York, NY",
        status: "confirmed",
        ticketType: "Standard",
        checkedIn: false,
        avatar: "SJ"
    },
    {
        id: '3',
        name: "Michael Brown",
        email: "m.brown@marketinginc.com",
        phone: "+1 (555) 456-7890",
        company: "Marketing Inc",
        position: "Marketing Manager",
        location: "Los Angeles, CA",
        status: "pending",
        ticketType: "Standard",
        checkedIn: false,
        avatar: "MB"
    },
    {
        id: '4',
        name: "Emily Davis",
        email: "emily.d@creative.agency",
        phone: "+1 (555) 321-9876",
        company: "Creative Agency",
        position: "Art Director",
        location: "Chicago, IL",
        status: "confirmed",
        ticketType: "VIP",
        checkedIn: true,
        avatar: "ED"
    },
    {
        id: '5',
        name: "David Wilson",
        email: "d.wilson@startupxyz.com",
        phone: "+1 (555) 654-3210",
        company: "StartupXYZ",
        position: "CEO",
        location: "Austin, TX",
        status: "cancelled",
        ticketType: "Standard",
        checkedIn: false,
        avatar: "DW"
    },
    {
        id: '6',
        name: "Lisa Garcia",
        email: "lisa.g@mediacorp.com",
        phone: "+1 (555) 789-0123",
        company: "Media Corp",
        position: "Content Manager",
        location: "Miami, FL",
        status: "pending",
        ticketType: "VIP",
        checkedIn: false,
        avatar: "LG"
    },
    {
        id: '7',
        name: "Robert Taylor",
        email: "r.taylor@financepro.com",
        phone: "+1 (555) 111-2222",
        company: "Finance Pro",
        position: "Financial Analyst",
        location: "Boston, MA",
        status: "confirmed",
        ticketType: "Standard",
        checkedIn: false,
        avatar: "RT"
    },
    {
        id: '8',
        name: "Jennifer Lee",
        email: "j.lee@healthtech.io",
        phone: "+1 (555) 333-4444",
        company: "Health Tech",
        position: "Product Manager",
        location: "Seattle, WA",
        status: "confirmed",
        ticketType: "VIP",
        checkedIn: true,
        avatar: "JL"
    },
    {
        id: '9',
        name: "James Wilson",
        email: "james.w@global.inc",
        phone: "+1 (555) 444-5555",
        company: "Global Inc",
        position: "Sales Director",
        location: "Denver, CO",
        status: "confirmed",
        ticketType: "VIP",
        checkedIn: false,
        avatar: "JW"
    },
    {
        id: '10',
        name: "Maria Rodriguez",
        email: "maria.r@edu.org",
        phone: "+1 (555) 666-7777",
        company: "Edu Org",
        position: "Researcher",
        location: "San Diego, CA",
        status: "confirmed",
        ticketType: "Standard",
        checkedIn: true,
        avatar: "MR"
    }
];
