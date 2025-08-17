<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { 
    MapPin, 
    Users, 
    Star, 
    Calendar, 
    Clock, 
    Wifi, 
    Car, 
    Coffee,
    Edit,
    Eye,
    Trash2
  } from "lucide-svelte";

  const dispatch = createEventDispatcher();
  
  export let venue: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: number;
    type: string;
    status: 'active' | 'inactive';
    rating: number;
    totalBookings: number;
    amenities: string[];
    images: string[];
    pricePerHour: number;
    availability?: {
      monday: { start: string; end: string; available: boolean };
      tuesday: { start: string; end: string; available: boolean };
      wednesday: { start: string; end: string; available: boolean };
      thursday: { start: string; end: string; available: boolean };
      friday: { start: string; end: string; available: boolean };
      saturday: { start: string; end: string; available: boolean };
      sunday: { start: string; end: string; available: boolean };
    };
    createdAt: string;
    updatedAt: string;
  };

  // Event handlers
  function handleViewDetails() {
    console.log('View details for venue:', venue.id);
    dispatch('view', venue);
    alert(`Viewing details for: ${venue.name}`);
  }

  function handleEdit() {
    console.log('Edit venue:', venue.id);
    dispatch('edit', venue);
    alert(`Editing venue: ${venue.name}`);
  }

  function handleDelete() {
    console.log('Delete venue:', venue.id);
    dispatch('delete', venue);
  }

  // Amenity icons mapping
  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Catering': Coffee,
  };

  function getStatusColor(status: string) {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  function getTypeColor(type: string) {
    const colors: Record<string, string> = {
      'Conference Room': 'bg-blue-100 text-blue-800',
      'Event Hall': 'bg-purple-100 text-purple-800',
      'Meeting Room': 'bg-orange-100 text-orange-800',
      'Auditorium': 'bg-indigo-100 text-indigo-800',
      'Banquet Hall': 'bg-pink-100 text-pink-800',
      'Conference': 'bg-blue-100 text-blue-800',
      'Wedding': 'bg-purple-100 text-purple-800',
      'Party': 'bg-orange-100 text-orange-800',
      'Corporate': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }
</script>

<div class="group bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
  <!-- Image -->
  <div class="relative h-48 overflow-hidden">
    {#if venue.images && venue.images.length > 0}
      <img 
        src={venue.images[0]} 
        alt={venue.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
    {:else}
      <div class="w-full h-full bg-muted flex items-center justify-center">
        <MapPin class="h-12 w-12 text-muted-foreground" />
      </div>
    {/if}
    
    <!-- Status Badge -->
    <div class="absolute top-3 left-3">
      <Badge href="#" class={getStatusColor(venue.status)}>
        {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
      </Badge>
    </div>
    
    <!-- Price -->
    <div class="absolute top-3 right-3">
      <Badge href="#" variant="secondary" class="bg-white/90 text-foreground">
        ${venue.pricePerHour}/hr
      </Badge>
    </div>
  </div>

  <!-- Content -->
  <div class="p-4">
    <!-- Title and Type -->
    <div class="space-y-2 mb-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-lg leading-tight line-clamp-1">
          {venue.name}
        </h3>
        <Badge href="#" class={getTypeColor(venue.type)} variant="secondary">
          {venue.type}
        </Badge>
      </div>
      
      <!-- Description -->
      <p class="text-sm text-muted-foreground line-clamp-2">
        {venue.description}
      </p>
    </div>

    <!-- Location and Capacity -->
    <div class="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
      <div class="flex items-center gap-1">
        <MapPin class="h-4 w-4" />
        <span class="line-clamp-1">{venue.location}</span>
      </div>
      <div class="flex items-center gap-1">
        <Users class="h-4 w-4" />
        <span>{venue.capacity} people</span>
      </div>
    </div>

    <!-- Rating and Bookings -->
    <div class="flex items-center gap-4 mb-3 text-sm">
      <div class="flex items-center gap-1">
        <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span class="font-medium">{venue.rating.toFixed(1)}</span>
      </div>
      <div class="flex items-center gap-1 text-muted-foreground">
        <Calendar class="h-4 w-4" />
        <span>{venue.totalBookings} bookings</span>
      </div>
    </div>

    <!-- Amenities -->
    {#if venue.amenities && venue.amenities.length > 0}
      <div class="mb-4">
        <div class="flex items-center gap-2 flex-wrap">
          {#each venue.amenities.slice(0, 3) as amenity}
            <div class="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
              {#if amenityIcons[amenity]}
                <svelte:component this={amenityIcons[amenity]} class="h-3 w-3" />
              {/if}
              <span>{amenity}</span>
            </div>
          {/each}
          {#if venue.amenities.length > 3}
            <Badge href="#" variant="outline" class="text-xs">
              +{venue.amenities.length - 3} more
            </Badge>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Action Buttons -->
    <div class="flex items-center gap-2 pt-2 border-t">
      <Button
        variant="outline"
        size="sm"
        class="flex-1"
        disabled={false}
        on:click={handleViewDetails}
        type="button"
      >
        <Eye class="h-4 w-4 mr-1" />
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="flex-1"
        disabled={false}
        on:click={handleEdit}
        type="button"
      >
        <Edit class="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="text-red-600 hover:text-red-700 hover:bg-red-50"
        disabled={false}
        on:click={handleDelete}
        type="button"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </div>

    <!-- Availability Indicator -->
    {#if venue.availability}
      <div class="mt-3 pt-3 border-t">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>Availability:</span>
          <div class="flex items-center gap-1">
            {#each Object.entries(venue.availability) as [day, schedule]}
              <div 
                class="w-2 h-2 rounded-full {schedule.available ? 'bg-green-400' : 'bg-red-400'}"
                title="{day}: {schedule.available ? `${schedule.start}-${schedule.end}` : 'Unavailable'}"
              ></div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
