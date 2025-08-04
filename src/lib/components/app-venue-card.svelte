<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { MapPin, Calendar, Users, Edit, Trash2, Eye } from "lucide-svelte";
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let venue: {
      id: string;
      name: string;
      location: string;
      capacity: number;
      image: string;
      type: string;
      status: 'active' | 'inactive';
      upcomingEvents: number;
      description?: string;
      amenities?: string[];
    };
  
    function handleEdit() {
      dispatch('edit', venue);
    }
  
    function handleDelete() {
      dispatch('delete', venue);
    }
  
    function handleView() {
      dispatch('view', venue);
    }
  </script>
  
  <!-- Custom card without using Card component -->
  <div class="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group h-full flex flex-col">
    <!-- Image Container - Tam üst kısım -->
    <div class="relative h-48 w-full overflow-hidden">
      <img
        src={venue.image}
        alt={venue.name}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        on:error={(e) => {
          e.target.src = `https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center&auto=format`;
        }}
      />
      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <Badge variant={venue.status === 'active' ? 'default' : 'secondary'} class="text-xs">
          {venue.status}
        </Badge>
      </div>
      <!-- View Button Overlay -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Button variant="secondary" size="sm" on:click={handleView} class="opacity-90">
          <Eye class="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
    
    <!-- Content kısmı -->
    <div class="flex flex-col flex-1 p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold truncate">{venue.name}</h3>
          <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin class="h-4 w-4 shrink-0" />
            <span class="truncate">{venue.location}</span>
          </div>
        </div>
        <Badge variant="outline" class="ml-2 shrink-0 text-xs">
          {venue.type}
        </Badge>
      </div>
      
      <!-- Content -->
      <div class="space-y-3 flex-1">
        <!-- Capacity and Events -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <Users class="h-4 w-4 text-muted-foreground" />
            <span>{venue.capacity.toLocaleString()} people</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <Calendar class="h-4 w-4" />
            <span>{venue.upcomingEvents} events</span>
          </div>
        </div>
        
        <!-- Description -->
        {#if venue.description}
          <p class="text-sm text-muted-foreground line-clamp-2">
            {venue.description}
          </p>
        {/if}
        
        <!-- Amenities -->
        {#if venue.amenities && venue.amenities.length > 0}
          <div class="flex flex-wrap gap-1">
            {#each venue.amenities.slice(0, 3) as amenity}
              <Badge variant="outline" class="text-xs px-2 py-0.5">
                {amenity}
              </Badge>
            {/each}
            {#if venue.amenities.length > 3}
              <Badge variant="outline" class="text-xs px-2 py-0.5 text-muted-foreground">
                +{venue.amenities.length - 3} more
              </Badge>
            {/if}
          </div>
        {/if}
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 pt-4 mt-auto">
        <Button variant="outline" size="sm" class="flex-1" on:click={handleEdit}>
          <Edit class="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          class="text-destructive hover:text-destructive hover:bg-destructive/10"
          on:click={handleDelete}
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
  
  <style>
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
  