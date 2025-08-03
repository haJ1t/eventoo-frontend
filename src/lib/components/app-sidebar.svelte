<script lang="ts">
    import {
      Home,
      Calendar,
      MapPin,
      Users,
      Folder,
      ChevronDown,
      ChevronUp
    } from "@lucide/svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { Orbit } from "lucide-svelte";
  </script>
  
  <Sidebar.Provider class="" style="padding-top: 1rem;">
    <Sidebar.Root class="">
      <Sidebar.Content class="text-base ">
        <!-- Evento Group Header (formerly Projects) -->
        <Collapsible.Root open class="mb-2">
          <Sidebar.Group class="" style="padding-top: 5rem;">
            <Collapsible.Content>
              <Sidebar.GroupContent class="">
                <Sidebar.Menu class="">
                  <Sidebar.MenuItem class="">
                    <Sidebar.MenuButton>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Home class="h-5 w-5" />
                        <span>Home</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem class="">
                    <Sidebar.MenuButton asChild>
                      <a href="./events" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Calendar class="h-5 w-5" />
                        <span>Events</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem class="">
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <MapPin class="h-5 w-5" />
                        <span>Venues</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem class="">
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Users class="h-5 w-5" />
                        <span>Attendees</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem class="">
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Orbit class="h-5 w-5" />
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
                  >
                    Username
                    <ChevronUp class="ml-auto h-5 w-5" />
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
  
    <Sidebar.Inset class="">
      <header class="flex h-14 items-center justify-between px-4">
        <Sidebar.Trigger class="h-6 w-6" onclick={() => console.log('Sidebar triggered')} />
      </header>
    </Sidebar.Inset>
  </Sidebar.Provider>
  