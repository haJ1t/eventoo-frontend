<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { 
    MapPin, 
    Users, 
    Star, 
    Calendar, 
    MoreHorizontal,
    Eye,
    Edit,
    Trash2
  } from 'lucide-svelte';
  
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent } from '$lib/components/ui/card';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';

  export let venue: any;

  const dispatch = createEventDispatcher();

  function handleViewDetails() {
    dispatch('viewDetails', venue);
  }

  function handleEdit() {
    dispatch('edit', venue);
  }

  function handleDelete() {
    dispatch('delete', venue);
  }

  function getStatusColor(status: string) {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
</script>

<!-- Card with overflow-hidden and no default padding -->
<Card class="group hover:shadow-lg transition-all duration-200 overflow-hidden p-0">
  <!-- Image Container - No padding, directly at top -->
  <div class="relative">
    <div class="aspect-video w-full overflow-hidden">
      <button 
        type="button"
        class="w-full h-full p-0 border-0 bg-transparent cursor-pointer block"
        on:click={handleViewDetails}
      >
        <img 
          src={venue.image} 
          alt={venue.name}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </button>
    </div>
    
    <!-- Status Badge -->
    <div class="absolute top-3 left-3">
      <Badge class={getStatusColor(venue.status)} href="">
        {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
      </Badge>
    </div>

    <!-- Actions Menu -->
    <div class="absolute top-3 right-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            class="h-8 w-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            disabled={false}
          >
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48" portalProps={{}}>
          <DropdownMenuItem on:click={handleViewDetails} class="cursor-pointer" inset={false}>
            <Eye class="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem on:click={handleEdit} class="cursor-pointer" inset={false}>
            <Edit class="h-4 w-4 mr-2" />
            Edit Venue
          </DropdownMenuItem>
          <DropdownMenuSeparator class="" />
          <DropdownMenuItem on:click={handleDelete} class="cursor-pointer text-red-600" inset={false}>
            <Trash2 class="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>

  <!-- Content with explicit padding -->
  <div class="p-4 space-y-3">
    <!-- Header -->
    <button 
      type="button"
      class="w-full text-left space-y-1 p-0 border-0 bg-transparent cursor-pointer"
      on:click={handleViewDetails}
    >
      <h3 class="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
        {venue.name}
      </h3>
      <div class="flex items-center text-sm text-gray-600">
        <MapPin class="h-4 w-4 mr-1" />
        {venue.location}
      </div>
    </button>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 text-sm">
      <div class="flex items-center gap-1">
        <Users class="h-4 w-4 text-gray-500" />
        <span class="text-gray-700">{venue.capacity}</span>
      </div>
      <div class="flex items-center gap-1">
        <Star class="h-4 w-4 text-yellow-500" />
        <span class="text-gray-700">{venue.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <Calendar class="h-4 w-4 text-green-500" />
        <span class="text-gray-700">{venue.upcomingEvents}</span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 line-clamp-2">
      {venue.description}
    </p>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
      <div class="text-lg font-semibold text-gray-900">
        {formatPrice(venue.pricePerHour)}/hr
      </div>
      <Badge variant="secondary" class="bg-blue-100 text-blue-800" href="">
        {venue.type}
      </Badge>
    </div>
  </div>
</Card>
