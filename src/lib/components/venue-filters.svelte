<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Input } from "$lib/components/ui/input";
    import { Search, Filter, X } from "lucide-svelte";
  
    const dispatch = createEventDispatcher();
  
    // Props
    export let filters = {
      search: '',
      type: '',
      status: '',
      capacity: '',
      location: ''
    };
    
    export let isOpen = false;
  
    // Filter options
    const venueTypes = [
      { value: '', label: 'All Types' },
      { value: 'Conference', label: 'Conference' },
      { value: 'Wedding', label: 'Wedding' },
      { value: 'Party', label: 'Party' },
      { value: 'Corporate', label: 'Corporate' }
    ];
  
    const statusOptions = [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ];
  
    const capacityOptions = [
      { value: '', label: 'Any Capacity' },
      { value: '0-50', label: '0-50 people' },
      { value: '51-100', label: '51-100 people' },
      { value: '101-300', label: '101-300 people' },
      { value: '300+', label: '300+ people' }
    ];
  
    // Event handlers
    function handleFilterChange() {
      dispatch('filter', filters);
    }
  
    function clearFilters() {
      filters = {
        search: '',
        type: '',
        status: '',
        capacity: '',
        location: ''
      };
      handleFilterChange();
    }
  
    function clearSingleFilter(filterKey: string) {
      filters[filterKey] = '';
      handleFilterChange();
    }
  
    function hasActiveFilters() {
      return Object.values(filters).some(value => value !== '');
    }
  
    function closeFilters() {
      dispatch('close');
    }
  </script>
  
  {#if isOpen}
    <Card class="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardContent class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <Filter class="h-5 w-5" />
            Filter Options
          </h3>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            on:click={closeFilters}
            type="button"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
        
        <!-- Yatay Filter Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <!-- Venue Type Filter -->
          <div class="space-y-2">
            <label for="venue-type-select" class="text-sm font-medium text-muted-foreground">Venue Type</label>
            <select
              id="venue-type-select"
              bind:value={filters.type}
              on:change={handleFilterChange}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {#each venueTypes as type}
                <option value={type.value}>{type.label}</option>
              {/each}
            </select>
          </div>
  
          <!-- Status Filter -->
          <div class="space-y-2">
            <label for="status-select" class="text-sm font-medium text-muted-foreground">Status</label>
            <select
              id="status-select"
              bind:value={filters.status}
              on:change={handleFilterChange}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {#each statusOptions as status}
                <option value={status.value}>{status.label}</option>
              {/each}
            </select>
          </div>
  
          <!-- Capacity Filter -->
          <div class="space-y-2">
            <label for="capacity-select" class="text-sm font-medium text-muted-foreground">Capacity</label>
            <select
              id="capacity-select"
              bind:value={filters.capacity}
              on:change={handleFilterChange}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {#each capacityOptions as capacity}
                <option value={capacity.value}>{capacity.label}</option>
              {/each}
            </select>
          </div>
  
          <!-- Location Filter -->
          <div class="space-y-2">
            <label for="location-input" class="text-sm font-medium text-muted-foreground">Location</label>
            <Input
              id="location-input"
              type="text"
              placeholder="Enter location..."
              bind:value={filters.location}
              on:input={handleFilterChange}
              class="h-10"
            />
          </div>
  
          <!-- Clear Filters Button -->
          <div class="space-y-2">
            <div class="text-sm font-medium text-muted-foreground invisible">Actions</div>
            <Button
              variant="outline"
              class="w-full h-10"
              disabled={!hasActiveFilters()}
              on:click={clearFilters}
              type="button"
            >
              <X class="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
  
        <!-- Active Filters Display -->
        {#if hasActiveFilters()}
          <div class="mt-4 pt-4 border-t">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-medium text-muted-foreground">Active filters:</span>
              {#if filters.search}
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                  Search: {filters.search}
                  <button on:click={() => clearSingleFilter('search')} class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
              {#if filters.type}
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                  Type: {filters.type}
                  <button on:click={() => clearSingleFilter('type')} class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
              {#if filters.status}
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                  Status: {filters.status}
                  <button on:click={() => clearSingleFilter('status')} class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
              {#if filters.capacity}
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                  Capacity: {filters.capacity}
                  <button on:click={() => clearSingleFilter('capacity')} class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
              {#if filters.location}
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                  Location: {filters.location}
                  <button on:click={() => clearSingleFilter('location')} class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </CardContent>
    </Card>
  {/if}
  