<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { 
    X, 
    MapPin, 
    Users, 
    Star, 
    Calendar, 
    Clock, 
    DollarSign,
    Wifi,
    Car,
    Coffee,
    Camera,
    Volume2,
    Utensils,
    Eye,
    Edit,
    Trash2
  } from 'lucide-svelte';
  
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Separator } from '$lib/components/ui/separator';

  export let open = false;
  export let venue: any = null;

  const dispatch = createEventDispatcher();

  interface AvailabilityInfo {
    start: string;
    end: string;
    available: boolean;
  }

  function closeModal() {
    open = false;
    dispatch('close');
  }

  function handleEdit() {
    dispatch('edit', venue);
    closeModal();
  }

  function handleDelete() {
    dispatch('delete', venue);
    closeModal();
  }

  function handleViewFullDetails() {
    if (venue) {
      closeModal(); // Close modal first
      goto(`/venues/${venue.id}`); // Then navigate using SvelteKit's goto
    }
  }

  function getAmenityIcon(amenity: string) {
    const iconMap: Record<string, any> = {
      'WiFi': Wifi,
      'Parking': Car,
      'Coffee Service': Coffee,
      'Coffee Station': Coffee,
      'Audio/Visual Equipment': Camera,
      'Sound System': Volume2,
      'Catering': Utensils,
      'Full Service Catering': Utensils,
      'Kitchen': Utensils,
      'Full Kitchen': Utensils
    };
    return iconMap[amenity] || Clock;
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getStatusColor(status: string) {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  function getAvailabilityText(availability: Record<string, AvailabilityInfo>) {
    const availableDays = Object.entries(availability)
      .filter(([day, info]) => info.available)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));
    
    if (availableDays.length === 0) return 'Not available';
    if (availableDays.length === 7) return 'Available daily';
    return `Available: ${availableDays.join(', ')}`;
  }
</script>

<Dialog bind:open>
  <DialogContent portalProps={{}} class="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
    {#if venue}
      <!-- Header with banner image -->
      <div class="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
        <img 
          src={venue.image} 
          alt={`Main image of ${venue.name}`}
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/20"></div>
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={closeModal}
          disabled={false}
        >
          <X class="h-4 w-4" />
        </Button>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <!-- Header section -->
        <div class="p-6 pb-4">
          <DialogHeader class="pb-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <DialogTitle class="text-2xl font-bold mb-2">{venue.name}</DialogTitle>
                <div class="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin class="h-4 w-4" />
                  <span>{venue.location}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Badge href="#" class={getStatusColor(venue.status)}>
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </Badge>
                  {#if venue.tags && venue.tags.length > 0}
                    {#each venue.tags.slice(0, 3) as tag}
                      <Badge href="#" variant="secondary" class="bg-blue-100 text-blue-800">
                        {tag}
                      </Badge>
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Separator class="my-4" />

        <!-- Key metrics -->
        <div class="p-6 py-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Users class="h-5 w-5 text-blue-600" />
              </div>
              <div class="text-2xl font-bold">{venue.capacity}</div>
              <div class="text-sm text-muted-foreground">Capacity</div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Star class="h-5 w-5 text-yellow-500" />
              </div>
              <div class="text-2xl font-bold">{venue.rating}</div>
              <div class="text-sm text-muted-foreground">Rating</div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Calendar class="h-5 w-5 text-green-600" />
              </div>
              <div class="text-2xl font-bold">{venue.upcomingEvents}</div>
              <div class="text-sm text-muted-foreground">Upcoming</div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <DollarSign class="h-5 w-5 text-purple-600" />
              </div>
              <div class="text-2xl font-bold">{formatPrice(venue.pricePerHour)}</div>
              <div class="text-sm text-muted-foreground">Per Hour</div>
            </div>
          </div>
        </div>

        <Separator class="my-4" />

        <!-- Description -->
        <div class="p-6 py-4">
          <h3 class="text-lg font-semibold mb-3">About this venue</h3>
          <p class="text-muted-foreground leading-relaxed">{venue.description}</p>
        </div>

        <Separator class="my-4" />

        <!-- Amenities -->
        <div class="p-6 py-4">
          <h3 class="text-lg font-semibold mb-3">Amenities</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each venue.amenities as amenity}
              <div class="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <svelte:component this={getAmenityIcon(amenity)} class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{amenity}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Availability -->
        {#if venue.availability}
          <Separator class="my-4" />
          <div class="p-6 py-4">
            <h3 class="text-lg font-semibold mb-3">Availability</h3>
            <div class="bg-muted/50 rounded-lg p-4">
              <p class="text-sm text-muted-foreground mb-3">{getAvailabilityText(venue.availability)}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {#each Object.entries(venue.availability) as [day, info]}
                  {@const availabilityInfo = info as AvailabilityInfo}
                  <div class="flex justify-between items-center py-1">
                    <span class="font-medium capitalize">{day}:</span>
                    <span class={availabilityInfo.available ? 'text-green-600' : 'text-red-600'}>
                      {availabilityInfo.available ? `${availabilityInfo.start} - ${availabilityInfo.end}` : 'Closed'}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Additional Images -->
        {#if venue.images && venue.images.length > 1}
          <Separator class="my-4" />
          <div class="p-6 py-4">
            <h3 class="text-lg font-semibold mb-3">Gallery</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              {#each venue.images.slice(1, 5) as image, index}
                <img 
                  src={image} 
                  alt={`${venue.name} image ${index + 2}`}
                  class="w-full h-24 object-cover rounded-lg"
                />
              {/each}
            </div>
          </div>
        {/if}

        <!-- Statistics -->
        <Separator class="my-4" />
        <div class="p-6 py-4">
          <h3 class="text-lg font-semibold mb-3">Details</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Total Bookings:</span>
              <span class="font-medium">{venue.totalBookings}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Venue Type:</span>
              <span class="font-medium">{venue.type}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Created:</span>
              <span class="font-medium">{formatDate(venue.createdAt)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Last Updated:</span>
              <span class="font-medium">{formatDate(venue.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer actions - moved outside scrollable area -->
      <div class="flex-shrink-0 border-t bg-background">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <Button 
              class="flex-1" 
              onClick={handleViewFullDetails}
              disabled={false}
            >
              <Eye class="h-4 w-4 mr-2" />
              View Full Details
            </Button>
            
            <Button 
              variant="outline" 
              class="flex-1" 
              onClick={handleEdit}
              disabled={false}
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit Venue
            </Button>
            
            <Button 
              variant="destructive" 
              class="flex-1" 
              onClick={handleDelete}
              disabled={false}
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </DialogContent>
</Dialog>
