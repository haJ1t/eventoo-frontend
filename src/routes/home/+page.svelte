<script lang="ts">
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
    TrendingDown,
    BarChart3,
    MapPin,
    Bell,
    Plus,
    Target,
    ChevronLeft,
    ChevronRight,
    Settings,
    LogOut,
  } from "lucide-svelte";

  import ResourceCard from "$lib/components/shared/ResourceCard.svelte";
  import ResourceModal from "$lib/components/shared/ResourceModal.svelte";

  import {
    fetchDashboardSummary,
    type DashboardStats,
  } from "$lib/services/api";
  import { logout } from "$lib/services/api";

  // Animasyonlu sayılar
  const eventCount = tweened(0, { duration: 1000, easing: cubicOut });
  const participantCount = tweened(0, { duration: 1200, easing: cubicOut });
  const revenueCount = tweened(0, { duration: 1400, easing: cubicOut });
  const growthCount = tweened(0, { duration: 1600, easing: cubicOut });

  type UpcomingEvent = {
    id: number;
    name: string;
    date: string;
    dateLabel: string;
    location: string;
    status: string;
    image: string;
    description: string;
    price: number;
    category: string;
    attendees: string;
    tags: string[];
  };

  let showModal = $state(false);
  let selectedEvent = $state<UpcomingEvent | null>(null);
  let upcomingEvents = $state<UpcomingEvent[]>([]);
  let calendarEvents = $state<UpcomingEvent[]>([]);
  let dashboardStats = $state<DashboardStats>({
    total_events: 0,
    participants: 0,
    revenue: 0,
    growth: 0,
    event_change: 0,
    participant_change: 0,
    revenue_change: 0,
  });

  onMount(async () => {
    try {
      const summary = await fetchDashboardSummary();
      dashboardStats = summary.stats;

      eventCount.set(summary.stats.total_events || 0);
      participantCount.set(summary.stats.participants || 0);
      revenueCount.set(summary.stats.revenue || 0);
      growthCount.set(summary.stats.growth || 0);

      calendarEvents = summary.events.map((e) => ({
        id: e.id,
        name: e.title,
        date: e.date,
        dateLabel: e.date_label,
        location: e.location,
        status: e.status,
        image: e.image || "",
        description: e.description || "",
        price: e.price,
        category: e.category,
        attendees: e.attendees,
        tags: e.tags || [],
      }));

      upcomingEvents = calendarEvents.slice(0, 4);
    } catch (e) {
      console.error("Failed to load dashboard summary", e);
    }
  });

  function handleViewDetails(event) {
    selectedEvent = event;
    showModal = true;
  }

  async function handleLogout() {
    await logout();
    goto("/login");
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

  function formatDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function hasEvent(day, month, year) {
    const checkDate = new Date(year, month, day);
    const dateStr = formatDateKey(checkDate);
    return calendarEvents.some((e) => e.date === dateStr);
  }

  function selectDate(day) {
    const next = new Date(currentYear, currentMonth, day);
    if (selectedDate && formatDateKey(selectedDate) === formatDateKey(next)) {
      selectedDate = null;
      return;
    }
    selectedDate = next;
  }

  const daysInMonth = $derived(getDaysInMonth(currentMonth, currentYear));
  const firstDay = $derived(getFirstDayOfMonth(currentMonth, currentYear));
  const calendarDays = $derived(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
  );
  const emptyDays = $derived(Array.from({ length: firstDay }, (_, i) => null));

  const selectedDateKey = $derived.by(() =>
    selectedDate ? formatDateKey(selectedDate) : null,
  );
  const selectedDateLabel = $derived.by(() =>
    selectedDate
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(selectedDate)
      : "",
  );
  const selectedDayEvents = $derived.by(() =>
    selectedDateKey
      ? calendarEvents.filter((e) => e.date === selectedDateKey)
      : [],
  );
  const displayEvents = $derived.by(() =>
    selectedDateKey ? selectedDayEvents : upcomingEvents,
  );
</script>

<div class="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-full page-pad">
  <!-- Left Side: Main Dashboard -->
  <div class="xl:col-span-3 space-y-8">
    <!-- Welcome Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      in:fly={{ y: -20, duration: 600 }}
    >
      <div class="flex items-start gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
        >
          <BarChart3 class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p class="text-gray-500 mt-1">
            Overview of your events and performance.
          </p>
        </div>
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
            class="flex items-center text-xs font-medium px-2 py-1 rounded-full {dashboardStats.event_change >=
            0
              ? 'text-green-600 bg-green-50'
              : 'text-rose-600 bg-rose-50'}"
          >
            {#if dashboardStats.event_change >= 0}
              <TrendingUp class="w-3 h-3 mr-1" />
            {:else}
              <TrendingDown class="w-3 h-3 mr-1" />
            {/if}
            {Math.abs(dashboardStats.event_change).toFixed(1)}%
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
            class="flex items-center text-xs font-medium px-2 py-1 rounded-full {dashboardStats.participant_change >=
            0
              ? 'text-green-600 bg-green-50'
              : 'text-rose-600 bg-rose-50'}"
          >
            {#if dashboardStats.participant_change >= 0}
              <TrendingUp class="w-3 h-3 mr-1" />
            {:else}
              <TrendingDown class="w-3 h-3 mr-1" />
            {/if}
            {Math.abs(dashboardStats.participant_change).toFixed(1)}%
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
            class="flex items-center text-xs font-medium px-2 py-1 rounded-full {dashboardStats.revenue_change >=
            0
              ? 'text-green-600 bg-green-50'
              : 'text-rose-600 bg-rose-50'}"
          >
            {#if dashboardStats.revenue_change >= 0}
              <TrendingUp class="w-3 h-3 mr-1" />
            {:else}
              <TrendingDown class="w-3 h-3 mr-1" />
            {/if}
            {Math.abs(dashboardStats.revenue_change).toFixed(1)}%
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
            class="flex items-center text-xs font-medium px-2 py-1 rounded-full {dashboardStats.growth >=
            0
              ? 'text-green-600 bg-green-50'
              : 'text-rose-600 bg-rose-50'}"
          >
            {#if dashboardStats.growth >= 0}
              <TrendingUp class="w-3 h-3 mr-1" />
            {:else}
              <TrendingDown class="w-3 h-3 mr-1" />
            {/if}
            {Math.abs(dashboardStats.growth).toFixed(1)}%
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
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {#if selectedDateKey}
              Events on {selectedDateLabel}
            {:else}
              Upcoming Events
            {/if}
          </h2>
          {#if selectedDateKey}
            <p class="text-sm text-gray-500">
              {selectedDayEvents.length} event{selectedDayEvents.length === 1
                ? ""
                : "s"} scheduled
            </p>
          {/if}
        </div>
        {#if selectedDateKey}
          <button
            onclick={() => (selectedDate = null)}
            class="text-sm font-medium text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all"
          >
            Clear Selection
          </button>
        {:else}
          <button
            onclick={() => goto("/events")}
            class="text-sm font-medium text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all"
          >
            View All
          </button>
        {/if}
      </div>

      <!-- Unified Resource Cards Grid -->
      {#if displayEvents.length === 0}
        <div
          class="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center text-sm text-gray-500"
        >
          No events scheduled for this day.
        </div>
      {:else}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each displayEvents as event}
            <div class="h-full">
              <ResourceCard
                compact={true}
                image={event.image}
                title={event.name}
                status={event.status}
                subtitle={event.location}
                description={event.description}
                price={event.price}
                type={event.category}
                stats={[
                  { icon: Calendar, value: event.dateLabel },
                  { icon: Users, value: event.attendees },
                ]}
                onView={() => handleViewDetails(event)}
              />
            </div>
          {/each}
        </div>
      {/if}
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
        <button
          onclick={handleLogout}
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-left transition-all group"
        >
          <LogOut
            class="w-6 h-6 mb-2 text-red-600 group-hover:scale-110 transition-transform"
          />
          <span class="text-sm font-medium block text-gray-900">Log Out</span>
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
        <span>{selectedEvent.dateLabel}</span>
      </div>
      <div class="flex items-center gap-2">
        <Users class="w-4 h-4 text-gray-500" />
        <span>{selectedEvent.attendees}</span>
      </div>
    </div>
  </ResourceModal>
{/if}
