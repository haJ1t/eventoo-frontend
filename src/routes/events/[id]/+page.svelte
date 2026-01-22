<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Share2,
    Heart,
    Star,
    Clock,
    DollarSign,
    Tag,
    MessageCircle,
    User,
    ExternalLink,
    Download,
    Bell,
    CheckCircle2,
    Trophy,
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
  import { fade, fly, slide } from "svelte/transition";
  import { events } from "$lib/data/events";

  // Event ID from URL
  const eventId = $page.params.id;
  const event = events.find((e) => e.id === parseInt(eventId)) || events[0];

  let isLiked = $state(false);
  let isRegistered = $state(false);
  let showAllComments = $state(false);
  let newComment = $state("");
  let userRating = $state(0);

  function toggleLike() {
    isLiked = !isLiked;
  }

  function handleRegister() {
    isRegistered = !isRegistered;
  }

  function shareEvent() {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  function goBack() {
    goto("/events");
  }

  function submitComment() {
    if (newComment.trim()) {
      newComment = "";
      userRating = 0;
    }
  }
</script>

<div class="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950 -mx-4 -mt-4">
  <!-- Immersive Hero Section -->
  <div
    class="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-900"
  >
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 md:bg-fixed"
      style="background-image: url('{event.image}'); filter: brightness(0.4) blur(0px);"
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
          Back to Events
        </Button>

        <div class="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="secondary"
            class="bg-primary/20 text-primary-foreground backdrop-blur-md border-primary/20 hover:bg-primary/30 text-white"
            href="#"
          >
            {event.category}
          </Badge>
          {#if event.status === "Scheduled"}
            <Badge
              variant="outline"
              class="border-green-400/50 text-green-400 bg-green-400/10 backdrop-blur-md"
              href="#"
            >
              Open for Registration
            </Badge>
          {/if}
        </div>

        <h1
          class="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-tight"
        >
          {event.title}
        </h1>

        <div class="mt-6 flex flex-wrap items-center gap-6 text-gray-300">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <Calendar class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{event.date}</p>
              <p class="text-xs text-gray-400">{event.time}</p>
            </div>
          </div>

          <div class="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div class="flex items-center gap-2.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <MapPin class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{event.location}</p>
              <p class="text-xs text-gray-400 max-w-[200px] truncate">
                {event.address}
              </p>
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
                About the Event
              </CardTitle>
            </CardHeader>
            <CardContent class="">
              <p
                class="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {event.description}
              </p>

              <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each event.highlights as highlight}
                  <div
                    class="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
                  >
                    <div
                      class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
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

        <!-- Agenda Section -->
        <div in:fly={{ y: 20, duration: 600, delay: 300 }}>
          <Card
            class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
          >
            <CardHeader class="">
              <CardTitle class="text-2xl font-bold flex items-center gap-2">
                <Clock class="h-6 w-6 text-primary" />
                Event Schedule
              </CardTitle>
              <CardDescription class=""
                >A detailed look at what's happening throughout the day.</CardDescription
              >
            </CardHeader>
            <CardContent class="">
              {#if event.agenda && event.agenda.length > 0}
                <div
                  class="space-y-6 relative ml-3 before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800"
                >
                  {#each event.agenda as item, index}
                    <div class="relative flex gap-6">
                      <div class="flex-shrink-0">
                        <div
                          class="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary text-primary-foreground shadow-sm dark:border-gray-900"
                        >
                          <span class="text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div
                        class="flex-1 rounded-2xl bg-gray-50 p-5 transition-all hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                      >
                        <div class="mb-1 flex items-center justify-between">
                          <span
                            class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {item.time}
                          </span>
                        </div>
                        <h4
                          class="text-lg font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {item.title}
                        </h4>
                        {#if index === 1}
                          <p
                            class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Join us for an inspiring opening keynote where we
                            discuss the future of the industry.
                          </p>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div
                  class="flex flex-col items-center justify-center py-10 text-center text-gray-500"
                >
                  <Calendar class="mb-3 h-10 w-10 opacity-20" />
                  <p>Agenda details coming soon.</p>
                </div>
              {/if}
            </CardContent>
          </Card>
        </div>

        <!-- Gallery / Speakers Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Speakers -->
          <div in:fly={{ y: 20, duration: 600, delay: 400 }}>
            <Card
              class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden h-full"
            >
              <CardHeader class="">
                <CardTitle class="flex items-center gap-2">
                  <Users class="h-5 w-5 text-primary" />
                  Speakers
                </CardTitle>
              </CardHeader>
              <CardContent class="">
                <div class="space-y-4">
                  {#each event.speakers as speaker}
                    <div
                      class="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        class="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                      />
                      <div>
                        <h4
                          class="font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {speaker.name}
                        </h4>
                        <p class="text-sm text-primary">{speaker.title}</p>
                        <p class="text-xs text-gray-500">{speaker.company}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Location / Map Placeholder -->
          <div in:fly={{ y: 20, duration: 600, delay: 400 }}>
            <Card
              class="border-none shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden h-full flex flex-col"
            >
              <CardHeader class="">
                <CardTitle class="flex items-center gap-2">
                  <MapPin class="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent class="flex-1 min-h-[200px] relative p-0">
                <!-- Map Placeholder -->
                <div
                  class="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <div class="text-center p-6">
                    <div
                      class="bg-white dark:bg-gray-700 p-4 rounded-full shadow-lg inline-flex mb-3"
                    >
                      <MapPin class="h-8 w-8 text-primary" />
                    </div>
                    <p class="font-medium text-gray-900 dark:text-gray-100">
                      {event.location}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.address}
                    </p>
                    <Button
                      variant="link"
                      class="mt-2 text-primary p-0 h-auto"
                      disabled={false}>View on Google Maps</Button
                    >
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-purple-600"
              ></div>
              <CardHeader class="pb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Total Price
                    </p>
                    <div class="flex items-baseline gap-2">
                      <span
                        class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                      >
                        {event.price}
                      </span>
                      {#if event.originalPrice}
                        <span
                          class="text-lg text-gray-400 line-through Decoration-gray-400"
                          >{event.originalPrice}</span
                        >
                      {/if}
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
                <!-- Progress Bar -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-medium text-gray-700 dark:text-gray-300"
                      >Seats Available</span
                    >
                    <span class="text-primary font-bold"
                      >{event.maxAttendees - parseInt(event.attendees)} left</span
                    >
                  </div>
                  <div
                    class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-1000"
                      style="width: {(parseInt(event.attendees) /
                        event.maxAttendees) *
                        100}%"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 text-right">
                    {event.attendees} already joined
                  </p>
                </div>

                <!-- Main Action -->
                <Button
                  onclick={handleRegister}
                  disabled={false}
                  class="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                >
                  {isRegistered ? "You are Registered!" : "Book Your Spot"}
                </Button>

                {#if isRegistered}
                  <div
                    class="flex items-center justify-center gap-2 text-sm text-green-600 font-medium"
                    in:slide
                  >
                    <CheckCircle2 class="h-4 w-4" />
                    Confirmation sent to your email
                  </div>
                {/if}

                <Separator class="bg-gray-100 dark:bg-gray-800" />

                <!-- Secondary Actions -->
                <div class="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    class="w-full"
                    onclick={shareEvent}
                    disabled={false}
                  >
                    <Share2 class="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" class="w-full" disabled={false}>
                    <Bell class="mr-2 h-4 w-4" />
                    Remind
                  </Button>
                </div>

                <p class="text-center text-xs text-gray-400">
                  No-hassle refunds up to 24h before the event.
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- Organizer Card -->
          <div in:fly={{ x: 20, duration: 600, delay: 600 }}>
            <Card
              class="border-none shadow-lg dark:shadow-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
            >
              <CardContent class="p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div
                    class="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-0.5"
                  >
                    <div
                      class="h-full w-full rounded-full bg-white dark:bg-gray-900 border-2 border-transparent flex items-center justify-center overflow-hidden"
                    >
                      <span
                        class="text-lg font-bold text-gray-700 dark:text-gray-200"
                        >{event.organizer.charAt(0)}</span
                      >
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-gray-100">
                      {event.organizer}
                    </h4>
                    <div class="flex items-center text-xs text-gray-500 mt-0.5">
                      <Star
                        class="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500"
                      />
                      <span>{event.rating} ({event.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  class="w-full"
                  disabled={false}
                >
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
