<script lang="ts">
  import { createEventDispatcher } from 'svelte';
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

  export let isOpen = false;
  export let venue: any = null;

  const dispatch = createEventDispatcher();

  interface AvailabilityInfo {
    start: string;
    end: string;
    available: boolean;
  }

  function closeModal() {
    console.log('closeModal called'); // Debug
    isOpen = false;
    dispatch('close');
  }

  function handleEdit() {
    console.log('handleEdit called', venue); // Debug
    dispatch('edit', venue);
    closeModal();
  }

  function handleDelete() {
    console.log('handleDelete called', venue); // Debug
    dispatch('delete', venue);
    closeModal();
  }

  function handleViewFullDetails() {
    console.log('handleViewFullDetails called', venue); // Debug
    dispatch('viewFullDetails', venue);
  }

  function handleBackdropClick(event: MouseEvent) {
    console.log('Backdrop clicked'); // Debug
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    console.log('Key pressed:', event.key); // Debug
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
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

  // Debug: Log when modal opens
  $: if (isOpen) {
    console.log('Modal opened with venue:', venue);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen && venue}
  <!-- Modal Portal - Use button for backdrop -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    style="background-color: rgba(0, 0, 0, 0.5);"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
      on:click|stopPropagation
      role="document"
      transition:fly={{ y: 20, duration: 300 }}
    >
      <!-- Scrollable Content Container -->
      <div class="max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="modal-title" class="text-2xl font-bold text-gray-900">{venue.name}</h2>
            <div class="flex items-center gap-2 mt-1">
              <MapPin class="h-4 w-4 text-gray-500" />
              <span class="text-gray-600">{venue.location}</span>
              <Badge 
                href=""
                class={`ml-2 ${getStatusColor(venue.status)}`}
              >
                {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <!-- Close Button -->
          <button
            type="button"
            on:click={closeModal}
            class="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Image Gallery -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <img 
                src={venue.image} 
                alt={`Main image of ${venue.name}`}
                class="w-full h-64 object-cover rounded-lg"
              />
            </div>
            {#if venue.images && venue.images.length > 1}
              <div class="grid grid-cols-2 gap-2">
                {#each venue.images.slice(1, 5) as image, index}
                  <img 
                    src={image} 
                    alt={`${venue.name} image ${index + 2}`}
                    class="w-full h-24 object-cover rounded-lg"
                  />
                {/each}
              </div>
            {/if}
          </div>

          <!-- Key Information -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card class="">
              <CardContent class="p-4 text-center">
                <Users class="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div class="text-2xl font-bold">{venue.capacity}</div>
                <div class="text-sm text-gray-600">Capacity</div>
              </CardContent>
            </Card>

            <Card class="">
              <CardContent class="p-4 text-center">
                <Star class="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div class="text-2xl font-bold">{venue.rating}</div>
                <div class="text-sm text-gray-600">Rating</div>
              </CardContent>
            </Card>

            <Card class="">
              <CardContent class="p-4 text-center">
                <Calendar class="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div class="text-2xl font-bold">{venue.upcomingEvents}</div>
                <div class="text-sm text-gray-600">Upcoming</div>
              </CardContent>
            </Card>

            <Card class="">
              <CardContent class="p-4 text-center">
                <DollarSign class="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div class="text-2xl font-bold">{formatPrice(venue.pricePerHour)}</div>
                <div class="text-sm text-gray-600">Per Hour</div>
              </CardContent>
            </Card>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Description</h3>
            <p class="text-gray-700 leading-relaxed">{venue.description}</p>
          </div>

          <!-- Amenities -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Amenities</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each venue.amenities as amenity}
                <div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <svelte:component this={getAmenityIcon(amenity)} class="h-4 w-4 text-gray-600" />
                  <span class="text-sm text-gray-700">{amenity}</span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Availability -->
          {#if venue.availability}
            <div>
              <h3 class="text-lg font-semibold mb-3">Availability</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-700 mb-3">{getAvailabilityText(venue.availability)}</p>
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

          <!-- Tags -->
          {#if venue.tags && venue.tags.length > 0}
            <div>
              <h3 class="text-lg font-semibold mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                {#each venue.tags as tag}
                  <Badge 
                    variant="secondary" 
                    href=""
                    class="bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </Badge>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Statistics -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Statistics</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Total Bookings:</span>
                <span class="font-semibold ml-2">{venue.totalBookings}</span>
              </div>
              <div>
                <span class="text-gray-600">Venue Type:</span>
                <span class="font-semibold ml-2">{venue.type}</span>
              </div>
              <div>
                <span class="text-gray-600">Created:</span>
                <span class="font-semibold ml-2">{formatDate(venue.createdAt)}</span>
              </div>
              <div>
                <span class="text-gray-600">Last Updated:</span>
                <span class="font-semibold ml-2">{formatDate(venue.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              on:click={handleViewFullDetails}
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye class="h-4 w-4" />
              View Full Details
            </button>
            
            <button 
              type="button"
              on:click={handleEdit}
              class="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit class="h-4 w-4" />
              Edit Venue
            </button>
            
            <button 
              type="button"
              on:click={handleDelete}
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 class="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
