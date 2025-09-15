<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Separator } from "$lib/components/ui/separator";
  import { 
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
    Trash2,
    Mail,
    Phone,
    Globe,
    Twitter,
    Instagram,
    Facebook,
    Linkedin
  } from 'lucide-svelte';

  export let open = false;
  export let venue: any = null;

  const dispatch = createEventDispatcher();

  interface AvailabilityInfo {
    start: string;
    end: string;
    available: boolean;
  }

  // User rating state
  let userRating = 0;
  let hoverRating = 0;
  let reviewText = '';
  let hasRated = false;

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
    if (venue && venue.id) {
      closeModal();
      setTimeout(() => {
        goto(`/venues/${venue.id}`);
      }, 100);
    }
  }

  // Rating functions
  function setRating(rating) {
    userRating = rating;
    hoverRating = 0;
  }

  function handleMouseEnter(rating) {
    hoverRating = rating;
  }

  function handleMouseLeave() {
    hoverRating = 0;
  }

  function submitRating() {
    if (userRating > 0 && reviewText.trim()) {
      hasRated = true;
      console.log(`User rated venue ${venue?.name} with ${userRating} stars and review: ${reviewText}`);
    }
  }

  function resetRating() {
    userRating = 0;
    hoverRating = 0;
    reviewText = '';
    hasRated = false;
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

  function getSocialIcon(platform) {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'website': return Globe;
      default: return Globe;
    }
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
  <DialogContent portalProps={{}} class="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
    {#if venue}
      <!-- Venue Header/Banner -->
      <div class="relative">
        <img 
          src={venue.image} 
          alt={venue.name}
          class="w-full h-64 object-cover rounded-t-lg"
        />
        
        {#if venue.featured}
          <div class="absolute top-4 left-4">
            <Badge href="#"
              variant="secondary"
              class="bg-amber-100 text-amber-800 border-amber-300"
            >
              <Star class="w-3 h-3 mr-1 inline" /> Featured Venue
            </Badge>
          </div>
        {/if}
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Header -->
        <DialogHeader class="space-y-2">
          <div class="flex items-center gap-2">
            <Badge href="#" variant="outline" class="text-xs">
              {venue.type}
            </Badge>
            <div class="flex items-center text-amber-600 text-sm">
              <Star class="w-4 h-4 mr-1 fill-amber-400 text-amber-400" />
              {venue.rating} / 5
            </div>
          </div>
          <DialogTitle class="text-3xl font-bold">{venue.name}</DialogTitle>
          <div class="flex items-center text-gray-600">
            <MapPin class="w-4 h-4 mr-1" />
            {venue.location}
          </div>
        </DialogHeader>

        <!-- Key Metrics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <Users class="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div class="text-2xl font-bold">{venue.capacity}</div>
            <div class="text-sm text-gray-600">Capacity</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar class="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div class="text-2xl font-bold">{venue.upcomingEvents}</div>
            <div class="text-sm text-gray-600">Upcoming</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <DollarSign class="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div class="text-2xl font-bold">{formatPrice(venue.pricePerHour)}</div>
            <div class="text-sm text-gray-600">Per Hour</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <Clock class="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div class="text-2xl font-bold">{venue.totalBookings}</div>
            <div class="text-sm text-gray-600">Total Bookings</div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">About</h3>
          <p class="text-muted-foreground leading-relaxed">
            {venue.description}
          </p>
        </div>

        <!-- Amenities -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Amenities</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each venue.amenities as amenity}
              <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <svelte:component this={getAmenityIcon(amenity)} class="w-4 h-4 text-gray-500" />
                <span class="text-sm">{amenity}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Contact & Social Media -->
        {#if venue.contact || venue.socialMedia}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact Info -->
            {#if venue.contact}
              <div class="space-y-3">
                <h3 class="text-lg font-semibold">Contact Information</h3>
                <div class="space-y-2">
                  {#if venue.contact.email}
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${venue.contact.email}`} class="text-primary hover:underline">
                        {venue.contact.email}
                      </a>
                    </div>
                  {/if}
                  {#if venue.contact.phone}
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-gray-500" />
                      <a href={`tel:${venue.contact.phone}`} class="hover:underline">
                        {venue.contact.phone}
                      </a>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Social Media -->
            {#if venue.socialMedia}
              <div class="space-y-3">
                <h3 class="text-lg font-semibold">Connect</h3>
                <div class="flex flex-wrap gap-3">
                  {#each Object.entries(venue.socialMedia) as [platform, handle]}
                    <a 
                      href={`https://${platform}.com/${handle}`} 
                      class="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <svelte:component this={getSocialIcon(platform)} class="w-4 h-4" />
                      <span class="text-sm">{handle}</span>
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Availability -->
        {#if venue.availability}
          <div class="space-y-3">
            <h3 class="text-lg font-semibold">Availability</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600 mb-3">{getAvailabilityText(venue.availability)}</p>
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

        <Separator class="my-6" />

        <!-- Rate This Venue -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Rate This Venue</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            {#if !hasRated}
              <p class="text-gray-600 mb-4">How would you rate this venue?</p>
              
              <!-- Star Rating -->
              <div class="mb-4">
                <div class="flex items-center gap-2 mb-2">
                  {#each Array(5) as _, i}
                    {@const starIndex = i + 1}
                    {@const isActive = (hoverRating > 0 ? starIndex <= hoverRating : starIndex <= userRating)}
                    <button
                      onclick={() => setRating(starIndex)}
                      onmouseenter={() => handleMouseEnter(starIndex)}
                      onmouseleave={handleMouseLeave}
                      class="transition-all hover:scale-110 transform"
                    >
                      <Star class="w-8 h-8 {isActive ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
                    </button>
                  {/each}
                  {#if (hoverRating > 0 ? hoverRating : userRating) > 0}
                    <span class="ml-2 text-lg font-medium text-gray-700">{hoverRating > 0 ? hoverRating : userRating} out of 5</span>
                  {/if}
                </div>
              </div>
              
              <!-- Review Text -->
              {#if userRating > 0}
                <div class="mb-4">
                  <label for="review-text" class="block text-sm font-medium text-gray-700 mb-2">
                    Write your review *
                  </label>
                  <textarea
                    id="review-text"
                    bind:value={reviewText}
                    placeholder="Share your experience with this venue..."
                    class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                  ></textarea>
                  {#if reviewText.trim().length < 10 && reviewText.length > 0}
                    <p class="text-sm text-red-500 mt-1">Review must be at least 10 characters long</p>
                  {/if}
                </div>
                
                <div class="flex gap-3">
                  <Button 
                    onclick={submitRating} 
                    class="" 
                    disabled={!reviewText.trim() || reviewText.trim().length < 10}
                  >
                    Submit Review
                  </Button>
                  <Button onclick={resetRating} variant="outline" class="" disabled={false}>
                    Clear
                  </Button>
                </div>
              {/if}
            {:else}
              <div class="text-center">
                <p class="text-green-600 font-medium mb-3">Thank you for your review!</p>
                <div class="flex justify-center items-center gap-2 mb-3">
                  <span class="text-gray-600">You rated:</span>
                  {#each Array(5) as _, i}
                    <Star class="w-6 h-6 {i < userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
                  {/each}
                  <span class="font-semibold text-lg">{userRating} out of 5</span>
                </div>
                <div class="bg-white p-4 rounded-lg border mb-4">
                  <p class="text-gray-700 italic">"{reviewText}"</p>
                </div>
                <Button onclick={resetRating} variant="outline" class="" disabled={false}>
                  Change Review
                </Button>
              </div>
            {/if}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t">
          <Button onclick={handleViewFullDetails} class="flex-1" disabled={false}>
            <Eye class="w-4 h-4 mr-2" />
            View Full Details
          </Button>
          <Button onclick={handleEdit} variant="outline" class="flex-1" disabled={false}>
            <Edit class="w-4 h-4 mr-2" />
            Edit Venue
          </Button>
          <Button onclick={handleDelete} variant="destructive" class="flex-1" disabled={false}>
            <Trash2 class="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    {/if}
  </DialogContent>
</Dialog>
