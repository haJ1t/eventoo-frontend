<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Plus, Search, Filter, Grid, List, MoreVertical, MapPin, Building, Tag } from 'lucide-svelte';
  import AppVenueCard from '$lib/components/app-venue-card.svelte';
  import AppSearchBar from '$lib/components/app-search-bar.svelte';
  import AppFilterDropdown from '$lib/components/app-filter-dropdown.svelte';
  import AppFilterTags from '$lib/components/app-filter-tags.svelte';
  import * as Pagination from '$lib/components/ui/pagination/index.js';

  // State
  let loading = $state(false);
  let viewMode = $state('grid');
  let selectedVenue = $state(null);
  let showDeleteDialog = $state(false);
  
  // Search and filter state
  let searchQuery = $state("");
  let selectedTags = $state([]);
  let selectedLocations = $state([]);
  let selectedVenueTypes = $state([]);
  let activeDropdown = $state(null);
  
  // Pagination state
  let currentPage = $state(1);
  let itemsPerPage = $state(3);

  // Test verileri
  let venues = $state([
    {
      id: '1',
      name: 'Grand Conference Hall',
      location: 'Istanbul, Turkey',
      capacity: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center',
      type: 'Conference',
      status: 'active',
      upcomingEvents: 3,
      description: 'Modern conference hall with state-of-the-art facilities',
      amenities: ['WiFi', 'Projector', 'Sound System', 'Parking'],
      rating: 4.8,
      totalBookings: 156,
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 150,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T14:30:00Z',
      tags: ['Technology', 'Business', 'Professional']
    },
    {
      id: '2',
      name: 'Modern Event Center',
      location: 'Ankara, Turkey',
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'active',
      upcomingEvents: 1,
      description: 'Elegant event center perfect for weddings',
      amenities: ['Catering', 'Decoration', 'Dance Floor', 'Bar'],
      rating: 4.9,
      totalBookings: 89,
      images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 120,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-03-15T11:20:00Z',
      tags: ['Wedding', 'Celebration', 'Elegant']
    },
    {
      id: '3',
      name: 'Outdoor Garden Venue',
      location: 'Izmir, Turkey',
      capacity: 150,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center',
      type: 'Party',
      status: 'inactive',
      upcomingEvents: 0,
      description: 'Beautiful outdoor garden venue',
      amenities: ['Garden', 'Outdoor Lighting', 'Gazebo'],
      rating: 4.5,
      totalBookings: 45,
      images: ['https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 90,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-02-15T11:00:00Z',
      updatedAt: '2024-03-08T13:15:00Z',
      tags: ['Outdoor', 'Garden', 'Natural']
    },
    {
      id: '4',
      name: 'Luxury Ballroom',
      location: 'Antalya, Turkey',
      capacity: 300,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'active',
      upcomingEvents: 5,
      description: 'Luxurious ballroom for premium events',
      amenities: ['Chandelier', 'VIP Area', 'Premium Catering', 'Valet Parking'],
      rating: 4.7,
      totalBookings: 234,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 250,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-03-10T16:45:00Z',
      tags: ['Luxury', 'Wedding', 'Premium']
    },
    {
      id: '5',
      name: 'Tech Hub Auditorium',
      location: 'Bursa, Turkey',
      capacity: 800,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
      type: 'Conference',
      status: 'active',
      upcomingEvents: 2,
      description: 'Large auditorium for tech conferences',
      amenities: ['High-Speed WiFi', 'Live Streaming', 'Recording Equipment', 'Green Room'],
      rating: 4.6,
      totalBookings: 67,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 180,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-02-10T12:00:00Z',
      updatedAt: '2024-03-05T09:30:00Z',
      tags: ['Technology', 'Conference', 'Modern']
    },
    {
      id: '6',
      name: 'Rooftop Terrace',
      location: 'Istanbul, Turkey',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop&crop=center',
      type: 'Party',
      status: 'active',
      upcomingEvents: 4,
      description: 'Stunning rooftop terrace with city views',
      amenities: ['City View', 'Bar', 'Lounge Area', 'Heaters'],
      rating: 4.8,
      totalBookings: 92,
      images: ['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 160,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-02-05T13:00:00Z',
      updatedAt: '2024-03-18T15:30:00Z',
      tags: ['Rooftop', 'City View', 'Party']
    },
    {
      id: '7',
      name: 'Corporate Meeting Room',
      location: 'Ankara, Turkey',
      capacity: 50,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&crop=center',
      type: 'Corporate',
      status: 'active',
      upcomingEvents: 8,
      description: 'Professional meeting room for corporate events',
      amenities: ['WiFi', 'Whiteboard', 'Coffee Station', 'Parking'],
      rating: 4.4,
      totalBookings: 123,
      images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 75,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-01-25T08:00:00Z',
      updatedAt: '2024-03-12T10:00:00Z',
      tags: ['Corporate', 'Business', 'Professional']
    },
    {
      id: '8',
      name: 'Beach Resort Hall',
      location: 'Antalya, Turkey',
      capacity: 250,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'inactive',
      upcomingEvents: 0,
      description: 'Beachfront wedding venue with ocean views',
      amenities: ['Ocean View', 'Beach Access', 'Outdoor Ceremony', 'Catering'],
      rating: 4.3,
      totalBookings: 78,
      images: ['https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 200,
      availability: {
        monday: { start: '09:00', end: '20:00', available: true },
        tuesday: { start: '09:00', end: '20:00', available: true },
        wednesday: { start: '09:00', end: '20:00', available: true },
        thursday: { start: '09:00', end: '20:00', available: true },
        friday: { start: '09:00', end: '20:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '09:00', end: '20:00', available: true },
      },
      createdAt: '2024-01-10T15:00:00Z',
      updatedAt: '2024-02-28T12:00:00Z',
      tags: ['Beach', 'Wedding', 'Ocean View']
    }
  ]);

  // Filter options
  const locationOptions = [
    "Istanbul, Turkey",
    "Ankara, Turkey", 
    "Izmir, Turkey",
    "Antalya, Turkey",
    "Bursa, Turkey"
  ];

  const venueTypeOptions = [
    "Conference",
    "Wedding",
    "Party",
    "Corporate"
  ];

  const tagOptions = [
    "Technology",
    "Business", 
    "Professional",
    "Wedding",
    "Celebration",
    "Elegant",
    "Outdoor",
    "Garden",
    "Natural",
    "Luxury",
    "Premium",
    "Modern",
    "Rooftop",
    "City View",
    "Party",
    "Corporate",
    "Beach",
    "Ocean View"
  ];

  // Filter venues based on search query and selected filters
  const filteredVenues = $derived(
    venues.filter(venue => {
      const matchesSearch = searchQuery === "" || 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => venue.tags?.includes(tag));

      const matchesLocation = selectedLocations.length === 0 ||
        selectedLocations.some(loc => venue.location.includes(loc));
        
      const matchesType = selectedVenueTypes.length === 0 ||
        selectedVenueTypes.some(type => venue.type === type);

      return matchesSearch && matchesTags && matchesLocation && matchesType;
    })
  );

  // Reset to page 1 when filters change
  $effect(() => {
    searchQuery;
    selectedTags;
    selectedLocations;
    selectedVenueTypes;
    
    currentPage = 1;
  });

  // Derived store for paginated venues
  const paginatedVenues = $derived(
    filteredVenues.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    )
  );

  // Functions
  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  function clearAllTags() {
    selectedTags = [];
    activeDropdown = null;
  }

  function selectLocation(location) {
    console.log("Selected location:", location);
    activeDropdown = null;
  }

  function selectVenueType(type) {
    console.log("Selected venue type:", type);
    activeDropdown = null;
  }

  function handleDropdownToggle(dropdownName) {
    activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
  }

  function closeAllDropdowns() {
    activeDropdown = null;
  }

  function handleClickOutside(event) {
    if (!event.target.closest('.dropdown-container')) {
      closeAllDropdowns();
    }
  }

  // Event handlers
  function handleAddVenue() {
    console.log('Add venue button clicked!');
    goto('/venues/new');
  }

  function handleDeleteVenue(venue) {
    console.log('Delete venue:', venue);
    selectedVenue = venue;
    showDeleteDialog = true;
  }

  async function confirmDelete() {
    if (!selectedVenue) return;
    
    loading = true;
    try {
      console.log('Deleting venue:', selectedVenue.name);
      await new Promise(resolve => setTimeout(resolve, 500));
      venues = venues.filter(v => v.id !== selectedVenue.id);
      showDeleteDialog = false;
      selectedVenue = null;
      alert(`Venue "${selectedVenue?.name}" has been deleted successfully!`);
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Error deleting venue. Please try again.');
    } finally {
      loading = false;
    }
  }

  function handleViewModeChange(mode) {
    viewMode = mode;
    console.log('View mode changed to:', mode);
  }
</script>

<svelte:head>
  <title>Venues - Evento</title>
</svelte:head>

<svelte:window on:click={handleClickOutside} />

<div class="container mx-auto p-6 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Venues</h1>
      <p class="text-muted-foreground">Manage your event venues</p>
    </div>
    <Button 
      class="" 
      disabled={false} 
      onclick={handleAddVenue}
      type="button"
    >
      <Plus class="h-4 w-4 mr-2" />
      Add Venue
    </Button>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2">
          <div class="text-2xl font-bold">{venues.length}</div>
          <div class="text-sm text-muted-foreground">Total Venues</div>
        </div>
      </CardContent>
    </Card>
    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2">
          <div class="text-2xl font-bold">{venues.filter(v => v.status === 'active').length}</div>
          <div class="text-sm text-muted-foreground">Active</div>
        </div>
      </CardContent>
    </Card>
    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2">
          <div class="text-2xl font-bold">{venues.reduce((sum, v) => sum + (v.totalBookings || 0), 0)}</div>
          <div class="text-sm text-muted-foreground">Total Bookings</div>
        </div>
      </CardContent>
    </Card>
    <Card class="">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2">
          <div class="text-2xl font-bold">
            {venues.length > 0 ? (venues.reduce((sum, v) => sum + (v.rating || 0), 0) / venues.length).toFixed(1) : '0.0'}
          </div>
          <div class="text-sm text-muted-foreground">Avg Rating</div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Search and Filters -->
  <div class="space-y-4">
    
    <!-- Search bar -->
    <div class="relative">
        <AppSearchBar
        bind:value={searchQuery}
        placeholder="Search venues..."
        showIcon={true}
      />
    </div>
    
    <!-- Filter Controls -->
    <div class="flex flex-wrap gap-4">
      <!-- Location Filter -->
      <AppFilterDropdown
        bind:selectedValues={selectedLocations}
        options={locationOptions}
        label="Location"
        icon={MapPin}
        isOpen={activeDropdown === 'location'}
        onToggle={() => handleDropdownToggle('location')}
      />
      
      <!-- Venue Type Filter -->
      <AppFilterDropdown
        bind:selectedValues={selectedVenueTypes}
        options={venueTypeOptions}
        label="Venue Type"
        icon={Building}
        isOpen={activeDropdown === 'venueType'}
        onToggle={() => handleDropdownToggle('venueType')}
      />
      
      <!-- Tags Filter -->
      <AppFilterDropdown
        bind:selectedValues={selectedTags}
        options={tagOptions}
        icon={Tag}
        label="Tags"
        isOpen={activeDropdown === 'tags'}
        onToggle={() => handleDropdownToggle('tags')}
      />
      
      <!-- View Mode Toggle -->
      <div class="flex border rounded-md">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          class="rounded-r-none"
          disabled={false}
          onclick={() => handleViewModeChange('grid')}
          type="button"
        >
          <Grid class="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          class="rounded-l-none"
          disabled={false}
          onclick={() => handleViewModeChange('list')}
          type="button"
        >
          <List class="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    <!-- Remove this entire section:
    {#if selectedTags.length > 0 || selectedLocations.length > 0 || selectedVenueTypes.length > 0}
      <AppFilterTags 
        {selectedTags}
        selectedLocations={selectedLocations}
        selectedVenueTypes={selectedVenueTypes}
        onRemoveTag={toggleTag}
        onRemoveLocation={(location) => {
          selectedLocations = selectedLocations.filter(loc => loc !== location);
        }}
        onRemoveVenueType={(type) => {
          selectedVenueTypes = selectedVenueTypes.filter(t => t !== type);
        }}
        onClearAll={() => {
          selectedTags = [];
          selectedLocations = [];
          selectedVenueTypes = [];
        }}
      />
    {/if}
    -->
  </div>

  <!-- Loading State -->
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2">Loading venues...</span>
    </div>
  {:else}
    <!-- Venues Grid/List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Showing {paginatedVenues.length} of {filteredVenues.length} venues
        </p>
      </div>

      {#if filteredVenues.length === 0}
        <Card class="">
          <CardContent class="p-12 text-center">
            <div class="text-muted-foreground">
              <div class="text-lg font-medium mb-2">No venues found</div>
              <p>Try adjusting your search criteria or create a new venue.</p>
              <Button 
                class="mt-4" 
                disabled={false} 
                onclick={handleAddVenue}
                type="button"
              >
                <Plus class="h-4 w-4 mr-2" />
                Create Your First Venue
              </Button>
            </div>
          </CardContent>
        </Card>
      {:else if viewMode === 'grid'}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each paginatedVenues as venue (venue.id)}
            <AppVenueCard {venue} on:delete={() => handleDeleteVenue(venue)} />
          {/each}
        </div>
      {:else}
        <div class="space-y-4">
          {#each paginatedVenues as venue (venue.id)}
            <AppVenueCard {venue} on:delete={() => handleDeleteVenue(venue)} />
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Pagination -->
    {#if filteredVenues.length > itemsPerPage}
      <Pagination.Root 
        class=""
        count={filteredVenues.length} 
        perPage={itemsPerPage}
        bind:page={currentPage}
      >
        {#snippet children({ pages, currentPage: paginationCurrentPage })}
          <Pagination.Content class="">
            <Pagination.Item>
              <Pagination.PrevButton class="" children={null} />
            </Pagination.Item>
            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <Pagination.Item class="bg-primary text-white">
                  <Pagination.Ellipsis class="" />
                </Pagination.Item>
              {:else}
                <Pagination.Item>
                  <Pagination.Link class="" {page} isActive={paginationCurrentPage === page.value}>
                    {page.value}
                  </Pagination.Link>
                </Pagination.Item>
              {/if}
            {/each}
            <Pagination.Item>
              <Pagination.NextButton class="" children={null} />
            </Pagination.Item>
          </Pagination.Content>
        {/snippet}
      </Pagination.Root>
    {/if}
  {/if}
</div>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={showDeleteDialog}>
  <AlertDialog.Content class="" portalProps={{}}>
    <AlertDialog.Header class="">
      <AlertDialog.Title class="">Delete Venue</AlertDialog.Title>
      <AlertDialog.Description class="">
        Are you sure you want to delete "{selectedVenue?.name}"? This action cannot be undone and will remove all associated bookings and data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer class="">
      <AlertDialog.Cancel 
        class=""
        onclick={() => {
          showDeleteDialog = false;
          selectedVenue = null;
        }}
      >
        Cancel
      </AlertDialog.Cancel>
      <AlertDialog.Action 
        class="bg-red-600 hover:bg-red-700" 
        disabled={loading} 
        onclick={confirmDelete}
      >
        {#if loading}
          Deleting...
        {:else}
          Delete Venue
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
