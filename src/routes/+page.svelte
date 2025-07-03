<script>
  import { onMount } from 'svelte';
  
  // Sample data - in a real app, this would come from an API
  let stats = {
      totalEvents: 24,
      upcomingEvents: 18,
      totalAttendees: 45600,
      activeVenues: 12
  };
  
  let upcomingEvents = [
      {
          id: 1,
          title: "Tech Conference 2024",
          date: "July 15, 2024",
          time: "9:00 AM",
          venue: "Grand Ballroom",
          attendees: 500,
          status: "Scheduled",
          priority: "high"
      },
      {
          id: 2,
          title: "Summer Music Festival",
          date: "August 20, 2024",
          time: "6:00 PM",
          venue: "Central Park",
          attendees: 10000,
          status: "Scheduled",
          priority: "high"
      },
      {
          id: 3,
          title: "Art Exhibition Opening",
          date: "September 5, 2024",
          time: "10:00 AM",
          venue: "City Art Gallery",
          attendees: 200,
          status: "Scheduled",
          priority: "medium"
      },
      {
          id: 4,
          title: "Business Networking Event",
          date: "September 12, 2024",
          time: "7:00 PM",
          venue: "Convention Center",
          attendees: 300,
          status: "Scheduled",
          priority: "medium"
      },
      {
          id: 5,
          title: "Charity Gala",
          date: "October 15, 2024",
          time: "8:00 PM",
          venue: "Luxury Hotel Ballroom",
          attendees: 400,
          status: "Planning",
          priority: "high"
      },
      {
          id: 6,
          title: "Food & Wine Festival",
          date: "October 22, 2024",
          time: "12:00 PM",
          venue: "Riverside Park",
          attendees: 2500,
          status: "Scheduled",
          priority: "medium"
      },
      {
          id: 7,
          title: "Corporate Training Workshop",
          date: "November 3, 2024",
          time: "9:30 AM",
          venue: "Training Center A",
          attendees: 50,
          status: "Confirmed",
          priority: "low"
      },
      {
          id: 8,
          title: "Holiday Christmas Party",
          date: "December 20, 2024",
          time: "7:30 PM",
          venue: "Grand Hotel",
          attendees: 150,
          status: "Planning",
          priority: "medium"
      },
      {
          id: 9,
          title: "New Year's Eve Celebration",
          date: "December 31, 2024",
          time: "10:00 PM",
          venue: "Rooftop Terrace",
          attendees: 800,
          status: "Scheduled",
          priority: "high"
      },
      {
          id: 10,
          title: "Product Launch Event",
          date: "January 15, 2025",
          time: "2:00 PM",
          venue: "Innovation Hub",
          attendees: 250,
          status: "Planning",
          priority: "high"
      }
  ];
  
  let recentActivity = [
      {
          id: 1,
          action: "New event created",
          event: "Product Launch Event",
          time: "30 minutes ago",
          icon: "event",
          type: "create"
      },
      {
          id: 2,
          action: "Event updated",
          event: "Tech Conference 2024",
          time: "2 hours ago",
          icon: "edit",
          type: "update"
      },
      {
          id: 3,
          action: "New attendee registered",
          event: "Summer Music Festival",
          time: "3 hours ago",
          icon: "person_add",
          type: "registration"
      },
      {
          id: 4,
          action: "Venue booked",
          event: "Charity Gala",
          time: "5 hours ago",
          icon: "place",
          type: "booking"
      },
      {
          id: 5,
          action: "Payment received",
          event: "Business Networking Event",
          time: "1 day ago",
          icon: "payment",
          type: "payment"
      },
      {
          id: 6,
          action: "Event cancelled",
          event: "Outdoor Workshop",
          time: "1 day ago",
          icon: "cancel",
          type: "cancel"
      },
      {
          id: 7,
          action: "Vendor confirmed",
          event: "Food & Wine Festival",
          time: "2 days ago",
          icon: "check_circle",
          type: "confirmation"
      },
      {
          id: 8,
          action: "Invitation sent",
          event: "Holiday Christmas Party",
          time: "2 days ago",
          icon: "mail",
          type: "invitation"
      },
      {
          id: 9,
          action: "Capacity increased",
          event: "New Year's Eve Celebration",
          time: "3 days ago",
          icon: "trending_up",
          type: "update"
      },
      {
          id: 10,
          action: "Early bird pricing activated",
          event: "Tech Conference 2024",
          time: "3 days ago",
          icon: "local_offer",
          type: "pricing"
      }
  ];
  
  // Additional event categories for quick stats
  let eventCategories = [
      { name: "Conferences", count: 8, color: "blue" },
      { name: "Festivals", count: 6, color: "green" },
      { name: "Corporate", count: 5, color: "purple" },
      { name: "Social", count: 3, color: "pink" },
      { name: "Workshops", count: 2, color: "orange" }
  ];
  
  // Functions
  function navigateToEvents() {
      window.location.href = '/events';
  }
  
  function navigateToEvent(eventId) {
      window.location.href = `/events/${eventId}`;
  }
  
  function createNewEvent() {
      window.location.href = '/events/new';
  }
  
  // Format date for display
  function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
      });
  }
  
  // Get status color
  function getStatusColor(status) {
      switch(status.toLowerCase()) {
          case 'scheduled': return 'bg-green-100 text-green-800';
          case 'planning': return 'bg-yellow-100 text-yellow-800';
          case 'confirmed': return 'bg-blue-100 text-blue-800';
          case 'cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  }
  
  // Get priority indicator
  function getPriorityColor(priority) {
      switch(priority) {
          case 'high': return 'border-l-red-500';
          case 'medium': return 'border-l-yellow-500';
          case 'low': return 'border-l-green-500';
          default: return 'border-l-gray-300';
      }
  }
  
  onMount(() => {
      console.log('Home page mounted');
  });
</script>

<svelte:head>
  <title>Home - Evently</title>
</svelte:head>

<div class="p-8">
  <!-- Welcome Section -->
  <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
      <p class="text-gray-600">Here's what's happening with your events today.</p>
  </div>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
              <div>
                  <p class="text-sm font-medium text-gray-600">Total Events</p>
                  <p class="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                  <span class="material-icons text-blue-600">event</span>
              </div>
          </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
              <div>
                  <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p class="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                  <span class="material-icons text-green-600">schedule</span>
              </div>
          </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
              <div>
                  <p class="text-sm font-medium text-gray-600">Total Attendees</p>
                  <p class="text-3xl font-bold text-gray-900">{stats.totalAttendees.toLocaleString()}</p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                  <span class="material-icons text-purple-600">people</span>
              </div>
          </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
              <div>
                  <p class="text-sm font-medium text-gray-600">Active Venues</p>
                  <p class="text-3xl font-bold text-gray-900">{stats.activeVenues}</p>
              </div>
              <div class="bg-orange-100 p-3 rounded-full">
                  <span class="material-icons text-orange-600">place</span>
              </div>
          </div>
      </div>
  </div>
  
  <!-- Event Categories Overview -->
  <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Event Categories</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          {#each eventCategories as category}
              <div class="bg-white rounded-lg p-4 shadow-sm border text-center">
                  <div class="text-2xl font-bold text-{category.color}-600 mb-1">{category.count}</div>
                  <div class="text-sm text-gray-600">{category.name}</div>
              </div>
          {/each}
      </div>
  </div>
  
  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Upcoming Events -->
      <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border">
              <div class="flex items-center justify-between p-6 border-b">
                  <h2 class="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                  <button 
                      class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      on:click={navigateToEvents}
                  >
                      View All
                  </button>
              </div>
              
              <div class="divide-y max-h-96 overflow-y-auto">
                  {#each upcomingEvents as event}
                      <div 
                          class="p-6 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 {getPriorityColor(event.priority)}"
                          on:click={() => navigateToEvent(event.id)}
                          role="button"
                          tabindex="0"
                          on:keydown={(e) => e.key === 'Enter' && navigateToEvent(event.id)}
                      >
                          <div class="flex items-center justify-between">
                              <div class="flex-1">
                                  <div class="flex items-center justify-between mb-2">
                                      <h3 class="font-semibold text-gray-900">{event.title}</h3>
                                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(event.status)}">
                                          {event.status}
                                      </span>
                                  </div>
                                  <div class="flex items-center text-sm text-gray-600 space-x-4 flex-wrap gap-y-1">
                                      <div class="flex items-center">
                                          <span class="material-icons text-sm mr-1">schedule</span>
                                          {formatDate(event.date)} at {event.time}
                                      </div>
                                      <div class="flex items-center">
                                          <span class="material-icons text-sm mr-1">place</span>
                                          {event.venue}
                                      </div>
                                      <div class="flex items-center">
                                          <span class="material-icons text-sm mr-1">people</span>
                                          {event.attendees.toLocaleString()} attendees
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  {/each}
              </div>
              
              <div class="p-6 border-t bg-gray-50">
                  <button 
                      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      on:click={createNewEvent}
                  >
                      Create New Event
                  </button>
              </div>
          </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border">
              <div class="p-6 border-b">
                  <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              
              <div class="divide-y max-h-96 overflow-y-auto">
                  {#each recentActivity as activity}
                      <div class="p-4">
                          <div class="flex items-start space-x-3">
                              <div class="bg-gray-100 p-2 rounded-full flex-shrink-0">
                                  <span class="material-icons text-gray-600 text-sm">{activity.icon}</span>
                              </div>
                              <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-gray-900">{activity.action}</p>
                                  <p class="text-sm text-gray-600 truncate">{activity.event}</p>
                                  <p class="text-xs text-gray-500 mt-1">{activity.time}</p>
                              </div>
                          </div>
                      </div>
                  {/each}
              </div>
              
              <div class="p-4 border-t bg-gray-50">
                  <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View All Activity
                  </button>
              </div>
          </div>
      </div>
  </div>
  
  <!-- Quick Actions -->
  <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
              class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              on:click={createNewEvent}
          >
              <div class="text-center">
                  <span class="material-icons text-gray-400 group-hover:text-blue-500 text-3xl mb-2">add_circle</span>
                  <p class="font-medium text-gray-900">Create Event</p>
                  <p class="text-sm text-gray-600">Start planning a new event</p>
              </div>
          </button>
          
          <button 
              class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 hover:bg-green-50 transition-colors group"
              on:click={() => window.location.href = '/venues'}
          >
              <div class="text-center">
                  <span class="material-icons text-gray-400 group-hover:text-green-500 text-3xl mb-2">place</span>
                  <p class="font-medium text-gray-900">Add Venue</p>
                  <p class="text-sm text-gray-600">Register a new venue</p>
              </div>
          </button>
          
          <button 
              class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
              on:click={() => window.location.href = '/attendees'}
          >
              <div class="text-center">
                  <span class="material-icons text-gray-400 group-hover:text-purple-500 text-3xl mb-2">person_add</span>
                  <p class="font-medium text-gray-900">Invite Attendees</p>
                  <p class="text-sm text-gray-600">Send invitations</p>
              </div>
          </button>
          
          <button 
              class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
              on:click={() => window.location.href = '/reports'}
          >
              <div class="text-center">
                  <span class="material-icons text-gray-400 group-hover:text-yellow-500 text-3xl mb-2">analytics</span>
                  <p class="font-medium text-gray-900">View Reports</p>
                  <p class="text-sm text-gray-600">Analytics & insights</p>
              </div>
          </button>
      </div>
  </div>
</div>

<style>
  /* Custom scrollbar for activity feed and events list */
  .max-h-96::-webkit-scrollbar {
      width: 4px;
  }
  
  .max-h-96::-webkit-scrollbar-track {
      background: #f1f5f9;
  }
  
  .max-h-96::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
  }
  
  .max-h-96::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
  }
</style>
