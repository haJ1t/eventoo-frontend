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
  </script>
  
  <Sidebar.Provider>
    <Sidebar.Root>
      <Sidebar.Header />
  
      <Sidebar.Content class="text-base ">
        <!-- Evento Group Header (formerly Projects) -->
        <Collapsible.Root open class="group/collapsible">
          <Sidebar.Group>
            <Sidebar.GroupLabel>
              {#snippet child({ props })}
                <Collapsible.Trigger
                  {...props}
                  class="text-[17px] font-semibold px-4 py-3 flex items-center justify-between"
                >

                  <ChevronDown
                    class="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-180"
                  />
                </Collapsible.Trigger>
              {/snippet}
            </Sidebar.GroupLabel>
  
            <Collapsible.Content>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Home class="h-5 w-5" />
                        <span>Home</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton asChild>
                      <a href="./events" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Calendar class="h-5 w-5" />
                        <span>Events</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <MapPin class="h-5 w-5" />
                        <span>Venues</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton asChild>
                      <a href="#" class="flex items-center gap-x-3 text-[15px] py-2 pl-5">
                        <Users class="h-5 w-5" />
                        <span>Attendees</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Collapsible.Content>
          </Sidebar.Group>
        </Collapsible.Root>
      </Sidebar.Content>
  
      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
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
              <DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
                <DropdownMenu.Item><span>Account</span></DropdownMenu.Item>
                <DropdownMenu.Item><span>Billing</span></DropdownMenu.Item>
                <DropdownMenu.Item><span>Sign out</span></DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
    </Sidebar.Root>
  
    <Sidebar.Inset>
      <header class="flex h-14 items-center justify-between px-4">
        <Sidebar.Trigger class="h-6 w-6" />
      </header>
    </Sidebar.Inset>
  </Sidebar.Provider>
  