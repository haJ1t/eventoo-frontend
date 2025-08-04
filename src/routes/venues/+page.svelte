<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { 
      Search, 
      Filter, 
      Plus, 
      MapPin, 
      Users, 
      Building2,
      SlidersHorizontal,
      X
    } from "lucide-svelte";
    import AppVenueCard from "$lib/components/app-venue-card.svelte";
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "$lib/components/ui/alert-dialog";
  
    // Test verileri
    let venues = [
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
        amenities: ['WiFi', 'Projector', 'Sound System', 'Parking']
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
        amenities: ['Catering', 'Decoration', 'Dance Floor', 'Bar']
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
        amenities: ['Garden', 'Outdoor Lighting', 'Gazebo']
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
        amenities: ['Chandelier', 'VIP Area', 'Premium Catering', 'Valet Parking']
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
        amenities: ['High-Speed WiFi', 'Live Streaming', 'Recording Equipment', 'Green Room']
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
        amenities: ['City View', 'Bar', 'Lounge Area', 'Heaters']
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
        amenities: ['WiFi', 'Whiteboard', 'Coffee Station', 'Parking']
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
        amenities: ['Ocean View', 'Beach Access', 'Outdoor Ceremony', 'Catering']
      }
    ];
  
    // Filter states
    let searchQuery = '';
    let selectedLocation = '';
    let selectedCapacity = '';
    let selectedType = '';
    let selectedStatus = '';
    let filteredVenues = venues;
  
    // Alert dialog state
    let showDeleteAlert = false;
    let venueToDelete = null;
  
    // Reactive unique values for filters
    $: locations = [...new Set(venues.map(v => v.location))].sort();
    $: types = [...new Set(venues.map(v => v.type))].sort();
    $: capacityRanges = ['0-100', '101-300', '301-500', '500+'];
    $: statusOptions = ['active', 'inactive'];
  
    // Reactive filter application
    $: {
      filteredVenues = venues.filter(venue => {
        // Search filter
        const matchesSearch = searchQuery.trim() === '' || 
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchQuery.toLowerCase());
  
        // Location filter
        const matchesLocation = selectedLocation === '' || venue.location === selectedLocation;
        
        // Type filter
        const matchesType = selectedType === '' || venue.type === selectedType;
        
        // Status filter
        const matchesStatus = selectedStatus === '' || venue.status === selectedStatus;
        
        // Capacity filter
        const matchesCapacity = selectedCapacity === '' || (() => {
          switch(selectedCapacity) {
            case '0-100': return venue.capacity <= 100;
            case '101-300': return venue.capacity > 100 && venue.capacity <= 300;
            case '301-500': return venue.capacity > 300 && venue.capacity <= 500;
            case '500+': return venue.capacity > 500;
            default: return true;
          }
        })();
  
        return matchesSearch && matchesLocation && matchesType && matchesStatus && matchesCapacity;
      });
    }
  
    // Clear all filters
    function clearFilters() {
      searchQuery = '';
      selectedLocation = '';
      selectedCapacity = '';
      selectedType = '';
      selectedStatus = '';
    }
  
    // Remove individual filter
    function removeFilter(filterType) {
      switch(filterType) {
        case 'location': selectedLocation = ''; break;
        case 'capacity': selectedCapacity = ''; break;
        case 'type': selectedType = ''; break;
        case 'status': selectedStatus = ''; break;
      }
    }
  
    // Handle venue actions
    function handleVenueEdit(event) {
      const venue = event.detail;
      goto(`/venues/edit/${venue.id}`);
    }
  
    function handleVenueView(event) {
      const venue = event.detail;
      goto(`/venues/${venue.id}`);
    }
  
    function handleVenueDelete(event) {
      venueToDelete = event.detail;
      showDeleteAlert = true;
    }
  
    function confirmDelete() {
      if (venueToDelete) {
        venues = venues.filter(v => v.id !== venueToDelete.id);
        console.log(`Venue "${venueToDelete.name}" deleted successfully`);
        venueToDelete = null;
      }
      showDeleteAlert = false;
    }
  
    function cancelDelete() {
      venueToDelete = null;
      showDeleteAlert = false;
    }
  
    // Add new venue
    function handleAddVenue() {
       console.log('Add venue button clicked!');
       goto('/venues/new');
    }

  
    // Active filters count
    $: activeFiltersCount = [selectedLocation, selectedCapacity, selectedType, selectedStatus].filter(f => f !== '').length;
  
    // Filter display names
    function getFilterDisplayName(filterType, value) {
      switch(filterType) {
        case 'location': return `Location: ${value}`;
        case 'capacity': return `Capacity: ${value} people`;
        case 'type': return `Type: ${value}`;
        case 'status': return `Status: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
        default: return value;
      }
    }
  </script>
  
  <svelte:head>
    <title>Venues - Evento</title>
  </svelte:head>
  
  <div class="container mx-auto p-6 max-w-7xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Venues</h1>
        <p class="text-muted-foreground mt-1">
          Manage your event venues and locations
        </p>
      </div>
      <a href="/venues/new">
        <Button class="shrink-0">
          <Plus class="h-4 w-4 mr-2" />
          Add Venue
        </Button>
      </a>
      
    </div>
  
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-card border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Building2 class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Venues</p>
            <p class="text-2xl font-bold">{venues.length}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <MapPin class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Active Venues</p>
            <p class="text-2xl font-bold">{venues.filter(v => v.status === 'active').length}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Users class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Capacity</p>
            <p class="text-2xl font-bold">{venues.reduce((sum, v) => sum + v.capacity, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-orange-100 rounded-lg">
            <Building2 class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Upcoming Events</p>
            <p class="text-2xl font-bold">{venues.reduce((sum, v) => sum + v.upcomingEvents, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Search and Filters -->
    <div class="bg-card border rounded-lg p-6 mb-8">
      <div class="flex flex-col gap-4">
        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            bind:value={searchQuery}
            placeholder="Search venues by name, location, type, or description..."
            class="pl-10"
          />
        </div>
        
        <!-- Filters -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <!-- Location Filter -->
          <select 
            bind:value={selectedLocation}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Locations</option>
            {#each locations as location}
              <option value={location}>{location}</option>
            {/each}
          </select>
  
          <!-- Capacity Filter -->
          <select 
            bind:value={selectedCapacity}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Capacities</option>
            {#each capacityRanges as range}
              <option value={range}>{range} people</option>
            {/each}
          </select>
  
          <!-- Type Filter -->
          <select 
            bind:value={selectedType}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Types</option>
            {#each types as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
  
          <!-- Status Filter -->
          <select 
            bind:value={selectedStatus}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Status</option>
            {#each statusOptions as status}
              <option value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            {/each}
          </select>
  
          <!-- Clear Filters -->
          {#if activeFiltersCount > 0}
            <Button variant="outline" on:click={clearFilters} class="w-full">
              <SlidersHorizontal class="h-4 w-4 mr-2" />
              Clear ({activeFiltersCount})
            </Button>
          {/if}
        </div>
      </div>
    </div>
  
    <!-- Active Filters Display -->
    {#if activeFiltersCount > 0}
      <div class="flex items-center gap-2 mb-6 flex-wrap">
        <span class="text-sm text-muted-foreground">Active filters:</span>
        {#if selectedLocation}
          <Badge variant="secondary" class="text-xs flex items-center gap-1">
            {getFilterDisplayName('location', selectedLocation)}
            <button on:click={() => removeFilter('location')} class="ml-1 hover:bg-muted rounded-full p-0.5">
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
        {#if selectedCapacity}
          <Badge variant="secondary" class="text-xs flex items-center gap-1">
            {getFilterDisplayName('capacity', selectedCapacity)}
            <button on:click={() => removeFilter('capacity')} class="ml-1 hover:bg-muted rounded-full p-0.5">
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
        {#if selectedType}
          <Badge variant="secondary" class="text-xs flex items-center gap-1">
            {getFilterDisplayName('type', selectedType)}
            <button on:click={() => removeFilter('type')} class="ml-1 hover:bg-muted rounded-full p-0.5">
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
        {#if selectedStatus}
          <Badge variant="secondary" class="text-xs flex items-center gap-1">
            {getFilterDisplayName('status', selectedStatus)}
            <button on:click={() => removeFilter('status')} class="ml-1 hover:bg-muted rounded-full p-0.5">
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
      </div>
    {/if}
  
    <!-- Results Info -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-muted-foreground">
        Showing {filteredVenues.length} of {venues.length} venues
        {#if activeFiltersCount > 0}
          <span class="text-primary">({activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied)</span>
        {/if}
      </p>
    </div>
  
    <!-- Venues Grid -->
    {#if filteredVenues.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredVenues as venue (venue.id)}
          <AppVenueCard 
            {venue} 
            on:edit={handleVenueEdit}
            on:view={handleVenueView}
            on:delete={handleVenueDelete}
          />
        {/each}
      </div>
    {:else}
      <div class="text-center py-16">
        <div class="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Building2 class="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold mb-2">No venues found</h3>
        <p class="text-muted-foreground mb-6 max-w-md mx-auto">
          {#if activeFiltersCount > 0}
            No venues match your current filters. Try adjusting your search criteria.
          {:else}
            Get started by adding your first venue to the system.
          {/if}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          {#if activeFiltersCount > 0}
            <Button variant="outline" on:click={clearFilters}>
              <SlidersHorizontal class="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          {/if}
          <Button on:click={handleAddVenue}>
            <Plus class="h-4 w-4 mr-2" />
            Add New Venue
          </Button>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Delete Confirmation Alert Dialog -->
  <AlertDialog bind:open={showDeleteAlert}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Venue</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete "{venueToDelete?.name}"?
          {#if venueToDelete?.upcomingEvents > 0}
            <br><br>
            <span class="text-destructive font-medium">
              Warning: This venue has {venueToDelete.upcomingEvents} upcoming events that will be affected.
            </span>
          {/if}
          <br><br>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel on:click={cancelDelete}>Cancel</AlertDialogCancel>
        <AlertDialogAction on:click={confirmDelete} class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Delete Venue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  