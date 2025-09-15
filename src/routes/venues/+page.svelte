<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { 
    Plus, 
    Search, 
    Filter, 
    Grid3X3, 
    List, 
    MapPin, 
    Users, 
    Calendar,
    Star,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye
  } from 'lucide-svelte';
  
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '$lib/components/ui/dialog';
  
  import AppVenueCard from '$lib/components/app-venue-card.svelte';
  import VenueDetailsModal from '$lib/components/VenueDetailsModal.svelte';

  // State
  let venues = [];
  let filteredVenues = [];
  let searchQuery = '';
  let selectedType = 'all';
  let selectedStatus = 'all';
  let viewMode = 'grid'; // 'grid' | 'list'
  let currentPage = 1;
  let itemsPerPage = 12;
  let isLoading = true;
  
  // Modal states
  let showDeleteDialog = false;
  let venueToDelete = null;
  let showVenueDetails = false;
  let selectedVenueForDetails = null;

  // Mock data
  const mockVenues = [
    {
      id: '1',
      name: 'Grand Conference Hall',
      location: 'Downtown Business District',
      capacity: 500,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      images: [
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
      ],
      type: 'Conference',
      status: 'active',
      upcomingEvents: 12,
      description: 'A spacious and modern conference hall perfect for large corporate events, seminars, and presentations.',
      amenities: ['WiFi', 'Parking', 'Catering', 'Audio/Visual Equipment', 'Air Conditioning'],
      rating: 4.8,
      totalBookings: 156,
      pricePerHour: 250,
      availability: {
        monday: { start: '09:00', end: '18:00', available: true },
        tuesday: { start: '09:00', end: '18:00', available: true },
        wednesday: { start: '09:00', end: '18:00', available: true },
        thursday: { start: '09:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '18:00', available: true },
        saturday: { start: '10:00', end: '16:00', available: true },
        sunday: { start: '10:00', end: '16:00', available: false }
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-10T14:30:00Z',
      tags: ['Corporate', 'Large Events', 'Premium']
    },
    {
      id: '2',
      name: 'Elegant Wedding Venue',
      location: 'Garden District',
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'
      ],
      type: 'Wedding',
      status: 'active',
      upcomingEvents: 8,
      description: 'Beautiful garden venue with elegant interiors, perfect for weddings and special celebrations.',
      amenities: ['WiFi', 'Parking', 'Catering', 'Garden', 'Bridal Suite'],
      rating: 4.9,
      totalBookings: 89,
      pricePerHour: 400,
      availability: {
        monday: { start: '10:00', end: '22:00', available: false },
        tuesday: { start: '10:00', end: '22:00', available: false },
        wednesday: { start: '10:00', end: '22:00', available: true },
        thursday: { start: '10:00', end: '22:00', available: true },
        friday: { start: '10:00', end: '22:00', available: true },
        saturday: { start: '10:00', end: '22:00', available: true },
        sunday: { start: '10:00', end: '22:00', available: true }
      },
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-05T16:20:00Z',
      tags: ['Wedding', 'Garden', 'Luxury']
    },
    {
      id: '3',
      name: 'Modern Party Lounge',
      location: 'Entertainment Quarter',
      capacity: 150,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      images: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
      ],
      type: 'Party',
      status: 'active',
      upcomingEvents: 15,
      description: 'Trendy lounge space with modern lighting and sound system, ideal for parties and social events.',
      amenities: ['WiFi', 'Sound System', 'Bar', 'Dance Floor', 'Lighting'],
      rating: 4.6,
      totalBookings: 203,
      pricePerHour: 180,
      availability: {
        monday: { start: '18:00', end: '02:00', available: false },
        tuesday: { start: '18:00', end: '02:00', available: false },
        wednesday: { start: '18:00', end: '02:00', available: true },
        thursday: { start: '18:00', end: '02:00', available: true },
        friday: { start: '18:00', end: '02:00', available: true },
        saturday: { start: '18:00', end: '02:00', available: true },
        sunday: { start: '18:00', end: '02:00', available: true }
      },
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-03-08T12:15:00Z',
      tags: ['Party', 'Nightlife', 'Modern']
    },
    {
      id: '4',
      name: 'Executive Boardroom',
      location: 'Financial District',
      capacity: 25,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      ],
      type: 'Corporate',
      status: 'inactive',
      upcomingEvents: 0,
      description: 'Premium boardroom with state-of-the-art technology for executive meetings and presentations.',
      amenities: ['WiFi', 'Video Conferencing', 'Whiteboard', 'Coffee Service'],
      rating: 4.7,
      totalBookings: 67,
      pricePerHour: 120,
      availability: {
        monday: { start: '08:00', end: '18:00', available: false },
        tuesday: { start: '08:00', end: '18:00', available: false },
        wednesday: { start: '08:00', end: '18:00', available: false },
        thursday: { start: '08:00', end: '18:00', available: false },
        friday: { start: '08:00', end: '18:00', available: false },
        saturday: { start: '08:00', end: '18:00', available: false },
        sunday: { start: '08:00', end: '18:00', available: false }
      },
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-02-28T09:45:00Z',
      tags: ['Corporate', 'Executive', 'Small Groups']
    },
    {
      id: '5',
      name: 'Rooftop Terrace',
      location: 'City Center',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
      type: 'Outdoor',
      status: 'active',
      upcomingEvents: 5,
      description: 'Beautiful rooftop terrace with city views.',
      amenities: ['WiFi', 'Bar', 'City View'],
      rating: 4.5,
      totalBookings: 45,
      pricePerHour: 300,
      availability: {
        monday: { start: '16:00', end: '23:00', available: true },
        tuesday: { start: '16:00', end: '23:00', available: true },
        wednesday: { start: '16:00', end: '23:00', available: true },
        thursday: { start: '16:00', end: '23:00', available: true },
        friday: { start: '16:00', end: '23:00', available: true },
        saturday: { start: '14:00', end: '23:00', available: true },
        sunday: { start: '14:00', end: '23:00', available: true }
      },
      createdAt: '2024-02-15T10:00:00Z',
      updatedAt: '2024-03-01T11:00:00Z',
      tags: ['Outdoor', 'City View', 'Cocktails']
    },
    {
      id: '6',
      name: 'Art Gallery Space',
      location: 'Arts District',
      capacity: 80,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
      type: 'Gallery',
      status: 'active',
      upcomingEvents: 3,
      description: 'Contemporary art gallery perfect for exhibitions and cultural events.',
      amenities: ['WiFi', 'Gallery Lighting', 'Security System'],
      rating: 4.4,
      totalBookings: 32,
      pricePerHour: 200,
      availability: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '18:00', available: true },
        saturday: { start: '10:00', end: '18:00', available: true },
        sunday: { start: '12:00', end: '17:00', available: true }
      },
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z',
      tags: ['Art', 'Culture', 'Exhibition']
    },
    {
      id: '7',
      name: 'Luxury Hotel Ballroom',
      location: 'Hotel District',
      capacity: 300,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      type: 'Ballroom',
      status: 'active',
      upcomingEvents: 7,
      description: 'Elegant ballroom with crystal chandeliers and premium service.',
      amenities: ['WiFi', 'Valet Parking', 'Full Service Catering', 'Dance Floor'],
      rating: 4.9,
      totalBookings: 78,
      pricePerHour: 500,
      availability: {
        monday: { start: '10:00', end: '23:00', available: true },
        tuesday: { start: '10:00', end: '23:00', available: true },
        wednesday: { start: '10:00', end: '23:00', available: true },
        thursday: { start: '10:00', end: '23:00', available: true },
        friday: { start: '10:00', end: '23:00', available: true },
        saturday: { start: '10:00', end: '23:00', available: true },
        sunday: { start: '10:00', end: '23:00', available: true }
      },
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-03-12T15:00:00Z',
      tags: ['Luxury', 'Ballroom', 'Premium']
    },
    {
      id: '8',
      name: 'Community Center Hall',
      location: 'Residential Area',
      capacity: 120,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'],
      type: 'Community',
      status: 'active',
      upcomingEvents: 6,
      description: 'Affordable community space for local events and gatherings.',
      amenities: ['WiFi', 'Kitchen', 'Tables & Chairs', 'Sound System'],
      rating: 4.2,
      totalBookings: 124,
      pricePerHour: 75,
      availability: {
        monday: { start: '09:00', end: '21:00', available: true },
        tuesday: { start: '09:00', end: '21:00', available: true },
        wednesday: { start: '09:00', end: '21:00', available: true },
        thursday: { start: '09:00', end: '21:00', available: true },
        friday: { start: '09:00', end: '21:00', available: true },
        saturday: { start: '09:00', end: '21:00', available: true },
        sunday: { start: '12:00', end: '18:00', available: true }
      },
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-02-25T11:30:00Z',
      tags: ['Community', 'Affordable', 'Local Events']
    },
    {
      id: '9',
      name: 'Beachside Pavilion',
      location: 'Coastal Area',
      capacity: 180,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
      type: 'Outdoor',
      status: 'active',
      upcomingEvents: 4,
      description: 'Open-air pavilion with stunning ocean views, perfect for beach weddings.',
      amenities: ['Ocean View', 'Parking', 'Restrooms', 'Electrical Outlets'],
      rating: 4.7,
      totalBookings: 56,
      pricePerHour: 350,
      availability: {
        monday: { start: '10:00', end: '20:00', available: true },
        tuesday: { start: '10:00', end: '20:00', available: true },
        wednesday: { start: '10:00', end: '20:00', available: true },
        thursday: { start: '10:00', end: '20:00', available: true },
        friday: { start: '10:00', end: '20:00', available: true },
        saturday: { start: '10:00', end: '20:00', available: true },
        sunday: { start: '10:00', end: '20:00', available: true }
      },
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2024-03-15T13:45:00Z',
      tags: ['Beach', 'Ocean View', 'Outdoor Wedding']
    },
    {
      id: '10',
      name: 'Historic Theater',
      location: 'Arts Quarter',
      capacity: 250,
      image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800',
      images: ['https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800'],
      type: 'Theater',
      status: 'active',
      upcomingEvents: 9,
      description: 'Beautiful historic theater with original architecture and modern amenities.',
      amenities: ['Stage', 'Sound System', 'Lighting', 'Dressing Rooms'],
      rating: 4.8,
      totalBookings: 43,
      pricePerHour: 450,
      availability: {
        monday: { start: '18:00', end: '23:00', available: false },
        tuesday: { start: '18:00', end: '23:00', available: true },
        wednesday: { start: '18:00', end: '23:00', available: true },
        thursday: { start: '18:00', end: '23:00', available: true },
        friday: { start: '18:00', end: '23:00', available: true },
        saturday: { start: '14:00', end: '23:00', available: true },
        sunday: { start: '14:00', end: '23:00', available: true }
      },
      createdAt: '2024-01-30T10:00:00Z',
      updatedAt: '2024-03-18T16:20:00Z',
      tags: ['Historic', 'Theater', 'Performance']
    },
    {
      id: '11',
      name: 'Modern Coworking Space',
      location: 'Tech District',
      capacity: 60,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
      type: 'Corporate',
      status: 'active',
      upcomingEvents: 11,
      description: 'Flexible coworking space perfect for workshops, meetups, and networking events.',
      amenities: ['WiFi', 'Projector', 'Whiteboards', 'Coffee Station'],
      rating: 4.3,
      totalBookings: 187,
      pricePerHour: 90,
      availability: {
        monday: { start: '08:00', end: '20:00', available: true },
        tuesday: { start: '08:00', end: '20:00', available: true },
        wednesday: { start: '08:00', end: '20:00', available: true },
        thursday: { start: '08:00', end: '20:00', available: true },
        friday: { start: '08:00', end: '20:00', available: true },
        saturday: { start: '10:00', end: '18:00', available: true },
        sunday: { start: '10:00', end: '18:00', available: false }
      },
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2024-03-20T10:15:00Z',
      tags: ['Coworking', 'Tech', 'Flexible']
    },
    {
      id: '12',
      name: 'Garden Restaurant Patio',
      location: 'Restaurant Row',
      capacity: 90,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
      type: 'Restaurant',
      status: 'active',
      upcomingEvents: 8,
      description: 'Charming garden patio with ambient lighting, perfect for intimate dinners and celebrations.',
      amenities: ['Full Kitchen', 'Bar Service', 'Garden Setting', 'Ambient Lighting'],
      rating: 4.6,
      totalBookings: 95,
      pricePerHour: 220,
      availability: {
        monday: { start: '17:00', end: '23:00', available: false },
        tuesday: { start: '17:00', end: '23:00', available: true },
        wednesday: { start: '17:00', end: '23:00', available: true },
        thursday: { start: '17:00', end: '23:00', available: true },
        friday: { start: '17:00', end: '23:00', available: true },
        saturday: { start: '12:00', end: '23:00', available: true },
        sunday: { start: '12:00', end: '22:00', available: true }
      },
      createdAt: '2024-01-12T10:00:00Z',
      updatedAt: '2024-03-22T14:00:00Z',
      tags: ['Restaurant', 'Garden', 'Intimate']
    }
  ];

  // Reactive statements for filtering and pagination
  $: {
    let filtered = venues;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(venue => venue.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(venue => venue.status === selectedStatus);
    }

    filteredVenues = filtered;
    
    // Reset to first page if current page is out of bounds
    const maxPage = Math.ceil(filteredVenues.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      currentPage = 1;
    }
  }

  // Computed values
  $: totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  $: paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  $: uniqueTypes = [...new Set(venues.map(v => v.type))];
  $: uniqueStatuses = [...new Set(venues.map(v => v.status))];

  // Functions
  function loadVenues() {
    isLoading = true;
    // Simulate API call
    setTimeout(() => {
      venues = [...mockVenues];
      isLoading = false;
    }, 1000);
  }

  function handleSearch(event) {
    searchQuery = event.target.value;
    currentPage = 1; // Reset to first page
  }

  function handleTypeFilter(event) {
    selectedType = event.target.value;
    currentPage = 1;
  }

  function handleStatusFilter(event) {
    selectedStatus = event.target.value;
    currentPage = 1;
  }

  function toggleViewMode() {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleDeleteVenue(venue) {
    venueToDelete = venue;
    showDeleteDialog = true;
  }

  function confirmDelete() {
    if (venueToDelete) {
      venues = venues.filter(v => v.id !== venueToDelete.id);
      venueToDelete = null;
      showDeleteDialog = false;
    }
  }

  function cancelDelete() {
    venueToDelete = null;
    showDeleteDialog = false;
  }

  // Clear filters
  function clearFilters() {
    searchQuery = '';
    selectedType = 'all';
    selectedStatus = 'all';
    currentPage = 1;
  }

  // ✅ Modal handlers - DÜZELTME: Önce modal aç, sonra detail sayfasına git
  function handleViewVenueDetails(event) {
    // Modal açılsın
    selectedVenueForDetails = event.detail;
    showVenueDetails = true;
  }

  function handleCloseVenueDetails() {
    showVenueDetails = false;
    selectedVenueForDetails = null;
  }

  function handleEditVenueFromModal(event) {
    const venueId = event.detail.id;
    console.log('Edit venue:', venueId);
    goto(`/venues/${venueId}/edit`);
    handleCloseVenueDetails();
  }

  function handleDeleteVenueFromModal(event) {
    handleDeleteVenue(event.detail);
    handleCloseVenueDetails();
  }

  // ✅ Modal içindeki "View Full Details" butonu için
  function handleViewFullDetailsFromModal(event) {
    const venueId = event.detail.id;
    console.log('Navigate to full details from modal:', venueId);
    handleCloseVenueDetails(); // Önce modal'ı kapat
    goto(`/venues/${venueId}`); // Sonra detail sayfasına git
  }

  // Direct navigation functions
  function navigateToEditVenue(venueId) {
    console.log('Navigate to edit venue:', venueId);
    goto(`/venues/${venueId}/edit`);
  }

  function navigateToCreateVenue() {
    console.log('Navigate to create venue');
    goto('/venues/create');
  }

  // Lifecycle
  onMount(() => {
    loadVenues();
  });
</script>

<svelte:head>
  <title>Venues - Event Management</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Venues</h1>
      <p class="text-gray-600 mt-1">Manage your event venues and locations</p>
    </div>
    <button 
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      on:click={navigateToCreateVenue}
    >
      <Plus class="h-4 w-4 mr-2" />
      Add Venue
    </button>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <MapPin class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Venues</p>
            <p class="text-2xl font-bold">{venues.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <Users class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Active Venues</p>
            <p class="text-2xl font-bold">{venues.filter(v => v.status === 'active').length}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Calendar class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Bookings</p>
            <p class="text-2xl font-bold">{venues.reduce((sum, v) => sum + v.totalBookings, 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-orange-100 rounded-lg">
            <Star class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Avg Rating</p>
            <p class="text-2xl font-bold">
              {venues.length > 0 ? (venues.reduce((sum, v) => sum + v.rating, 0) / venues.length).toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Filters and Search -->
  <Card class="">
    <CardContent class="p-4">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            on:input={handleSearch}
            class="pl-10"
          />
        </div>

        <!-- Filters -->
        <div class="flex gap-2">
          <!-- Type Filter -->
          <select 
            bind:value={selectedType} 
            on:change={handleTypeFilter}
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {#each uniqueTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </select>

          <!-- Status Filter -->
          <select 
            bind:value={selectedStatus} 
            on:change={handleStatusFilter}
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {#each uniqueStatuses as status}
              <option value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            {/each}
          </select>

          <!-- Clear Filters -->
          <Button
            variant="outline"
            size="sm"
            class=""
            disabled={false}
            on:click={clearFilters}
          >
            Clear
          </Button>

          <!-- View Toggle -->
          <Button
            variant="outline"
            size="sm"
            on:click={toggleViewMode}
            class="flex items-center gap-2"
            disabled={false}
          >
            {#if viewMode === 'grid'}
              <List class="h-4 w-4" />
              List
            {:else}
              <Grid3X3 class="h-4 w-4" />
              Grid
            {/if}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Results Info -->
  <div class="flex items-center justify-between text-sm text-gray-600">
    <span>
      Showing {paginatedVenues.length} of {filteredVenues.length} venues
    </span>
    <span>
      Page {currentPage} of {totalPages}
    </span>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <!-- Venues Grid/List -->
    {#if paginatedVenues.length === 0}
      <Card class="">
        <CardContent class="p-12 text-center">
          <MapPin class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p class="text-gray-600 mb-4">
            {#if searchQuery || selectedType !== 'all' || selectedStatus !== 'all'}
              Try adjusting your search or filters
            {:else}
              Get started by adding your first venue
            {/if}
          </p>
          {#if !searchQuery && selectedType === 'all' && selectedStatus === 'all'}
            <button 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              on:click={navigateToCreateVenue}
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Venue
            </button>
          {:else}
            <Button class="" disabled={false} on:click={clearFilters}>
              Clear Filters
            </Button>
          {/if}
        </CardContent>
      </Card>
    {:else}
      <!-- Grid View -->
      {#if viewMode === 'grid'}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" in:fade={{ duration: 300 }}>
          {#each paginatedVenues as venue (venue.id)}
            <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
              <!-- ✅ DÜZELTME: viewDetails modal açsın, edit direkt sayfaya gitsin -->
              <AppVenueCard 
                {venue} 
                on:delete={() => handleDeleteVenue(venue)}
                on:viewDetails={handleViewVenueDetails}
                on:edit={() => navigateToEditVenue(venue.id)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View -->
        <div class="space-y-4" in:fade={{ duration: 300 }}>
          {#each paginatedVenues as venue (venue.id)}
            <div in:fly={{ x: -20, duration: 300, delay: 100 }}>
              <!-- ✅ DÜZELTME: viewDetails modal açsın, edit direkt sayfaya gitsin -->
              <AppVenueCard 
                {venue} 
                on:delete={() => handleDeleteVenue(venue)}
                on:viewDetails={handleViewVenueDetails}
                on:edit={() => navigateToEditVenue(venue.id)}
              />
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="mt-8">
        <div class="flex justify-center">
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <Button
              variant="outline"
              size="sm"
              class="px-3 py-2 flex items-center gap-1"
              disabled={currentPage === 1}
              on:click={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft class="h-4 w-4" />
              Previous
            </Button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                {#if page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)}
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    class="px-3 py-2 min-w-[40px] {page === currentPage ? 'bg-blue-600 text-white border-blue-600' : ''}"
                    disabled={false}
                    on:click={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                {:else if page === currentPage - 3 || page === currentPage + 3}
                  <span class="px-2 py-2 text-gray-500">...</span>
                {/if}
              {/each}
            </div>

            <!-- Next Button -->
            <Button
              variant="outline"
              size="sm"
              class="px-3 py-2 flex items-center gap-1"
              disabled={currentPage === totalPages}
              on:click={() => goToPage(currentPage + 1)}
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <!-- Page Info -->
        <div class="text-center text-sm text-gray-600 mt-4">
          Page {currentPage} of {totalPages} • {filteredVenues.length} total venues
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- Delete Confirmation Dialog -->
<Dialog bind:open={showDeleteDialog}>
  <DialogContent class="" portalProps={{}}>
    <DialogHeader class="">
      <DialogTitle class="">Delete Venue</DialogTitle>
      <DialogDescription class="">
        Are you sure you want to delete "{venueToDelete?.name}"? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter class="">
      <Button variant="outline" class="" disabled={false} on:click={cancelDelete}>Cancel</Button>
      <Button variant="destructive" class="" disabled={false} on:click={confirmDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<!-- ✅ Venue Details Modal - "View Full Details" event handler eklendi -->
{#if selectedVenueForDetails}
  <VenueDetailsModal
    bind:isOpen={showVenueDetails}
    venue={selectedVenueForDetails}
    on:close={handleCloseVenueDetails}
    on:edit={handleEditVenueFromModal}
    on:delete={handleDeleteVenueFromModal}
    on:viewFullDetails={handleViewFullDetailsFromModal}
  />
{/if}

      
