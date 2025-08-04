<script lang="ts">
	import AppEventCard from "$lib/components/app-event-card.svelte";
	import AppEventDetailsModal from "$lib/components/app-event-details-modal.svelte";
	import { Button } from "$lib/components/ui/button";
	// Import Svelte's transition and animation functions
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let selectedEvent = $state(null);
	let showModal = $state(false);
	let selectedTags = $state([]);
	let showLocationDropdown = $state(false);
	let showEventSizeDropdown = $state(false);
	let showTagsDropdown = $state(false);

	const events = [
		{
			id: 1,
			title: "Tech Conference 2024",
			date: "July 15, 2024",
			location: "Grand Ballroom",
			attendees: "500 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/tech.jpg",
			description: "Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities.",
			organizer: "Tech Events Inc.",
			price: "$299",
			category: "Technology",
			tags: ["Technology", "Conference", "Networking"]
		},
		{
			id: 2,
			title: "Summer Music Festival",
			date: "August 20, 2024",
			location: "Central Park",
			attendees: "10000 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/music.jpeg",
			description: "Three days of amazing music, food, and entertainment in the heart of the city.",
			organizer: "Music Events Co.",
			price: "$199",
			category: "Music",
			tags: ["Music", "Festival", "Outdoor"]
		},
		{
			id: 3,
			title: "Art Exhibition",
			date: "September 5, 2024",
			location: "City Art Gallery",
			attendees: "200 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/art.jpg",
			description: "A stunning collection of contemporary art from local and international artists.",
			organizer: "Art Gallery Network",
			price: "$99",
			category: "Art",
			tags: ["Art", "Exhibition", "Culture"]
		},
		{
			id: 4,
			title: "Ramadan Iftar Gathering",
			date: "April 10, 2024",
			location: "Community Center",
			attendees: "150 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/Iftar.jpg",
			description: "Join us for a community iftar to break fast together during the holy month of Ramadan. Enjoy traditional foods and meaningful conversation.",
			organizer: "Sohbet Society",
			price: "Free",
			category: "Cultural",
			tags: ["Cultural", "Community", "Religious"]
		}
	];

	// Dropdown options
	const locationOptions = [
		"All Locations",
		"Grand Ballroom", 
		"Central Park", 
		"City Art Gallery",
		"Convention Center",
		"Downtown Plaza"
	];

	const eventSizeOptions = [
		"All Sizes",
		"Small (0-100)",
		"Medium (101-1000)", 
		"Large (1000+)",
		"Mega (5000+)"
	];

	// Tüm unique tag'ları topla
	const allTags = $derived([...new Set(events.flatMap(event => event.tags || []))]);

	// Filtrelenmiş event'lar
	const filteredEvents = $derived(
		selectedTags.length === 0 
			? events 
			: events.filter(event => 
				selectedTags.some(tag => event.tags?.includes(tag))
			)
	);

	function handleViewDetails(event) {
		selectedEvent = event;
		showModal = true;
	}

	function toggleTag(tag) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function clearAllTags() {
		selectedTags = [];
		showTagsDropdown = false;
	}

	function selectLocation(location) {
		console.log("Selected location:", location);
		showLocationDropdown = false;
	}

	function selectEventSize(size) {
		console.log("Selected event size:", size);
		showEventSizeDropdown = false;
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			showLocationDropdown = false;
			showEventSizeDropdown = false;
			showTagsDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="p-6 space-y-6">
	<!-- Page title -->
	<h1 class="text-3xl font-bold tracking-tight">Events</h1>

	<!-- Search bar -->
	<div class="relative">
		<input
			type="text"
			placeholder="🔍 Search events"
			class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
		/>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-4">
		<!-- Location Dropdown -->
		<div class="relative dropdown-container">
			<Button 
				variant="outline" 
				onclick={() => showLocationDropdown = !showLocationDropdown}
				class="flex items-center gap-2"
				disabled={false}
			>
				Location 
				<span class="transform transition-transform {showLocationDropdown ? 'rotate-180' : ''}">⌄</span>
			</Button>
			
			{#if showLocationDropdown}
				<div class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
					{#each locationOptions as location}
						<button
							onclick={() => selectLocation(location)}
							class="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md transition-colors"
						>
							{location}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Event Size Dropdown -->
		<div class="relative dropdown-container">
			<Button 
				variant="outline" 
				onclick={() => showEventSizeDropdown = !showEventSizeDropdown}
				class="flex items-center gap-2"
				disabled={false}
			>
				Event Size 
				<span class="transform transition-transform {showEventSizeDropdown ? 'rotate-180' : ''}">⌄</span>
			</Button>
			
			{#if showEventSizeDropdown}
				<div class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
					{#each eventSizeOptions as size}
						<button
							onclick={() => selectEventSize(size)}
							class="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md transition-colors"
						>
							{size}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Tags Dropdown -->
		<div class="relative dropdown-container">
			<Button 
				variant="outline" 
				onclick={() => showTagsDropdown = !showTagsDropdown}
				class="flex items-center gap-2"
				disabled={false}
			>
				Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
				<span class="transform transition-transform {showTagsDropdown ? 'rotate-180' : ''}">⌄</span>
			</Button>
			
			{#if showTagsDropdown}
				<div class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">				
					<!-- Tag options -->
					<div class="p-2 border-b border-gray-100">
						{#each allTags as tag}
							<button
								onclick={() => toggleTag(tag)}
								class="w-full px-3 py-2 text-left rounded-md transition-colors flex items-center justify-between
									{selectedTags.includes(tag) 
										? 'bg-primary text-primary-foreground' 
										: 'hover:bg-gray-100'
									}"
							>
								<span>{tag}</span>
								{#if selectedTags.includes(tag)}
									<span class="text-sm">✓</span>
								{/if}
							</button>
						{/each}
					</div>
					
					<!-- Clear button -->
					{#if selectedTags.length > 0}
						<div class="p-2 space-y-1">
							<button 
								onclick={clearAllTags}
								class="text-xs text-red-500 hover:text-red-700 underline"
							>
								Clear All ({selectedTags.length})
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Event cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
		{#each filteredEvents as event (event.id)}
			<div 
				animate:flip={{duration: 500}}
				in:fade={{duration: 300}}
				out:fade={{duration: 200}}
			>
				<AppEventCard
					{event}
					onclick={handleViewDetails}
				/>
			</div>
		{/each}
	</div>

	<!-- No results message -->
	{#if filteredEvents.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No events found with selected tags.</p>
			<button onclick={clearAllTags} class="text-primary hover:underline mt-2">
				Clear filters
			</button>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal && selectedEvent}
	<AppEventDetailsModal bind:open={showModal} event={selectedEvent} />
{/if}
