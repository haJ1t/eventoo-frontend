<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  
  import { 
    Calendar, Users, DollarSign, TrendingUp, 
    BarChart3, Clock, Ticket, Camera, Plus,
    Eye, Star, Settings, Target, ChevronLeft, ChevronRight
  } from 'lucide-svelte';
  
  // Animasyonlu sayılar
  const eventCount = tweened(0, { 
    duration: 1000, 
    easing: cubicOut 
  });
  
  const participantCount = tweened(0, { 
    duration: 1200, 
    easing: cubicOut 
  });
  
  const revenueCount = tweened(0, { 
    duration: 1400, 
    easing: cubicOut 
  });
  
  const growthCount = tweened(0, { 
    duration: 1600, 
    easing: cubicOut 
  });
  
  // Sayfa yükleme animasyonu için
  let isLoaded = $state(false);
  
  // Component mount olduğunda animasyonları başlat
  onMount(() => {
    setTimeout(() => {
      isLoaded = true;
      eventCount.set(24);
      participantCount.set(1250);
      revenueCount.set(45000);
      growthCount.set(12.5);
    }, 300);
  });

  // Navigation fonksiyonları
  function navigateToCreateEvent() {
    goto('/events/add');
  }

  function navigateToManageUsers() {
    goto('/login');
  }

  function navigateToReports() {
    goto('/reports');
  }

  function navigateToSettings() {
    goto('/settings');
  }

  function navigateToAllEvents() {
    goto('/events');
  }
  
  // Dashboard verileri
  let upcomingEvents = [
    { id: 1, name: "Tech Conference 2024", date: "2024-09-15", participants: 250, status: "confirmed" },
    { id: 2, name: "Music Festival", date: "2024-09-22", participants: 500, status: "planning" },
    { id: 3, name: "Art Exhibition", date: "2024-09-30", participants: 150, status: "confirmed" }
  ];
  
  let recentActivities = [
    { action: "New event created", time: "2 mins ago", user: "John Doe" },
    { action: "Event updated", time: "5 mins ago", user: "Jane Smith" },
    { action: "Participant registered", time: "10 mins ago", user: "Mike Johnson" }
  ];

  // Calendar için
  let currentDate = new Date();
  let currentMonth = $state(currentDate.getMonth());
  let currentYear = $state(currentDate.getFullYear());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // User's events (liked or scheduled)
  let userEvents = [
    { id: 1, title: "Tech Conference 2024", date: "2025-09-15", time: "09:00", location: "Convention Center", type: "conference", isLiked: true, isScheduled: true },
    { id: 2, title: "Music Festival", date: "2025-09-22", time: "18:00", location: "Central Park", type: "festival", isLiked: true, isScheduled: false },
    { id: 3, title: "Art Exhibition Opening", date: "2025-09-30", time: "14:00", location: "Modern Art Gallery", type: "exhibition", isLiked: false, isScheduled: true },
    { id: 4, title: "Networking Meetup", date: "2025-09-10", time: "19:00", location: "Business Hub", type: "networking", isLiked: true, isScheduled: false },
    { id: 5, title: "AI Workshop Series", date: "2025-09-18", time: "10:00", location: "Tech Campus", type: "workshop", isLiked: false, isScheduled: true },
    { id: 6, title: "Food & Wine Tasting", date: "2025-09-11", time: "16:00", location: "Downtown Restaurant", type: "social", isLiked: true, isScheduled: true }
  ];
  
  // Selected date for viewing events
  let selectedDate = $state(null);
  
  // Get events for selected date
  const selectedDateEvents = $derived(() => {
    if (!selectedDate) return [];
    // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return userEvents.filter(event => event.date === dateStr);
  });
  
  // Function to select a date
  function selectDate(day) {
    const newDate = new Date(currentYear, currentMonth, day);
    selectedDate = selectedDate && selectedDate.getTime() === newDate.getTime() ? null : newDate;
  }
  
  // All user events for calendar display
  const filteredEvents = $derived(userEvents);
  
  // Calendar events - processed from filtered user events
  const calendarEvents = $derived(filteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();
    
    // Only show events for the current month/year being displayed
    if (eventMonth === currentMonth && eventYear === currentYear) {
      if (!acc[eventDay]) {
        acc[eventDay] = [];
      }
      acc[eventDay].push(event);
    }
    return acc;
  }, {}));
  
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }
  
  function previousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear = currentYear - 1;
    } else {
      currentMonth = currentMonth - 1;
    }
  }
  
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear = currentYear + 1;
    } else {
      currentMonth = currentMonth + 1;
    }
  }
  
  const daysInMonth = $derived(getDaysInMonth(currentMonth, currentYear));
  const firstDay = $derived(getFirstDayOfMonth(currentMonth, currentYear));
  const calendarDays = $derived(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const emptyDays = $derived(Array.from({ length: firstDay }, (_, i) => null));
</script>

<!-- Ana Container - Responsive Grid Layout -->
<div class="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-full">
  <!-- Sol Taraf - Ana İçerik (3 kolon) -->
  <div class="xl:col-span-3 space-y-6 w-full">
    <!-- Başlık Bölümü -->
    {#if isLoaded}
      <div class="flex justify-between items-center" in:fly={{ y: -20, duration: 600, delay: 100 }}>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>
        <!-- Create Event Butonu - /events/add -->
        <button 
          onclick={navigateToCreateEvent}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <Plus class="w-4 h-4" />
          Create Event
        </button>
      </div>
    {/if}

    <!-- Animasyonlu İstatistik Kartları -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#if isLoaded}
        <!-- Total Events Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-200" 
             in:fly={{ y: 20, duration: 600, delay: 200 }}>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Events</p>
              <p class="text-2xl font-bold text-gray-900">{Math.round($eventCount)}</p>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp class="w-3 h-3" />
                +2 this week
              </p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full transition-all duration-300 hover:bg-blue-200 hover:scale-110">
              <Calendar class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Total Participants Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:border-green-200" 
             in:fly={{ y: 20, duration: 600, delay: 300 }}>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Participants</p>
              <p class="text-2xl font-bold text-gray-900">{Math.round($participantCount).toLocaleString()}</p>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp class="w-3 h-3" />
                +15% from last month
              </p>
            </div>
            <div class="bg-green-100 p-3 rounded-full transition-all duration-300 hover:bg-green-200 hover:scale-110">
              <Users class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:border-yellow-200" 
             in:fly={{ y: 20, duration: 600, delay: 400 }}>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Revenue</p>
              <p class="text-2xl font-bold text-gray-900">${Math.round($revenueCount).toLocaleString()}</p>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp class="w-3 h-3" />
                +8% this month
              </p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full transition-all duration-300 hover:bg-yellow-200 hover:scale-110">
              <DollarSign class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <!-- Growth Rate Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:border-purple-200" 
             in:fly={{ y: 20, duration: 600, delay: 500 }}>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Growth Rate</p>
              <p class="text-2xl font-bold text-gray-900">{$growthCount.toFixed(1)}%</p>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Target class="w-3 h-3" />
                Above target
              </p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full transition-all duration-300 hover:bg-purple-200 hover:scale-110">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Alt Bölüm - İki Kolon -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#if isLoaded}
        <!-- Upcoming Events -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300" 
             in:fly={{ x: -20, duration: 600, delay: 600 }}>
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <button 
                onclick={navigateToAllEvents}
                class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                View All
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            {#each upcomingEvents as event, index}
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md" 
                   in:scale={{ duration: 400, delay: 700 + (index * 100) }}>
                <div class="flex items-center gap-3">
                  <div class="bg-blue-100 p-2 rounded-lg transition-all duration-300 hover:bg-blue-200">
                    <Calendar class="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{event.name}</h3>
                    <p class="text-sm text-gray-600">{event.date} • {event.participants} participants</p>
                  </div>
                </div>
                <span class="px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-110 {event.status === 'confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}">
                  {event.status}
                </span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300" 
             in:fly={{ x: 20, duration: 600, delay: 600 }}>
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div class="p-6 space-y-4">
            {#each recentActivities as activity, index}
              <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-[1.02]" 
                   in:fade={{ duration: 400, delay: 800 + (index * 100) }}>
                <div class="bg-blue-100 p-1.5 rounded-full mt-1 transition-all duration-300 hover:bg-blue-200">
                  <Clock class="w-3 h-3 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p class="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Quick Actions -->
    {#if isLoaded}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300" 
           in:fly={{ y: 20, duration: 600, delay: 1000 }}>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Create Event - Quick Action -->
          <button 
            onclick={navigateToCreateEvent}
            class="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
          >
            <Plus class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            <span class="text-sm font-medium text-blue-700">Create Event</span>
          </button>
          
          <!-- Manage Users -->
          <button 
            onclick={navigateToManageUsers}
            class="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
          >
            <Users class="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            <span class="text-sm font-medium text-green-700">Manage Users</span>
          </button>
          
          <!-- View Reports -->
          <button 
            onclick={navigateToReports}
            class="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
          >
            <BarChart3 class="w-6 h-6 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
            <span class="text-sm font-medium text-yellow-700">View Reports</span>
          </button>
          
          <!-- Settings -->
          <button 
            onclick={navigateToSettings}
            class="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
          >
            <Settings class="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            <span class="text-sm font-medium text-purple-700">Settings</span>
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Sağ Taraf - Calendar (1 kolon) - RESPONSIVE -->
  <div class="xl:col-span-1 w-full">
    <div class="space-y-6 w-full">
      {#if isLoaded}
        <!-- Calendar Widget -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full" 
             in:fly={{ x: 20, duration: 600, delay: 400 }}>
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <div class="flex gap-2">
              <button 
                onclick={previousMonth}
                class="p-2 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft class="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
              </button>
              <button 
                onclick={nextMonth}
                class="p-2 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight class="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
              </button>
            </div>
          </div>

          <!-- Days of Week -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            {#each daysOfWeek as day}
              <div class="text-xs font-medium text-gray-500 text-center py-2">
                {day}
              </div>
            {/each}
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            <!-- Empty days -->
            {#each emptyDays as _}
              <div class="h-8"></div>
            {/each}

            <!-- Calendar days -->
            {#each calendarDays as day}
              <div class="relative">
                <button 
                  onclick={() => selectDate(day)}
                  class="w-6 h-6 text-sm rounded transition-all duration-300 flex items-center justify-center font-medium relative
                    {day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-200' 
                      : selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg'
                        : calendarEvents[day] 
                          ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }
                  "
                >
                  {day}
                  
                  <!-- Event indicators -->
                  {#if calendarEvents[day]}
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {#if calendarEvents[day].some(event => event.isLiked)}
                        <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {/if}
                      {#if calendarEvents[day].some(event => event.isScheduled)}
                        <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {/if}
                    </div>
                  {/if}
                </button>
              </div>
            {/each}
          </div>

          <!-- Selected Date Events -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            {#if selectedDate}
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                
                {#if selectedDateEvents().length > 0}
                  <div class="space-y-3">
                    {#each selectedDateEvents() as event, index}
                      <div class="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300" 
                           in:fly={{ y: 20, duration: 400, delay: index * 100 }}>
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <h4 class="font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <div class="text-sm text-gray-600 space-y-1">
                              <div class="flex items-center gap-2">
                                <Clock class="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div class="flex items-center gap-2">
                                <Target class="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div class="flex items-center gap-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{event.type}</span>
                              </div>
                            </div>
                          </div>
                          <div class="flex flex-col gap-2 ml-4">
                            {#if event.isLiked}
                              <div class="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
                                <Star class="w-3 h-3 fill-current" />
                                <span>Liked</span>
                              </div>
                            {/if}
                            {#if event.isScheduled}
                              <div class="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                                <Calendar class="w-3 h-3" />
                                <span>Scheduled</span>
                              </div>
                            {/if}
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="text-center py-8">
                    <div class="text-gray-400 mb-2">
                      <Calendar class="w-12 h-12 mx-auto" />
                    </div>
                    <p class="text-gray-600">No events on this date</p>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="text-center py-8">
                <div class="text-gray-400 mb-2">
                  <Calendar class="w-12 h-12 mx-auto" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Date</h3>
                <p class="text-gray-600">Click on any date to view your liked or scheduled events</p>
                
                <!-- Legend -->
                <div class="mt-4 flex justify-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-gray-600">Liked Events</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-gray-600">Scheduled Events</span>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Mini Stats -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full" 
             in:fly={{ x: 20, duration: 600, delay: 500 }}>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg hover:from-green-100 transition-all duration-300">
              <span class="text-sm text-gray-600">Today's Events</span>
              <span class="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">3</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition-all duration-300">
              <span class="text-sm text-gray-600">This Week</span>
              <span class="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">8</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg hover:from-purple-100 transition-all duration-300">
              <span class="text-sm text-gray-600">This Month</span>
              <span class="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">24</span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
