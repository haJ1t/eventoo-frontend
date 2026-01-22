<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import {
    Plus,
    Search,
    MapPin,
    Users,
    Star,
    Calendar,
    Building,
  } from "lucide-svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Pagination from "$lib/components/ui/pagination/index.js";

  import ResourceCard from "$lib/components/shared/ResourceCard.svelte";
  import AppSearchBar from "$lib/components/app-search-bar.svelte";
  import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
  import { venues } from "$lib/data/venues";

  // State
  let searchQuery = $state("");
  let selectedType = $state([]);
  let selectedStatus = $state([]);
  let activeDropdown = $state(null);
  let currentPage = $state(1);
  let itemsPerPage = $state(6);
  let isLoading = $state(true);

  // Derived Values
  const uniqueTypes = $derived.by(() => [
    ...new Set(venues.map((v) => v.type)),
  ]);
  const uniqueStatuses = $derived.by(() => [
    ...new Set(venues.map((v) => v.status)),
  ]);

  const filteredVenues = $derived.by(() => {
    let filtered = venues;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedType.length > 0) {
      filtered = filtered.filter((venue) => selectedType.includes(venue.type));
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter((venue) =>
        selectedStatus.includes(venue.status),
      );
    }

    return filtered;
  });

  const paginatedVenues = $derived.by(() =>
    filteredVenues.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ),
  );

  // Effects
  $effect(() => {
    searchQuery;
    selectedType;
    selectedStatus;
    currentPage = 1;
  });

  // Functions
  function loadVenues() {
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
    }, 500);
  }

  function handleDropdownToggle(dropdownType) {
    if (activeDropdown === dropdownType) {
      activeDropdown = null;
    } else {
      activeDropdown = dropdownType;
    }
  }

  function handleClickOutside(event) {
    if (!event.target.closest(".dropdown-container")) {
      activeDropdown = null;
    }
  }

  function clearFilters() {
    searchQuery = "";
    selectedType = [];
    selectedStatus = [];
    activeDropdown = null;
  }

  function navigateToVenueDetails(venue) {
    goto(`/venues/${venue.id}`);
  }

  function navigateToCreateVenue() {
    goto("/venues/create");
  }

  onMount(() => {
    loadVenues();
  });
</script>

<svelte:head>
  <title>Venues - Event Management</title>
</svelte:head>

<svelte:window onclick={handleClickOutside} />

<div class="min-h-screen bg-gray-50/50 p-6 dark:bg-gray-950">
  <div class="mx-auto max-w-7xl space-y-8">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Venues
        </h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          Discover and book the perfect space for your event
        </p>
      </div>
      <Button
        onclick={navigateToCreateVenue}
        disabled={false}
        class="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
      >
        <span class="mr-2 text-lg">+</span>
        Add Venue
      </Button>
    </div>

    <!-- Search & Filter Section -->
    <div
      class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
    >
      <div class="space-y-4">
        <div class="relative">
          <AppSearchBar
            bind:value={searchQuery}
            placeholder="Search venues by name, location, or amenities..."
            showIcon={true}
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <div class="relative dropdown-container z-30">
            <AppFilterDropdown
              bind:selectedValues={selectedType}
              options={uniqueTypes}
              allOptions={uniqueTypes}
              label="Type"
              icon={Building}
              isOpen={activeDropdown === "type"}
              onToggle={() => handleDropdownToggle("type")}
            />
          </div>

          <div class="relative dropdown-container z-20">
            <AppFilterDropdown
              bind:selectedValues={selectedStatus}
              options={uniqueStatuses}
              allOptions={uniqueStatuses}
              label="Status"
              icon={MapPin}
              isOpen={activeDropdown === "status"}
              onToggle={() => handleDropdownToggle("status")}
            />
          </div>

          {#if searchQuery || selectedType.length > 0 || selectedStatus.length > 0}
            <Button
              variant="ghost"
              disabled={false}
              onclick={clearFilters}
              class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Clear Filters
            </Button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div
          class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
        ></div>
      </div>
    {:else}
      <!-- Venues Grid -->
      <div class="space-y-6">
        <div
          class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
        >
          <span
            >Showing {paginatedVenues.length} of {filteredVenues.length} venues</span
          >
          <span
            >Page {currentPage} of {Math.ceil(
              filteredVenues.length / itemsPerPage,
            )}</span
          >
        </div>

        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        >
          {#each paginatedVenues as venue (venue.id)}
            <div animate:flip={{ duration: 400 }} in:fade={{ duration: 300 }}>
              <ResourceCard
                image={venue.image}
                title={venue.name}
                status={venue.status}
                subtitle={venue.location}
                description={venue.description}
                price={`${venue.pricePerHour}/hr`}
                type={venue.type}
                stats={[
                  { icon: Users, value: venue.capacity },
                  { icon: Star, value: venue.rating, color: "text-amber-500" },
                  { icon: Calendar, value: venue.upcomingEvents },
                ]}
                onView={() => navigateToVenueDetails(venue)}
              />
            </div>
          {/each}
        </div>

        <!-- Empty State -->
        {#if filteredVenues.length === 0}
          <div
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-gray-800 dark:bg-gray-900/50"
          >
            <div class="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Building class="h-8 w-8 text-gray-400" />
            </div>
            <h3
              class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              No venues found
            </h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters.
            </p>
            <Button
              variant="outline"
              disabled={false}
              onclick={clearFilters}
              class="mt-6"
            >
              Clear all filters
            </Button>
          </div>
        {/if}

        <!-- Pagination -->
        {#if filteredVenues.length > 0}
          <div class="flex justify-center pt-8">
            <Pagination.Root
              count={filteredVenues.length}
              perPage={itemsPerPage}
              bind:page={currentPage}
              class=""
            >
              {#snippet children({ pages, currentPage: paginationCurrentPage })}
                <Pagination.Content class="">
                  <Pagination.Item class="">
                    <Pagination.PrevButton children={null} class="" />
                  </Pagination.Item>
                  {#each pages as page (page.key)}
                    {#if page.type === "ellipsis"}
                      <Pagination.Item class="">
                        <Pagination.Ellipsis class="" />
                      </Pagination.Item>
                    {:else}
                      <Pagination.Item class="">
                        <Pagination.Link
                          {page}
                          isActive={paginationCurrentPage === page.value}
                          class=""
                        >
                          {page.value}
                        </Pagination.Link>
                      </Pagination.Item>
                    {/if}
                  {/each}
                  <Pagination.Item class="">
                    <Pagination.NextButton children={null} class="" />
                  </Pagination.Item>
                </Pagination.Content>
              {/snippet}
            </Pagination.Root>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
