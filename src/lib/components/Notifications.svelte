<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { Bell, X, Check, Trash2, MoreHorizontal, Clock, User, Calendar } from 'lucide-svelte';
    
    const dispatch = createEventDispatcher();
    
    // Props
    export let isOpen = false;
    export let unreadCount = 0;
    
    // Sample notifications data
    let notifications = [
      {
        id: 1,
        title: "New Event Registration",
        message: "John Doe registered for Tech Conference 2024",
        time: "2 minutes ago",
        type: "registration",
        read: false,
        avatar: "JD"
      },
      {
        id: 2,
        title: "Event Update",
        message: "Music Festival venue has been changed",
        time: "15 minutes ago", 
        type: "update",
        read: false,
        avatar: "MF"
      },
      {
        id: 3,
        title: "Payment Received",
        message: "Payment of $250 received for Art Exhibition",
        time: "1 hour ago",
        type: "payment",
        read: true,
        avatar: "AE"
      },
      {
        id: 4,
        title: "Event Reminder",
        message: "Tech Conference starts in 2 days",
        time: "3 hours ago",
        type: "reminder",
        read: true,
        avatar: "TC"
      },
      {
        id: 5,
        title: "New Message",
        message: "Sarah Wilson sent you a message about catering",
        time: "5 hours ago",
        type: "message",
        read: false,
        avatar: "SW"
      }
    ];
    
    // Functions
    function toggleNotification() {
      isOpen = !isOpen;
      dispatch('toggle', { isOpen });
    }
    
    function closeNotifications() {
      isOpen = false;
      dispatch('close');
    }
    
    function markAsRead(id) {
      notifications = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      updateUnreadCount();
    }
    
    function markAllAsRead() {
      notifications = notifications.map(n => ({ ...n, read: true }));
      updateUnreadCount();
    }
    
    function deleteNotification(id) {
      notifications = notifications.filter(n => n.id !== id);
      updateUnreadCount();
    }
    
    function clearAll() {
      notifications = [];
      updateUnreadCount();
    }
    
    function updateUnreadCount() {
      unreadCount = notifications.filter(n => !n.read).length;
      dispatch('unreadChange', { count: unreadCount });
    }
    
    function getNotificationIcon(type) {
      switch(type) {
        case 'registration': return User;
        case 'update': return Calendar;
        case 'payment': return Check;
        case 'reminder': return Clock;
        case 'message': return Bell;
        default: return Bell;
      }
    }
    
    function getNotificationColor(type) {
      switch(type) {
        case 'registration': return 'bg-blue-100 text-blue-600';
        case 'update': return 'bg-yellow-100 text-yellow-600';
        case 'payment': return 'bg-green-100 text-green-600';
        case 'reminder': return 'bg-purple-100 text-purple-600';
        case 'message': return 'bg-pink-100 text-pink-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    }
    
    // Initialize unread count
    onMount(() => {
      updateUnreadCount();
    });
    
    // Close on Escape key
    function handleKeydown(event) {
      if (event.key === 'Escape' && isOpen) {
        closeNotifications();
      }
    }
  </script>
  
  <svelte:window on:keydown={handleKeydown} />
  
  <!-- Notification Bell Button -->
  <div class="relative">
    <button 
      on:click={toggleNotification}
      class="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110"
    >
      <Bell class="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
      
      <!-- Unread Badge -->
      {#if unreadCount > 0}
        <span 
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse"
          in:fly={{ y: -10, duration: 300 }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      {/if}
    </button>
  </div>
  
  <!-- Overlay Backdrop -->
  {#if isOpen}
    <div 
      class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      on:click={closeNotifications}
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
    ></div>
  {/if}
  
  <!-- Notifications Panel -->
  {#if isOpen}
    <div 
      class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 border-l border-gray-200"
      in:fly={{ x: 400, duration: 300, opacity: 1 }}
      out:fly={{ x: 400, duration: 300, opacity: 1 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Notifications</h2>
          <p class="text-sm text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        <button 
          on:click={closeNotifications}
          class="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110"
        >
          <X class="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <button 
          on:click={markAllAsRead}
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 hover:scale-105 transform"
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
        <button 
          on:click={clearAll}
          class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-300 hover:scale-105 transform"
          disabled={notifications.length === 0}
        >
          Clear all
        </button>
      </div>
      
      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        {#if notifications.length === 0}
          <div class="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell class="w-12 h-12 mb-4 opacity-50" />
            <p class="text-lg font-medium">No notifications</p>
            <p class="text-sm">You're all caught up!</p>
          </div>
        {:else}
          <div class="divide-y divide-gray-100">
            {#each notifications as notification, index (notification.id)}
              <div 
                class="p-4 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] {!notification.read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}"
                in:fly={{ x: 20, duration: 300, delay: index * 50 }}
              >
                <div class="flex items-start gap-3">
                  <!-- Avatar/Icon -->
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full {getNotificationColor(notification.type)} flex items-center justify-center">
                      <svelte:component this={getNotificationIcon(notification.type)} class="w-5 h-5" />
                    </div>
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="text-sm font-semibold text-gray-900 {!notification.read ? 'font-bold' : ''}">
                          {notification.title}
                        </h3>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock class="w-3 h-3" />
                          {notification.time}
                        </p>
                      </div>
                      
                      <!-- Actions -->
                      <div class="flex items-center gap-1 ml-2">
                        {#if !notification.read}
                          <button 
                            on:click={() => markAsRead(notification.id)}
                            class="p-1 hover:bg-blue-100 rounded transition-all duration-300 transform hover:scale-110"
                            title="Mark as read"
                          >
                            <Check class="w-4 h-4 text-blue-600" />
                          </button>
                        {/if}
                        <button 
                          on:click={() => deleteNotification(notification.id)}
                          class="p-1 hover:bg-red-100 rounded transition-all duration-300 transform hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 class="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Unread Indicator -->
                {#if !notification.read}
                  <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105">
          View all notifications
        </button>
      </div>
    </div>
  {/if}
  
  <style>
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
  