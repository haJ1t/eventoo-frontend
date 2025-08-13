<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Plus, Search, Filter, Grid, List, MoreVertical } from 'lucide-svelte';
  import AppVenueCard from '$lib/components/app-venue-card.svelte';
  import VenueFilters from '$lib/components/venue-filters.svelte';

  // State
  let filteredVenues: any[] = $state([]);
  let loading = $state(false);
  let viewMode: 'grid' | 'list' = $state('grid');
  let showFilters = $state(false);
  let selectedVenue: any = $state(null);
  let showDeleteDialog = $state(false);

  // Filters
  let filters = $state({
    search: '',
    type: '',
    status: '',
    capacity: '',
    location: ''
  });

  // Test verileri
  let venues = $state([
    {
      id: '1',
      name: 'Grand Conference Hall',
      location: 'Istanbul, Turkey',
      capacity: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center',
      type: 'Conference',
      status: 'active' as const,
      upcomingEvents: 3,
      description: 'Modern conference hall with state-of-the-art facilities',
      amenities: ['WiFi', 'Projector', 'Sound System', 'Parking'],
      rating: 4.8,
      totalBookings: 156,
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 150,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T14:30:00Z'
    },
    {
      id: '2',
      name: 'Modern Event Center',
      location: 'Ankara, Turkey',
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'active' as const,
      upcomingEvents: 1,
      description: 'Elegant event center perfect for weddings',
      amenities: ['Catering', 'Decoration', 'Dance Floor', 'Bar'],
      rating: 4.9,
      totalBookings: 89,
      images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 120,
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-03-15T11:20:00Z'
    },
    {
      id: '3',
      name: 'Outdoor Garden Venue',
      location: 'Izmir, Turkey',
      capacity: 150,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center',
      type: 'Party',
      status: 'inactive' as const,
      upcomingEvents: 0,
      description: 'Beautiful outdoor garden venue',
      amenities: ['Garden', 'Outdoor Lighting', 'Gazebo'],
      rating: 4.5,
      totalBookings: 45,
      images: ['https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 90,
      createdAt: '2024-02-15T11:00:00Z',
      updatedAt: '2024-03-08T13:15:00Z'
    },
    {
      id: '4',
      name: 'Luxury Ballroom',
      location: 'Antalya, Turkey',
      capacity: 300,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'active' as const,
      upcomingEvents: 5,
      description: 'Luxurious ballroom for premium events',
      amenities: ['Chandelier', 'VIP Area', 'Premium Catering', 'Valet Parking'],
      rating: 4.7,
      totalBookings: 234,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 250,
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-03-10T16:45:00Z'
    },
    {
      id: '5',
      name: 'Tech Hub Auditorium',
      location: 'Bursa, Turkey',
      capacity: 800,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
      type: 'Conference',
      status: 'active' as const,
      upcomingEvents: 2,
      description: 'Large auditorium for tech conferences',
      amenities: ['High-Speed WiFi', 'Live Streaming', 'Recording Equipment', 'Green Room'],
      rating: 4.6,
      totalBookings: 67,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 180,
      createdAt: '2024-02-10T12:00:00Z',
      updatedAt: '2024-03-05T09:30:00Z'
    },
    {
      id: '6',
      name: 'Rooftop Terrace',
      location: 'Istanbul, Turkey',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop&crop=center',
      type: 'Party',
      status: 'active' as const,
      upcomingEvents: 4,
      description: 'Stunning rooftop terrace with city views',
      amenities: ['City View', 'Bar', 'Lounge Area', 'Heaters'],
      rating: 4.8,
      totalBookings: 92,
      images: ['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 160,
      createdAt: '2024-02-05T13:00:00Z',
      updatedAt: '2024-03-18T15:30:00Z'
    },
    {
      id: '7',
      name: 'Corporate Meeting Room',
      location: 'Ankara, Turkey',
      capacity: 50,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&crop=center',
      type: 'Corporate',
      status: 'active' as const,
      upcomingEvents: 8,
      description: 'Professional meeting room for corporate events',
      amenities: ['WiFi', 'Whiteboard', 'Coffee Station', 'Parking'],
      rating: 4.4,
      totalBookings: 123,
      images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 75,
      createdAt: '2024-01-25T08:00:00Z',
      updatedAt: '2024-03-12T10:00:00Z'
    },
    {
      id: '8',
      name: 'Beach Resort Hall',
      location: 'Antalya, Turkey',
      capacity: 250,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center',
      type: 'Wedding',
      status: 'inactive' as const,
      upcomingEvents: 0,
      description: 'Beachfront wedding venue with ocean views',
      amenities: ['Ocean View', 'Beach Access', 'Outdoor Ceremony', 'Catering'],
      rating: 4.3,
      totalBookings: 78,
      images: ['https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=600&h=400&fit=crop&crop=center'],
      pricePerHour: 200,
      createdAt: '2024-01-10T15:00:00Z',
      updatedAt: '2024-02-28T12:00:00Z'
    }
  ]);

  // Lifecycle
  onMount(() => {
    loadVenues();
  });

  // Functions
  async function loadVenues() {
    loading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      applyFilters();
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    filteredVenues = venues.filter(venue => {
      if (filters.search && !venue.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !venue.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type && venue.type !== filters.type) return false;
      if (filters.status && venue.status !== filters.status) return false;
      if (filters.location && !venue.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.capacity) {
        const capacity = venue.capacity;
        switch (filters.capacity) {
          case '0-50':
            if (capacity > 50) return false;
            break;
          case '51-100':
            if (capacity < 51 || capacity > 100) return false;
            break;
          case '101-300':
            if (capacity < 101 || capacity > 300) return false;
            break;
          case '300+':
            if (capacity <= 300) return false;
            break;
        }
      }
      return true;
    });
  }

  // Event handlers
  function handleAddVenue() {
    console.log('Add venue button clicked!');
    goto('/venues/new');
  }

  function handleCreateVenue() {
    console.log('Creating new venue...');
    handleAddVenue();
  }

  function handleDeleteVenue(venue: any) {
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
      applyFilters();
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

  function handleToggleFilters() {
    showFilters = !showFilters;
    console.log('Toggling filters:', showFilters);
  }

  function handleViewModeChange(mode: 'grid' | 'list') {
    viewMode = mode;
    console.log('View mode changed to:', mode);
  }

  function handleClearFilters() {
    console.log('Clearing all filters');
    filters = { search: '', type: '', status: '', capacity: '', location: '' };
    applyFilters();
  }

  // Filter event handlers
  function handleFilterChange(event: CustomEvent) {
    filters = event.detail;
    applyFilters();
  }

  function handleFilterClose() {
    showFilters = false;
  }

  // Reactive effect
  $effect(() => {
    applyFilters();
  });
</script>

<svelte:head>
  <title>Venues - Evento</title>
</svelte:head>

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

  <!-- Filters and Search -->
  <div class="flex gap-4">
    <div class="flex-1">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search venues..."
          class="pl-10"
          bind:value={filters.search}
          oninput={() => applyFilters()}
        />
      </div>
    </div>
    <Button 
      variant="outline" 
      class=""
      disabled={false}
      onclick={handleToggleFilters}
      type="button"
    >
      <Filter class="h-4 w-4 mr-2" />
      Filters
      {#if showFilters}
        <span class="ml-1 text-xs">(Open)</span>
      {/if}
    </Button>
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

  <!-- Filters Panel - DÜZELTİLDİ! -->
  <VenueFilters 
    bind:filters={filters}
    bind:isOpen={showFilters}
    on:filter={handleFilterChange}
    on:close={handleFilterClose}
  />

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
          Showing {filteredVenues.length} of {venues.length} venues
        </p>
        {#if Object.values(filters).some(v => v !== '')}
          <Button
            variant="secondary" 
            size="sm"
            class=""
            disabled={false}
            onclick={handleClearFilters}
            type="button"
          >
            Clear filters
          </Button>
        {/if}
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
          {#each filteredVenues as venue (venue.id)}
            <AppVenueCard {venue} on:delete={() => handleDeleteVenue(venue)} />
          {/each}
        </div>
      {:else}
        <div class="space-y-4">
          {#each filteredVenues as venue (venue.id)}
            <AppVenueCard {venue} on:delete={() => handleDeleteVenue(venue)} />
          {/each}
        </div>
      {/if}
    </div>
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
