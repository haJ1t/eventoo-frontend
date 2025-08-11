<script>
    /* UI components */
    import { Button } from '$lib/components/ui/button';
    import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
    import { Badge } from '$lib/components/ui/badge';
    /* Icons */
    import { Calendar as CalendarIcon, Clock, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-svelte';
  
    /* -------- Your events (same names/images; DATES UPDATED to 2025) -------- */
    const events = [
      {
        id: 1,
        title: "Tech Conference 2024",
        date: "August 11, 2025",   // TODAY (so “Today” filter shows something)
        location: "Grand Ballroom",
        attendees: "500 Attendees",
        status: "Scheduled",
        image: "/images/eventImages/tech.jpg",
        description: "Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities.",
        organizer: "Tech Events Inc.",
        price: "$299",
        category: "Technology",
        tags: ["Technology", "Conference", "Networking"]
      },
      {
        id: 2,
        title: "Summer Music Festival",
        date: "August 20, 2025",   // within next 7 days (from Aug 11, 2025)
        location: "Central Park",
        attendees: "10000 Attendees",
        status: "Scheduled",
        image: "/images/eventImages/music.jpeg",
        description: "Three days of amazing music, food, and entertainment in the heart of the city.",
        organizer: "Music Events Co.",
        price: "$199",
        category: "Music",
        tags: ["Music", "Festival", "Outdoor"]
      },
      {
        id: 3,
        title: "Art Exhibition",
        date: "September 5, 2025",
        location: "City Art Gallery",
        attendees: "200 Attendees",
        status: "Scheduled",
        image: "/images/eventImages/art.jpg",
        description: "A stunning collection of contemporary art from local and international artists.",
        organizer: "Art Gallery Network",
        price: "$99",
        category: "Art",
        tags: ["Art", "Exhibition", "Culture"]
      },
      {
        id: 4,
        title: "Ramadan Iftar Gathering",
        date: "October 10, 2025",
        location: "Community Center",
        attendees: "150 Attendees",
        status: "Scheduled",
        image: "/images/eventImages/Iftar.jpg",
        description: "Join us for a community iftar to break fast together during the holy month of Ramadan. Enjoy traditional foods and meaningful conversation.",
        organizer: "Sohbet Society",
        price: "Free",
        category: "Cultural",
        tags: ["Cultural", "Community", "Religious"]
      }
    ];
  
    /* -------- Helpers (simple, use real today) -------- */
    const toDate = (s) => new Date(s);
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();
  
    const today = new Date();
  
    const inNext7Days = (d) => {
      const sd = startOfDay(d).getTime();
      const t0 = startOfDay(today).getTime();
      const t7 = t0 + 7 * 86400000;
      return sd >= t0 && sd <= t7;
    };
    const inThisMonth = (d) =>
      d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  
    /* Calendar utils */
    function monthMeta(year, monthIndex) {
      const first = new Date(year, monthIndex, 1);
      const last = new Date(year, monthIndex + 1, 0);
      const startWeekday = first.getDay(); // 0 Sun … 6 Sat
      const days = last.getDate();
      return { startWeekday, days };
    }
  
    /* -------- UI State -------- */
    let filter = 'all'; // 'today' | 'next7' | 'month' | 'all' | 'day'
    let selectedDay = null; // Date | null
  
    // Start calendar on the current month
    let calYear = today.getFullYear();
    let calMonth = today.getMonth(); // 0..11
  
    const filters = [
      { key: 'today', label: 'Today' },
      { key: 'next7', label: 'Next 7 days' },
      { key: 'month', label: 'This month' },
      { key: 'all', label: 'All' }
    ];
  
    function setFilter(key) {
      filter = key;
      selectedDay = null;
      if (key === 'month') {
        calYear = today.getFullYear();
        calMonth = today.getMonth();
      }
    }
  
    function prevMonth() {
      if (calMonth === 0) { calMonth = 11; calYear -= 1; }
      else calMonth -= 1;
    }
    function nextMonth() {
      if (calMonth === 11) { calMonth = 0; calYear += 1; }
      else calMonth += 1;
    }
  
    /* -------- Derived (Svelte 4-friendly) -------- */
    $: calMeta = monthMeta(calYear, calMonth);
    $: calLeading = Array(calMeta.startWeekday).fill(0);
    $: calDayNumbers = Array.from({ length: calMeta.days }, (_, i) => i + 1);
  
    function eventsFiltered() {
      let list = events.map(e => ({ ...e, _date: toDate(e.date) }));
      switch (filter) {
        case 'today':
          list = list.filter(e => isSameDay(e._date, today));
          break;
        case 'next7':
          list = list.filter(e => inNext7Days(e._date));
          break;
        case 'month':
          list = list.filter(e => inThisMonth(e._date));
          break;
        case 'day':
          list = selectedDay ? list.filter(e => isSameDay(e._date, selectedDay)) : [];
          break;
        default:
          // 'all' → no extra filtering
          break;
      }
      // Keep order by date ascending
      return list.sort((a, b) => a._date - b._date);
    }
  
    function eventsOnDay(y, m, dayNum) {
      return events.filter(e => {
        const d = toDate(e.date);
        return d.getFullYear() === y && d.getMonth() === m && d.getDate() === dayNum;
      });
    }
    function selectCalendarDay(dayNum) {
      selectedDay = new Date(calYear, calMonth, dayNum);
      filter = 'day';
    }
  
    // Featured: nearest upcoming (>= today), else earliest by date
    function pickFeatured() {
      const withD = events.map(e => ({ ...e, _date: toDate(e.date) }));
      const upcoming = withD
        .filter(e => startOfDay(e._date).getTime() >= startOfDay(today).getTime())
        .sort((a, b) => a._date - b._date);
      return upcoming[0] || withD.sort((a, b) => a._date - b._date)[0];
    }
    $: featured = pickFeatured();
  
    const recentActivity = [
      { id: 'a1', text: `Updated: ${events[0].title}`, when: '2d ago' },
      { id: 'a2', text: `New venue added for ${events[1].title}`, when: '4d ago' },
      { id: 'a3', text: `Registration closed: ${events[3].title}`, when: '1w ago' }
    ];
  </script>
  
  <!-- Page -->
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">Home</h1>
  
    <!-- Filter Shortcuts -->
    <div class="flex flex-wrap gap-2">
      {#each filters as f}
        <Button
          variant={filter === f.key ? 'default' : 'outline'}
          on:click={() => setFilter(f.key)}
          class="text-sm"
          aria-pressed={filter === f.key}
        >
          {f.label}
        </Button>
      {/each}
    </div>
  
    <!-- Main grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left: Upcoming -->
      <Card class="rounded-2xl shadow-sm border-border/50 xl:col-span-2">
        <CardHeader class="px-5 py-4 flex items-center justify-between">
          <CardTitle class="text-[17px] font-semibold flex items-center gap-2">
            <Clock class="w-4 h-4" /> Upcoming Events
          </CardTitle>
          <a href="/events" class="text-sm underline hover:no-underline">Explore events</a>
        </CardHeader>
        <CardContent class="px-5 py-4 space-y-4">
          {#if eventsFiltered().length === 0}
            <div class="text-sm text-muted-foreground">No events for this filter.</div>
          {:else}
            {#each eventsFiltered().slice(0, 4) as e}
              <div class="flex gap-3 items-start">
                <img src={e.image} alt={e.title} class="w-14 h-14 rounded object-cover" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <strong class="truncate">{e.title}</strong>
                    <Badge>{e.category}</Badge>
                  </div>
                  <div class="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarIcon class="w-4 h-4" /> {e.date}
                    <MapPin class="w-4 h-4 ml-2" /> {e.location}
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </CardContent>
      </Card>
  
      <!-- Right column: Calendar + Featured + Activity -->
      <div class="space-y-6">
        <!-- Small Calendar -->
        <Card class="rounded-2xl shadow-sm border-border/50">
          <CardHeader class="px-5 py-4 flex items-center justify-between">
            <CardTitle class="text-[17px] font-semibold flex items-center gap-2">
              <CalendarIcon class="w-4 h-4" /> Calendar
            </CardTitle>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="icon" on:click={prevMonth} aria-label="Previous month">
                <ChevronLeft class="w-4 h-4" />
              </Button>
              <div class="text-sm font-medium">
                {new Date(calYear, calMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
              <Button variant="outline" size="icon" on:click={nextMonth} aria-label="Next month">
                <ChevronRight class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="px-5 py-4">
            <!-- Week headers -->
            <div class="grid grid-cols-7 text-xs text-muted-foreground mb-2">
              <div class="text-center">Sun</div>
              <div class="text-center">Mon</div>
              <div class="text-center">Tue</div>
              <div class="text-center">Wed</div>
              <div class="text-center">Thu</div>
              <div class="text-center">Fri</div>
              <div class="text-center">Sat</div>
            </div>
  
            <!-- Days grid -->
            {#key `${calYear}-${calMonth}`}
              <div class="grid grid-cols-7 gap-1">
                {#each calLeading as _}
                  <div class="h-9"></div>
                {/each}
  
                {#each calDayNumbers as day}
                  <button
                    class="h-9 rounded hover:bg-muted/70 transition relative flex items-center justify-center text-sm"
                    class:selected={selectedDay && isSameDay(new Date(calYear, calMonth, day), selectedDay)}
                    on:click={() => selectCalendarDay(day)}
                    aria-label={`Select ${calYear}-${calMonth + 1}-${day}`}
                  >
                    {day}
                    {#if eventsOnDay(calYear, calMonth, day).length > 0}
                      <span class="absolute bottom-1 flex gap-0.5">
                        {#each eventsOnDay(calYear, calMonth, day).slice(0,3) as _e}
                          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {/each}
                      </span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/key}
  
            <div class="mt-3 text-xs text-muted-foreground">Click a day to filter events.</div>
          </CardContent>
        </Card>
  
        <!-- Featured Event -->
        <Card class="rounded-2xl shadow-sm border-border/50">
          <CardHeader class="px-5 py-4 flex items-center gap-2">
            <Star class="w-4 h-4 text-amber-500" />
            <CardTitle class="text-[17px] font-semibold">Featured Event</CardTitle>
          </CardHeader>
          <CardContent class="px-5 py-4 space-y-3">
            <img src={featured.image} alt={featured.title} class="w-full h-32 object-cover rounded" />
            <div class="flex items-center gap-2">
              <strong class="truncate">{featured.title}</strong>
              <Badge>{featured.category}</Badge>
            </div>
            <div class="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarIcon class="w-4 h-4" /> {featured.date}
              <MapPin class="w-4 h-4 ml-2" /> {featured.location}
            </div>
            <p class="text-sm line-clamp-3">{featured.description}</p>
            <div class="flex gap-2">
              <a href="/events" class="text-sm underline hover:no-underline">Explore events</a>
            </div>
          </CardContent>
        </Card>
  
        <!-- Recent Activity -->
        <Card class="rounded-2xl shadow-sm border-border/50">
          <CardHeader class="px-5 py-4">
            <CardTitle class="text-[17px] font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent class="px-5 py-4 space-y-3">
            {#each [{id:'a1',text:`Updated: ${events[0].title}`,when:'2d ago'},{id:'a2',text:`New venue added for ${events[1].title}`,when:'4d ago'},{id:'a3',text:`Registration closed: ${events[3].title}`,when:'1w ago'}] as a}
              <div class="text-sm">
                <div>{a.text}</div>
                <div class="text-xs text-muted-foreground">{a.when}</div>
              </div>
            {/each}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  
  <style>
    button.selected { background: hsl(var(--muted)); }
  </style>
  