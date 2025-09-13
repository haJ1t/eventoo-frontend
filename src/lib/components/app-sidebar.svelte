<script lang="ts">
    import {
      Home,
      Calendar,
      MapPin,
      Users,
      Folder,
      ChevronDown,
      ChevronUp,
      User
    } from "@lucide/svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { Orbit } from "lucide-svelte";
</script>
  
<Sidebar.Provider>
  <Sidebar.Root class="h-screen" collapsible="icon">
    <!-- Logo Header -->
    <Sidebar.Header class="px-3.5 py-3 group/header">
      <div class="flex items-center gap-5">
        <!-- Icon that transforms to trigger on hover when collapsed -->
        <div class="relative">
          <a href="/home" class="flex items-center gap-x-3 text-[15px] py-2 group-data-[collapsible=icon]:group-hover/header:opacity-0 transition-opacity duration-200">
            <Orbit class="h-6 w-6" />
          </a>
          <!-- Hidden trigger that appears on hover when collapsed -->
          <Sidebar.Trigger class="absolute inset-0 opacity-0 group-data-[collapsible=icon]:group-hover/header:opacity-100 hover:bg-gray-100 rounded transition-all duration-200 flex items-center justify-center" />
        </div>
        <span class="text-xl font-bold group-data-[collapsible=icon]:hidden">Evento</span>
        <!-- Regular trigger for expanded state -->
        <Sidebar.Trigger class="ml-auto hover:bg-gray-100 p-1 rounded transition-colors group-data-[collapsible=icon]:hidden" />
      </div>
    </Sidebar.Header>

    <Sidebar.Content class="text-base">
      <!-- Navigation Menu -->
      <Collapsible.Root open class="mb-2">
        <Sidebar.Group class="" style="">
          <Collapsible.Content>
            <Sidebar.GroupContent class="">
              <Sidebar.Menu class="">
                <Sidebar.MenuItem class="">
                  <Sidebar.MenuButton asChild tooltipContent="Home">
                    <a href="/home" class="flex items-center gap-x-3 text-[15px] py-2">
                      <Home class="h-5 w-5" />
                      <span>Home</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem class="">
                  <Sidebar.MenuButton asChild tooltipContent="Events">
                    <a href="/events" class="flex items-center gap-x-3 text-[15px] py-2">
                      <Calendar class="h-5 w-5" />
                      <span>Events</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem class="">
                  <Sidebar.MenuButton asChild tooltipContent="Venues">
                    <a href="/venues" class="flex items-center gap-x-3 text-[15px] py-2">
                      <MapPin class="h-5 w-5" />
                      <span>Venues</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem class="">
                  <Sidebar.MenuButton asChild tooltipContent="Attendees">
                    <a href="/attendees" class="flex items-center gap-x-3 text-[15px] py-2">
                      <Users class="h-5 w-5" />
                      <span>Attendees</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem class="">
                  <Sidebar.MenuButton asChild tooltipContent="Organisers">
                    <a href="/organisers" class="flex items-center gap-x-3 text-[15px] py-2">
                      <Folder class="h-5 w-5" />
                      <span>Organisers</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Collapsible.Content>
        </Sidebar.Group>
      </Collapsible.Root>
    </Sidebar.Content>
    
    <Sidebar.Footer class="">
      <Sidebar.Menu class="">
        <Sidebar.MenuItem class="">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  class="text-[15px] py-3 px-4 font-medium flex items-center justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltipContent="User Menu"
                >
                  <User class="h-5 w-5" />
                  <span class="group-data-[collapsible=icon]:hidden">Username</span>
                  <ChevronUp class="ml-auto h-5 w-5 group-data-[collapsible=icon]:hidden" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]" portalProps={{}}>
              <DropdownMenu.Item class="py-2 px-4" inset><span>Account</span></DropdownMenu.Item>
              <DropdownMenu.Item class="py-2 px-4" inset><span>Billing</span></DropdownMenu.Item>
              <DropdownMenu.Item class="py-2 px-4" inset><span>Sign out</span></DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>
</Sidebar.Provider>
  