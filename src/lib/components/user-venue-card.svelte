<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    export let venue: any;
  
    function handleView() {
      console.log('View venue:', venue.name);
      dispatch('view', venue);
    }
  
    function handleBook() {
      console.log('Book venue:', venue.name);
      dispatch('book', venue);
    }
  </script>
  
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Image -->
    <div class="relative h-48 bg-gray-200">
      {#if venue.images && venue.images.length > 0}
        <img 
          src={venue.images[0]} 
          alt={venue.name}
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="w-full h-full flex items-center justify-center bg-gray-300">
          <span class="text-gray-500">No Image</span>
        </div>
      {/if}
      
      <!-- Status Badge -->
      <div class="absolute top-2 right-2">
        <span class="px-2 py-1 text-xs font-semibold rounded-full {
          venue.status === 'active' ? 'bg-green-100 text-green-800' :
          venue.status === 'inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }">
          {venue.status}
        </span>
      </div>
    </div>
  
    <!-- Content -->
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2 text-gray-900">{venue.name}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{venue.description}</p>
      
      <!-- Details -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {venue.location}
        </div>
        
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          Capacity: {venue.capacity} people
        </div>
        
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
          ${venue.pricePerHour}/hour
        </div>
      </div>
  
      <!-- Rating -->
      {#if venue.rating}
        <div class="flex items-center mb-4">
          <div class="flex items-center">
            {#each Array(5) as _, i}
              <svg class="w-4 h-4 {i < Math.floor(venue.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            {/each}
            <span class="ml-2 text-sm text-gray-600">{venue.rating} ({venue.totalBookings} bookings)</span>
          </div>
        </div>
      {/if}
  
      <!-- Amenities -->
      {#if venue.amenities && venue.amenities.length > 0}
        <div class="mb-4">
          <div class="flex flex-wrap gap-1">
            {#each venue.amenities.slice(0, 3) as amenity}
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {amenity}
              </span>
            {/each}
            {#if venue.amenities.length > 3}
              <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{venue.amenities.length - 3} more
              </span>
            {/if}
          </div>
        </div>
      {/if}
  
      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          on:click={handleView}
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        <button
          on:click={handleBook}
          class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
  