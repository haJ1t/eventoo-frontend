<script lang="ts">
  import { Settings, User } from "@lucide/svelte";
  import Notifications from "./Notifications.svelte";
  
  // Notification state
  let notificationsOpen = false;
  let unreadCount = 0;
  
  function handleNotificationToggle(event) {
    notificationsOpen = event.detail.isOpen;
  }
  
  function handleNotificationClose() {
    notificationsOpen = false;
  }
  
  function handleUnreadChange(event) {
    unreadCount = event.detail.count;
  }
</script>

<header class="bg-white border-b px-8 py-4 flex items-center justify-between relative">
  <h1 class="text-2xl font-bold"></h1>
  <div class="flex items-center space-x-6">
    <!-- Notifications Component -->
    <Notifications 
      bind:isOpen={notificationsOpen}
      bind:unreadCount={unreadCount}
      on:toggle={handleNotificationToggle}
      on:close={handleNotificationClose}
      on:unreadChange={handleUnreadChange}
    />
    
    <a href="/settings">
      <Settings class="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
    </a>
    <a href="./login">
      <User class="w-7 h-7 rounded-full cursor-pointer hover:text-gray-600 transition-colors" />
    </a>
  </div>
</header>
