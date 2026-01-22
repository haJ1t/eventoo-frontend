<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade, fly, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import {
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    BarChart3,
    MapPin,
    Bell,
    Plus,
    Target,
    ChevronLeft,
    ChevronRight,
    Settings,
  } from "lucide-svelte";

  import ResourceCard from "$lib/components/shared/ResourceCard.svelte";
  import ResourceModal from "$lib/components/shared/ResourceModal.svelte";

  // Animasyonlu sayılar
  const eventCount = tweened(0, { duration: 1000, easing: cubicOut });
  const participantCount = tweened(0, { duration: 1200, easing: cubicOut });
  const revenueCount = tweened(0, { duration: 1400, easing: cubicOut });
  const growthCount = tweened(0, { duration: 1600, easing: cubicOut });

  let isLoaded = $state(false);
  let showModal = $state(false);
  let selectedEvent = $state(null);

  onMount(() => {
    setTimeout(() => {
      isLoaded = true;
      eventCount.set(24);
      participantCount.set(1250);
      revenueCount.set(45000);
      growthCount.set(12.5);
    }, 300);
  });

  const upcomingEvents = [
    {
      id: 1,
      name: "Tech Conference 2024",
      date: "2024-09-15",
      location: "San Francisco, CA",
      status: "Scheduled",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      description: "Join us for the biggest tech conference of the year.",
      price: "$299",
      category: "Technology",
      attendees: 500,
      tags: ["Tech", "Conference"],
    },
    {
      id: 2,
      name: "Music Festival",
      date: "2024-09-22",
      location: "New York, NY",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1459749411177-05be25b15f35?w=800",
      description: "Three days of amazing music and food.",
      price: "$199",
      category: "Music",
      attendees: 1000,
      tags: ["Music", "Festival"],
    },
    {
      id: 3,
      name: "Art Exhibition",
      date: "2024-09-30",
      location: "London, UK",
      status: "Confirmed",
      image:
        "https://images.unsplash.com/photo-1460661631562-b628fff2758f?w=800",
      description: "Contemporary art from local artists.",
      price: "$99",
      category: "Art",
      attendees: 150,
      tags: ["Art", "Exhibition"],
    },
  ];

  function handleViewDetails(event) {
    selectedEvent = event;
    showModal = true;
  }

  // Calendar Logic
  let selectedDate = $state(null);
  let currentDate = new Date();
  let currentMonth = $state(currentDate.getMonth());
  let currentYear = $state(currentDate.getFullYear());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }
  function previousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }

  function hasEvent(day, month, year) {
    const checkDate = new Date(year, month, day);
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
    return upcomingEvents.some((e) => e.date === dateStr);
  }

  function selectDate(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
  }

  const daysInMonth = $derived(getDaysInMonth(currentMonth, currentYear));
  const firstDay = $derived(getFirstDayOfMonth(currentMonth, currentYear));
  const calendarDays = $derived(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
  );
  const emptyDays = $derived(Array.from({ length: firstDay }, (_, i) => null));
</script>

<div class="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-full p-6">
  <!-- Left Side: Main Dashboard -->
  <div class="xl:col-span-3 space-y-8">
    <!-- Welcome Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      in:fly={{ y: -20, duration: 600 }}
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p class="text-gray-500 mt-1">
          Overview of your events and performance.
        </p>
      </div>
      <button
        class="bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        onclick={() => goto("/events/add")}
      >
        <Plus class="w-4 h-4" />
        Create New Event
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Events -->
      <div
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        in:fly={{ y: 20, delay: 100 }}
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"
          >
            <Calendar class="w-6 h-6" />
          </div>
          <span
            class="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
          >
            <TrendingUp class="w-3 h-3 mr-1" /> +12%
          </span>
        </div>
        <div>
          <span class="text-gray-500 text-sm font-medium">Total Events</span>
          <h3 class="text-3xl font-bold text-gray-900 mt-1">
            {Math.round($eventCount)}
          </h3>
        </div>
      </div>

      <!-- Participants -->
      <div
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        in:fly={{ y: 20, delay: 200 }}
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"
          >
            <Users class="w-6 h-6" />
          </div>
          <span
            class="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
          >
            <TrendingUp class="w-3 h-3 mr-1" /> +5%
          </span>
        </div>
        <div>
          <span class="text-gray-500 text-sm font-medium">Participants</span>
          <h3 class="text-3xl font-bold text-gray-900 mt-1">
            {Math.round($participantCount)}
          </h3>
        </div>
      </div>

      <!-- Revenue -->
      <div
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        in:fly={{ y: 20, delay: 300 }}
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors"
          >
            <DollarSign class="w-6 h-6" />
          </div>
          <span
            class="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
          >
            <TrendingUp class="w-3 h-3 mr-1" /> +8%
          </span>
        </div>
        <div>
          <span class="text-gray-500 text-sm font-medium">Revenue</span>
          <h3 class="text-3xl font-bold text-gray-900 mt-1">
            ${Math.round($revenueCount).toLocaleString()}
          </h3>
        </div>
      </div>

      <!-- Growth -->
      <div
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        in:fly={{ y: 20, delay: 400 }}
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors"
          >
            <Target class="w-6 h-6" />
          </div>
          <span
            class="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
          >
            <TrendingUp class="w-3 h-3 mr-1" /> +2.5%
          </span>
        </div>
        <div>
          <span class="text-gray-500 text-sm font-medium">Growth</span>
          <h3 class="text-3xl font-bold text-gray-900 mt-1">
            {$growthCount.toFixed(1)}%
          </h3>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Section -->
    <div in:fly={{ y: 20, delay: 500 }}>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">Upcoming Events</h2>
        <button
          onclick={() => goto("/events")}
          class="text-sm font-medium text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all"
        >
          View All
        </button>
      </div>

      <!-- Unified Resource Cards Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each upcomingEvents as event}
          <div class="h-full">
            <ResourceCard
              image={event.image}
              title={event.name}
              status={event.status}
              subtitle={event.location}
              description={event.description}
              price={event.price}
              type={event.category}
              stats={[
                { icon: Calendar, value: event.date },
                { icon: Users, value: event.attendees },
              ]}
              onView={() => handleViewDetails(event)}
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Recent Activity Timeline -->
  </div>

  <!-- Right Side: Calendar & Quick Actions -->
  <div class="xl:col-span-1 space-y-8">
    <!-- Calendar Widget -->
    <div
      class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
      in:fly={{ x: 20, delay: 400 }}
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-gray-900 text-lg">
          {months[currentMonth]}
          {currentYear}
        </h3>
        <div class="flex gap-1">
          <button
            onclick={previousMonth}
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
            ><ChevronLeft class="w-5 h-5" /></button
          >
          <button
            onclick={nextMonth}
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
            ><ChevronRight class="w-5 h-5" /></button
          >
        </div>
      </div>

      <div class="grid grid-cols-7 text-center mb-2">
        {#each daysOfWeek as day}
          <div class="text-xs font-semibold text-gray-400 py-1">{day}</div>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 text-center">
        {#each emptyDays as _}<div></div>{/each}
        {#each calendarDays as day}
          {@const isToday =
            day === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear()}
          {@const isSelected =
            selectedDate &&
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()}
          {@const eventExists = hasEvent(day, currentMonth, currentYear)}

          <button
            onclick={() => selectDate(day)}
            class="h-9 w-9 text-sm rounded-full flex flex-col items-center justify-center transition-all relative
                  {isToday
              ? 'bg-black text-white font-bold shadow-md'
              : isSelected
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-gray-700 hover:bg-gray-100 font-medium'}"
          >
            <span>{day}</span>
            {#if eventExists}
              <span
                class="absolute bottom-1 w-1 h-1 rounded-full {isToday ||
                isSelected
                  ? 'bg-white'
                  : 'bg-blue-500'}"
              ></span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Upcoming</span>
          <span
            class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold"
            >3 Events</span
          >
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div
      class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      in:fly={{ x: 20, delay: 500 }}
    >
      <h3 class="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          onclick={() => goto("/events/add")}
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-left transition-all group"
        >
          <Plus
            class="w-6 h-6 mb-2 text-blue-600 group-hover:scale-110 transition-transform"
          />
          <span class="text-sm font-medium block text-gray-900"
            >Create Event</span
          >
        </button>
        <button
          onclick={() => goto("/users")}
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-left transition-all group"
        >
          <Users
            class="w-6 h-6 mb-2 text-green-600 group-hover:scale-110 transition-transform"
          />
          <span class="text-sm font-medium block text-gray-900"
            >Manage Users</span
          >
        </button>
        <button
          onclick={() => goto("/reports")}
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-left transition-all group"
        >
          <BarChart3
            class="w-6 h-6 mb-2 text-amber-500 group-hover:scale-110 transition-transform"
          />
          <span class="text-sm font-medium block text-gray-900"
            >View Reports</span
          >
        </button>
        <button
          onclick={() => goto("/settings")}
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-left transition-all group"
        >
          <Settings
            class="w-6 h-6 mb-2 text-purple-600 group-hover:scale-110 transition-transform"
          />
          <span class="text-sm font-medium block text-gray-900">Settings</span>
        </button>
      </div>
    </div>
  </div>
</div>

{#if showModal && selectedEvent}
  <ResourceModal
    bind:open={showModal}
    title={selectedEvent.name}
    image={selectedEvent.image}
    location={selectedEvent.location}
    tags={selectedEvent.tags}
    description={selectedEvent.description}
    primaryActionLabel="Register Now"
    onPrimaryAction={() => console.log("Register")}
  >
    <div slot="metrics" class="grid grid-cols-2 gap-4">
      <div class="flex items-center gap-2">
        <Calendar class="w-4 h-4 text-gray-500" />
        <span>{selectedEvent.date}</span>
      </div>
      <div class="flex items-center gap-2">
        <Users class="w-4 h-4 text-gray-500" />
        <span>{selectedEvent.attendees}</span>
      </div>
    </div>
  </ResourceModal>
{/if}
