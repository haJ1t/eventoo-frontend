<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    ArrowLeft,
    MapPin,
    Users,
    Share2,
    Heart,
    Star,
    DollarSign,
    CheckCircle2,
    Building,
    Wifi,
    Car,
    Coffee,
    Music,
    Camera,
    Shield,
    Calendar,
    Bell,
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { fade, fly, slide, scale } from "svelte/transition";
  import { venues } from "$lib/data/venues";

  // Venue ID from URL
  const venueId = $page.params.id;
  const venue = venues.find((v) => v.id === parseInt(venueId)) || venues[0];

  let isLiked = $state(false);
  let isBooked = $state(false);

  // Booking Form State
  let bookingDate = $state("");
  let bookingTimeStart = $state("");
  let bookingTimeEnd = $state("");
  let bookingGuests = $state("");

  function toggleLike() {
    isLiked = !isLiked;
  }

  function handleBooking() {
    isBooked = true;
    setTimeout(() => {
      isBooked = false; // Reset for demo
    }, 3000);
  }

  function shareVenue() {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: venue.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  function goBack() {
    goto("/venues");
  }

  function getAmenityIcon(amenityName: string) {
    const lower = amenityName.toLowerCase();
    if (lower.includes("wifi")) return Wifi;
    if (lower.includes("parking")) return Car;
    if (lower.includes("kitchen") || lower.includes("catering")) return Coffee;
    if (lower.includes("sound") || lower.includes("music")) return Music;
    if (lower.includes("lighting")) return Camera;
    if (lower.includes("security")) return Shield;
    return CheckCircle2;
  }

  const calculateTotal = $derived(() => {
    if (!bookingTimeStart || !bookingTimeEnd) return 0;
    const start = parseInt(bookingTimeStart.split(":")[0]);
    const end = parseInt(bookingTimeEnd.split(":")[0]);
    if (isNaN(start) || isNaN(end)) return 0;
    const duration = Math.max(0, end - start);
    return duration * venue.pricePerHour;
  });

  const durationHours = $derived(() => {
    if (!bookingTimeStart || !bookingTimeEnd) return 0;
    const start = parseInt(bookingTimeStart.split(":")[0]);
    const end = parseInt(bookingTimeEnd.split(":")[0]);
    if (isNaN(start) || isNaN(end)) return 0;
    return Math.max(0, end - start);
  });
</script>

<div class="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950 -mx-4 -mt-4">
  <!-- Immersive Hero Section -->
  <div
    class="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-900"
  >
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 md:bg-fixed"
      style="background-image: url('{venue.image}'); filter: brightness(0.4) blur(0px);"
    ></div>

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"
    ></div>

    <!-- Hero Content -->
    <div
      class="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 sm:px-8 lg:px-10"
    >
      <div in:fly={{ y: 30, duration: 800, delay: 100 }} class="max-w-4xl">
        <Button
          variant="outline"
          size="sm"
          onclick={goBack}
          disabled={false}
          class="mb-6 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Venues
        </Button>

        <div class="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="secondary"
            class="bg-blue-500/20 text-blue-100 backdrop-blur-md border-blue-500/20 hover:bg-blue-500/30"
            href="#"
          >
            {venue.type}
          </Badge>
          <Badge
            variant="outline"
            class="border-yellow-400/50 text-yellow-400 bg-yellow-400/10 backdrop-blur-md"
            href="#"
          >
            <Star class="mr-1 h-3 w-3 fill-current" />
            {venue.rating} ({venue.reviewCount} reviews)
          </Badge>
        </div>

        <h1
          class="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-tight"
        >
          {venue.name}
        </h1>

        <div class="mt-6 flex flex-wrap items-center gap-6 text-gray-300">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <MapPin class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{venue.location}</p>
              <p class="text-xs text-gray-400 max-w-[300px] truncate">
                {venue.address}
              </p>
            </div>
          </div>

          <div class="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div class="flex items-center gap-2.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <Users class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Capacity</p>
              <p class="text-xs text-gray-400">Up to {venue.capacity} guests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Layout -->
  <div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 relative z-30">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <!-- Left Column (Detail Content) -->
      <div class="lg:col-span-8 flex flex-col gap-8">
        <!-- About Section Card -->
        <div in:fly={{ y: 20, duration: 600, delay: 200 }}>
          <Card
            class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
          >
            <CardHeader class="pb-2">
              <CardTitle class="text-2xl font-bold flex items-center gap-2">
                About the Venue
              </CardTitle>
            </CardHeader>
            <CardContent class="">
              <p
                class="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {venue.description}
              </p>

              <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each venue.highlights as highlight}
                  <div
                    class="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
                  >
                    <div
                      class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <CheckCircle2 class="h-5 w-5" />
                    </div>
                    <span class="font-medium text-gray-700 dark:text-gray-200"
                      >{highlight}</span
                    >
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Amenities Section -->
        <div in:fly={{ y: 20, duration: 600, delay: 300 }}>
          <Card
            class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
          >
            <CardHeader class="">
              <CardTitle class="text-2xl font-bold flex items-center gap-2">
                <Building class="h-6 w-6 text-primary" />
                Amenities & Services
              </CardTitle>
            </CardHeader>
            <CardContent class="">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                {#each venue.amenities as amenity}
                  <div
                    class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors group"
                  >
                    <div
                      class="p-2 rounded-md bg-gray-100 text-gray-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors"
                    >
                      <svelte:component
                        this={getAmenityIcon(amenity)}
                        class="h-5 w-5"
                      />
                    </div>
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >{amenity}</span
                    >
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Gallery -->
        <div in:fly={{ y: 20, duration: 600, delay: 400 }}>
          <Card
            class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
          >
            <CardHeader class="">
              <CardTitle class="flex items-center gap-2">
                <Camera class="h-5 w-5 text-primary" />
                Gallery
              </CardTitle>
            </CardHeader>
            <CardContent class="">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each venue.images as img, i}
                  <div
                    class="group relative aspect-video overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={img}
                      alt="Venue view {i + 1}"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Right Column (Sticky Sidebar) -->
      <div class="lg:col-span-4 relative">
        <div class="sticky top-24 space-y-6">
          <!-- Booking Card -->
          <div in:fly={{ x: 20, duration: 600, delay: 500 }}>
            <Card
              class="overflow-hidden border-none shadow-2xl shadow-primary/5 dark:shadow-none ring-1 ring-gray-200 dark:ring-gray-800"
            >
              <div
                class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600"
              ></div>
              <CardHeader class="pb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Starting from
                    </p>
                    <div class="flex items-baseline gap-1">
                      <span
                        class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                      >
                        ${venue.pricePerHour}
                      </span>
                      <span class="text-gray-500">/hour</span>
                    </div>
                  </div>
                  <!-- Like Button -->
                  <Button
                    variant="ghost"
                    size="icon"
                    onclick={toggleLike}
                    disabled={false}
                    class="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 {isLiked
                      ? 'text-red-500'
                      : 'text-gray-400'}"
                  >
                    <Heart class="h-6 w-6 {isLiked ? 'fill-current' : ''}" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent class="space-y-6">
                <!-- Booking Form (Simplified) -->
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                      <label
                        class="text-xs font-semibold uppercase text-gray-500 mb-1 block"
                        >Date</label
                      >
                      <div class="relative">
                        <input
                          type="date"
                          bind:value={bookingDate}
                          class="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                        />
                        <Calendar
                          class="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        class="text-xs font-semibold uppercase text-gray-500 mb-1 block"
                        >Start</label
                      >
                      <input
                        type="time"
                        bind:value={bookingTimeStart}
                        class="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                      />
                    </div>
                    <div>
                      <label
                        class="text-xs font-semibold uppercase text-gray-500 mb-1 block"
                        >End</label
                      >
                      <input
                        type="time"
                        bind:value={bookingTimeEnd}
                        class="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                      />
                    </div>
                    <div class="col-span-2 space-y-1">
                      <label
                        class="text-xs font-semibold uppercase text-gray-500 mb-1 block"
                        >Guests</label
                      >
                      <input
                        type="number"
                        placeholder="Estimated guests"
                        bind:value={bookingGuests}
                        max={venue.capacity}
                        class="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <!-- Price Calculation -->
                {#if durationHours() > 0}
                  <div
                    class="rounded-lg bg-gray-50 p-4 space-y-2 dark:bg-gray-800"
                    in:slide
                  >
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Duration</span>
                      <span>{durationHours()} hours</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Rate</span>
                      <span>${venue.pricePerHour} / hr</span>
                    </div>
                    <Separator class="my-2" />
                    <div
                      class="flex justify-between font-bold text-gray-900 dark:text-gray-100"
                    >
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                {/if}

                <!-- Main Action -->
                <Button
                  onclick={handleBooking}
                  disabled={!bookingDate ||
                    !bookingTimeStart ||
                    !bookingTimeEnd}
                  class="w-full h-12 text-lg font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                >
                  {isBooked ? "Request Sent!" : "Request to Book"}
                </Button>

                {#if isBooked}
                  <div
                    class="flex items-center justify-center gap-2 text-sm text-green-600 font-medium"
                    in:slide
                  >
                    <CheckCircle2 class="h-4 w-4" />
                    We'll contact you shortly
                  </div>
                {/if}

                <Separator class="bg-gray-100 dark:bg-gray-800" />

                <!-- Secondary Actions -->
                <div class="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    class="w-full"
                    onclick={shareVenue}
                    disabled={false}
                  >
                    <Share2 class="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" class="w-full" disabled={false}>
                    <Building class="mr-2 h-4 w-4" />
                    Floor Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Quick Contact -->
          <div in:fly={{ x: 20, duration: 600, delay: 600 }}>
            <Card class="border-none shadow-sm">
              <CardContent class="p-6 text-center">
                <p class="text-sm text-gray-500 mb-3">
                  Questions about this venue?
                </p>
                <Button
                  variant="link"
                  class="p-0 h-auto text-primary"
                  disabled={false}
                >
                  Contact Venue Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
