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
  let isLoaded = false;
  
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
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calendar events
  let calendarEvents = {
    15: { title: "Tech Conference", type: "conference" },
    22: { title: "Music Festival", type: "festival" },
    30: { title: "Art Exhibition", type: "exhibition" }
  };
  
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
  
  $: daysInMonth = getDaysInMonth(currentMonth, currentYear);
  $: firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  $: calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  $: emptyDays = Array.from({ length: firstDay }, (_, i) => null);
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

  <!-- Sağ Taraf - STICKY Calendar (1 kolon) - RESPONSIVE -->
  <div class="xl:col-span-1 w-full">
    <!-- STICKY CONTAINER - SIDEBAR'A UYUMLU -->
    <div class="sticky top-6 space-y-6 w-full">
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
                <button class="w-8 h-8 text-sm rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center transform hover:scale-110
                  {day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-blue-600'
                  }
                  {calendarEvents[day] ? 'font-bold ring-2 ring-blue-200' : ''}
                ">
                  {day}
                </button>
                
                <!-- Event indicator -->
                {#if calendarEvents[day]}
                  <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Event List for Selected Month -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <h3 class="text-sm font-medium text-gray-900 mb-3">This Month's Events</h3>
            <div class="space-y-2">
              {#each Object.entries(calendarEvents) as [day, event], index}
                <div class="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition-all duration-300 transform hover:scale-[1.02]" 
                     in:scale={{ duration: 400, delay: 600 + (index * 100) }}>
                  <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-900">{event.title}</p>
                    <p class="text-xs text-gray-600">{months[currentMonth]} {day}</p>
                  </div>
                </div>
              {/each}
            </div>
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
