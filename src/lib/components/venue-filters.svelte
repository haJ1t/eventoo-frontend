<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Search, Filter, X } from "lucide-svelte";
  
    const dispatch = createEventDispatcher();
  
    // Filter state
    export let filters = {
      search: '',
      type: '',
      status: '',
      capacity: '',
      location: ''
    };
  
    // Filter options
    const venueTypes = [
      { value: '', label: 'All Types' },
      { value: 'Conference Room', label: 'Conference Room' },
      { value: 'Event Hall', label: 'Event Hall' },
      { value: 'Meeting Room', label: 'Meeting Room' },
      { value: 'Auditorium', label: 'Auditorium' },
      { value: 'Banquet Hall', label: 'Banquet Hall' }
    ];
  
    const statusOptions = [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ];
  
    const capacityOptions = [
      { value: '', label: 'Any Capacity' },
      { value: '1-10', label: '1-10 people' },
      { value: '11-50', label: '11-50 people' },
      { value: '51-100', label: '51-100 people' },
      { value: '100+', label: '100+ people' }
    ];
  
    const locationOptions = [
      { value: '', label: 'All Locations' },
      { value: 'downtown', label: 'Downtown' },
      { value: 'business-district', label: 'Business District' },
      { value: 'suburbs', label: 'Suburbs' },
      { value: 'airport', label: 'Near Airport' }
    ];
  
    // Event handlers
    function handleSearch() {
      console.log('Applying filters:', filters);
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
      handleSearch();
    }
  
    function hasActiveFilters() {
      return Object.values(filters).some(value => value !== '');
    }
  </script>
  
  <Card class="">
    <CardHeader class="">
      <CardTitle class="flex items-center gap-2">
        <Filter class="h-5 w-5" />
        Venue Filters
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Search -->
      <div class="space-y-2">
        <Label for="search" class="">Search Venues</Label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search by name, description..."
            class="pl-10"
            bind:value={filters.search}
            on:input={handleSearch}
          />
        </div>
      </div>
  
      <!-- Type Filter -->
      <div class="space-y-2">
        <Label class="">Venue Type</Label>
        <select 
          bind:value={filters.type} 
          on:change={handleSearch}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each venueTypes as type}
            <option value={type.value}>{type.label}</option>
          {/each}
        </select>
      </div>
  
      <!-- Status Filter -->
      <div class="space-y-2">
        <Label class="">Status</Label>
        <select 
          bind:value={filters.status} 
          on:change={handleSearch}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each statusOptions as status}
            <option value={status.value}>{status.label}</option>
          {/each}
        </select>
      </div>
  
      <!-- Capacity Filter -->
      <div class="space-y-2">
        <Label class="">Capacity</Label>
        <select 
          bind:value={filters.capacity} 
          on:change={handleSearch}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each capacityOptions as capacity}
            <option value={capacity.value}>{capacity.label}</option>
          {/each}
        </select>
      </div>
  
      <!-- Location Filter -->
      <div class="space-y-2">
        <Label class="">Location</Label>
        <select 
          bind:value={filters.location} 
          on:change={handleSearch}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each locationOptions as location}
            <option value={location.value}>{location.label}</option>
          {/each}
        </select>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          class="flex-1"
          disabled={false}
          on:click={handleSearch}
          type="button"
        >
          Apply Filters
        </Button>
        {#if hasActiveFilters()}
          <Button
            variant="secondary" 
            size="sm"
            class=""
            disabled={false}
            on:click={clearFilters}
            type="button"
          >
            <X class="h-3 w-3 mr-1" />
            Clear
          </Button>
        {/if}
      </div>
  
      <!-- Active Filters Display -->
      {#if hasActiveFilters()}
        <div class="space-y-2">
          <Label class="text-xs">Active Filters:</Label>
          <div class="flex flex-wrap gap-1">
            {#if filters.search}
              <Badge href="#" variant="outline" class="text-xs">
                Search: {filters.search}
              </Badge>
            {/if}
            {#if filters.type}
              <Badge href="#" variant="outline" class="text-xs">
                Type: {venueTypes.find(t => t.value === filters.type)?.label}
              </Badge>
            {/if}
            {#if filters.status}
              <Badge href="#" variant="outline" class="text-xs">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
              </Badge>
            {/if}
            {#if filters.capacity}
              <Badge href="#" variant="outline" class="text-xs">
                Capacity: {capacityOptions.find(c => c.value === filters.capacity)?.label}
              </Badge>
            {/if}
            {#if filters.location}
              <Badge href="#" variant="outline" class="text-xs">
                Location: {locationOptions.find(l => l.value === filters.location)?.label}
              </Badge>
            {/if}
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>
  