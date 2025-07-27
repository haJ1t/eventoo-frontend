<script lang="ts">
    import { Bell, Settings, User } from "@lucide/svelte";
  </script>
  
  <header class="bg-white border-b px-8 py-4 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Evento</h1>
    <div class="flex items-center space-x-6">
      <Bell class="w-6 h-6" />
      <Settings class="w-6 h-6" />
      <a href="./login" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
        <User class="w-7 h-7 rounded-full" />
      </a>
    </div>
  </header>
  