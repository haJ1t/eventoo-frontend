<script lang="ts">
	import ResourceCard from "$lib/components/shared/ResourceCard.svelte";
	import AppSearchBar from "$lib/components/app-search-bar.svelte";
	import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import { MapPin, User2, Tag, Calendar, Users } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import { flip } from "svelte/animate";
	import { fade } from "svelte/transition";
	import { events } from "$lib/data/events";

	let searchQuery = $state("");
	let selectedTags = $state<string[]>([]);
	let selectedLocations = $state<string[]>([]);
	let selectedEventSizes = $state<string[]>([]);
	let activeDropdown = $state<string | null>(null);

	// Pagination state
	let currentPage = $state(1);
	let itemsPerPage = $state(6);

	// Derived filtered events
	const filteredEvents = $derived(
		events.filter((event) => {
			const matchesSearch =
				searchQuery === "" ||
				event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				event.location
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesTags =
				selectedTags.length === 0 ||
				(event.tags &&
					selectedTags.some((tag) => event.tags.includes(tag)));

			const matchesSize =
				selectedEventSizes.length === 0 ||
				selectedEventSizes.some((size) => event.size.includes(size));

			const matchesLocation =
				selectedLocations.length === 0 ||
				selectedLocations.some((loc) => event.location.includes(loc));

			return (
				matchesSearch && matchesTags && matchesSize && matchesLocation
			);
		}),
	);

	// Reset page on filter change
	$effect(() => {
		searchQuery;
		selectedTags;
		selectedLocations;
		selectedEventSizes;
		currentPage = 1;
	});

	// Derived paginated events
	const paginatedEvents = $derived(
		filteredEvents.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		),
	);

	function handleViewDetails(event: any) {
		goto(`/events/${event.id}`);
	}

	function handleDropdownToggle(dropdownType: string) {
		if (activeDropdown === dropdownType) {
			activeDropdown = null;
		} else {
			activeDropdown = dropdownType;
		}
	}

	function clearAllTags() {
		selectedTags = [];
		selectedLocations = [];
		selectedEventSizes = [];
		searchQuery = "";
		activeDropdown = null;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as Element).closest(".dropdown-container")) {
			activeDropdown = null;
		}
	}

	function navigateToAddEvent() {
		goto("/events/add");
	}

	// Dynamic Options
	const maxTagsToShow = 6;
	const maxLocationsToShow = 6;
	const maxEventSizesToShow = 4;

	function getMostPopularOptions(data: any[], field: string, maxCount = 6) {
		const frequency: Record<string, number> = {};
		data.forEach((item) => {
			if (field === "tags" && item.tags && Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => {
					frequency[tag] = (frequency[tag] || 0) + 1;
				});
			} else if (field === "location" && item.location) {
				frequency[item.location] = (frequency[item.location] || 0) + 1;
			} else if (field === "size" && item.size) {
				frequency[item.size] = (frequency[item.size] || 0) + 1;
			}
		});

		return Object.entries(frequency)
			.sort(([, a], [, b]) => b - a)
			.slice(0, maxCount)
			.map(([option]) => option);
	}

	const allTagOptions = $derived([
		...new Set(events.flatMap((e) => e.tags || [])),
	]);
	const allLocationOptions = $derived([
		...new Set(events.map((e) => e.location)),
	]);
	const allEventSizeOptions = $derived([
		...new Set(events.map((e) => e.size)),
	]);

	const locationOptions = getMostPopularOptions(
		events,
		"location",
		maxLocationsToShow,
	);
	const eventSizeOptions = getMostPopularOptions(
		events,
		"size",
		maxEventSizesToShow,
	);
	const tagOptions = getMostPopularOptions(events, "tags", maxTagsToShow);
</script>

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
					Events
				</h1>
				<p class="mt-1 text-gray-500 dark:text-gray-400">
					Discover and join amazing events nearby
				</p>
			</div>
			<Button
				onclick={navigateToAddEvent}
				disabled={false}
				class="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
			>
				<span class="mr-2 text-lg">+</span>
				Create Event
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
						placeholder="Search events, locations, or organizers..."
						showIcon={true}
					/>
				</div>

				<div class="flex flex-wrap gap-3">
					<div class="relative dropdown-container z-30">
						<AppFilterDropdown
							bind:selectedValues={selectedLocations}
							options={locationOptions}
							allOptions={allLocationOptions}
							label="Location"
							icon={MapPin}
							isOpen={activeDropdown === "location"}
							onToggle={() => handleDropdownToggle("location")}
						/>
					</div>

					<div class="relative dropdown-container z-20">
						<AppFilterDropdown
							bind:selectedValues={selectedEventSizes}
							options={eventSizeOptions}
							allOptions={allEventSizeOptions}
							label="Event Size"
							icon={User2}
							isOpen={activeDropdown === "size"}
							onToggle={() => handleDropdownToggle("size")}
						/>
					</div>

					<div class="relative dropdown-container z-10">
						<AppFilterDropdown
							bind:selectedValues={selectedTags}
							options={tagOptions}
							allOptions={allTagOptions}
							label="Tags"
							icon={Tag}
							isOpen={activeDropdown === "tags"}
							onToggle={() => handleDropdownToggle("tags")}
						/>
					</div>

					{#if searchQuery || selectedTags.length > 0 || selectedLocations.length > 0 || selectedEventSizes.length > 0}
						<Button
							variant="ghost"
							disabled={false}
							onclick={clearAllTags}
							class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
						>
							Clear Filters
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Events Grid -->
		<div class="space-y-6">
			<div
				class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
			>
				<span
					>Showing {paginatedEvents.length} of {filteredEvents.length}
					events</span
				>
				<span
					>Page {currentPage} of {Math.ceil(
						filteredEvents.length / itemsPerPage,
					)}</span
				>
			</div>

			<div
				class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
			>
				{#each paginatedEvents as event (event.id)}
					<div
						animate:flip={{ duration: 400 }}
						in:fade={{ duration: 300 }}
					>
						<ResourceCard
							image={event.image || ""}
							title={event.title}
							status={event.status}
							subtitle={event.location}
							description={event.description}
							price={event.price}
							type={event.category}
							stats={[
								{ icon: Calendar, value: event.date },
								{ icon: Users, value: event.attendees },
							]}
							onView={() => handleViewDetails(event)}
						/>
					</div>
				{/each}
			</div>

			<!-- Empty State -->
			{#if filteredEvents.length === 0}
				<div
					class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-gray-800 dark:bg-gray-900/50"
				>
					<div class="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
						<Calendar class="h-8 w-8 text-gray-400" />
					</div>
					<h3
						class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
					>
						No events found
					</h3>
					<p class="mt-2 text-gray-500 dark:text-gray-400">
						Try adjusting your search or filters to find what you're
						looking for.
					</p>
					<Button
						variant="outline"
						disabled={false}
						onclick={clearAllTags}
						class="mt-6"
					>
						Clear all filters
					</Button>
				</div>
			{/if}

			<!-- Pagination -->
			{#if filteredEvents.length > 0}
				<div class="flex justify-center pt-8">
					<Pagination.Root
						count={filteredEvents.length}
						perPage={itemsPerPage}
						bind:page={currentPage}
						class=""
					>
						{#snippet children({
							pages,
							currentPage: paginationCurrentPage,
						})}
							<Pagination.Content class="">
								<Pagination.Item class="">
									<Pagination.PrevButton
										children={null}
										class=""
									/>
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
												isActive={paginationCurrentPage ===
													page.value}
												class=""
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item class="">
									<Pagination.NextButton
										children={null}
										class=""
									/>
								</Pagination.Item>
							</Pagination.Content>
						{/snippet}
					</Pagination.Root>
				</div>
			{/if}
		</div>
	</div>
</div>
