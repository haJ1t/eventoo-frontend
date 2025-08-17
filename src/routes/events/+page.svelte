<script lang="ts">
	import AppEventCard from "$lib/components/app-event-card.svelte";
	import AppEventDetailsModal from "$lib/components/app-event-details-modal.svelte";
	import AppSearchBar from "$lib/components/app-search-bar.svelte";
	import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
	// Remove this import:
	// import AppFilterTags from "$lib/components/app-filter-tags.svelte";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import { MapPin, User, User2, Tag } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { goto } from '$app/navigation';
	// Import Svelte's transition and animation functions
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
    import { TagIcon } from "lucide-svelte";

	let searchQuery = $state("");
	let showModal = $state(false);
    let selectedEvent = $state(null);
	let selectedTags = $state([]);
	let selectedLocations = $state([]);
	let selectedEventSizes = $state([]);
	// Add state to track which dropdown is currently open
	let activeDropdown = $state(null); // 'location' | 'tags' | null

	// Pagination state variables
    let currentPage = $state(1);
    let itemsPerPage = $state(4);

	const events = [
		{
			id: 1,
			title: "Tech Conference 2024",
			date: "July 15, 2024",
			location: "San Francisco, CA",
			size: "Medium (101-1000)",
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
			location: "New York, NY",
			size: "Mega (5000+)",
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
			location: "London, UK",
			size: "Medium (101-1000)",
			attendees: "200 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/art.jpg",
			description: "A stunning collection of contemporary art from local and international artists.",
			organizer: "Art Gallery Network",
			price: "$99",
			category: "Art",
			tags: ["Art", "Exhibition", "Cultural"]
		},
		{
			id: 4,
			title: "Ramadan Iftar Gathering",
			date: "April 10, 2024",
			location: "Istanbul, Turkey",
			size: "Small (0-100)",
			attendees: "100 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/Iftar.jpg",
			description: "Join us for a community iftar to break fast together during the holy month of Ramadan. Enjoy traditional foods and meaningful conversation.",
			organizer: "Sohbet Society",
			price: "Free",
			category: "Cultural",
			tags: ["Cultural", "Community", "Religious"]
		},
		{
			id: 5,
			title: "Startup Pitch Night",
			date: "May 15, 2024",
			location: "Austin, TX",
			size: "Medium (101-1000)",
			attendees: "300 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/startup.jpg",
			description: "Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and venture capitalists in Austin's thriving tech scene.",
			organizer: "Austin Startup Hub",
			price: "$50",
			category: "Technology",
			tags: ["Technology", "Networking", "Business"]
		},
		{
			id: 6,
			title: "Food & Wine Festival",
			date: "June 8, 2024",
			location: "Los Angeles, CA",
			size: "Large (1000+)",
			attendees: "2500 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/food.jpg",
			description: "Experience culinary excellence with tastings from top chefs, wine pairings, and cooking demonstrations. A feast for all your senses!",
			organizer: "LA Culinary Arts",
			price: "$150",
			category: "Food & Drink",
			tags: ["Food & Drink", "Festival", "Cultural"]
		},
		{
			id: 7,
			title: "Digital Art Exhibition",
			date: "July 1, 2024",
			location: "London, UK",
			size: "Medium (101-1000)",
			attendees: "500 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/digital-art.jpg",
			description: "Immerse yourself in the future of art with interactive installations, NFT galleries, and virtual reality experiences.",
			organizer: "Digital Arts Collective",
			price: "$25",
			category: "Art",
			tags: ["Art", "Technology", "Exhibition"]
		},
		{
			id: 8,
			title: "Wellness & Yoga Retreat",
			date: "August 15, 2024",
			location: "San Francisco, CA",
			size: "Small (0-100)",
			attendees: "50 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/yoga.jpg",
			description: "A weekend of mindfulness, yoga sessions, meditation workshops, and healthy living discussions in a peaceful urban setting.",
			organizer: "Mindful Living Co",
			price: "$199",
			category: "Wellness",
			tags: ["Wellness", "Community", "Workshop"]
		}
	];

	// Dropdown options
		const locationOptions = [
		"San Francisco, CA",
		"Austin, TX",
		"New York, NY",
		"Los Angeles, CA",
		"London, UK",
		"Istanbul, Turkey"
	];

	const eventSizeOptions = [
		"Small (0-100)",
		"Medium (101-1000)", 
		"Large (1000+)",
		"Mega (5000+)"
	];

	// tag options
	const tagOptions = [
		"Technology",
		"Music",
		"Art",
		"Food & Drink",
		"Religious",
		"Cultural",
		"Networking",
		"Festival",
		"Exhibition"
	];

	// Get all unique tags
	//const allTags = $derived([...new Set(events.flatMap(event => event.tags || []))]);

	// Filter organisers based on search query and selected tags
	const filteredEvents = $derived(
		events
			.filter(event => {
			const matchesSearch = searchQuery === "" || 
				event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				event.location.toLowerCase().includes(searchQuery.toLowerCase());
			
			// Updated tag filter logic
			const matchesTags = selectedTags.length === 0 ||
				selectedTags.some(tag => event.tags?.includes(tag));

			// Updated size filter logic
			const matchesSize = selectedEventSizes.length === 0 ||
				selectedEventSizes.some(size => event.size.includes(size));
						
			// Updated location filter logic
			const matchesLocation = selectedLocations.length === 0 ||
				selectedLocations.some(loc => event.location.includes(loc));

			return matchesSearch && matchesTags && matchesSize && matchesLocation;
			})
		);

	// Reset to page 1 when filters change
	$effect(() => {
		// Watch for changes in filters
		searchQuery;
		selectedTags;
		selectedLocations;
		selectedEventSizes;
		
		// Reset to page 1 when any filter changes
		currentPage = 1;
	});

    // Derived store for paginated events
    const paginatedEvents = $derived(
		filteredEvents.slice(
			(currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
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
		activeDropdown = null;
	}

	function selectLocation(location) {
		console.log("Selected location:", location);
		activeDropdown = null;
	}

	function selectEventSize(size) {
		console.log("Selected event size:", size);
		activeDropdown = null;
	}

	// Modified function to handle dropdown coordination
	function handleDropdownToggle(dropdownType) {
		if (activeDropdown === dropdownType) {
			activeDropdown = null;
		} else {
			activeDropdown = dropdownType;
		}
	}

	// Close all dropdowns
	function closeAllDropdowns() {
		activeDropdown = null;
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			activeDropdown = null;
		}
	}

	// Remove the handlePageChange and handlePerPageChange functions - they're not needed

	function navigateToAddEvent() {
		goto('/events/add');
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="p-6 space-y-6">
	<!-- Page title ve Add Event butonu -->
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold tracking-tight">Events</h1>
		<Button onclick={navigateToAddEvent} disabled={false} class="flex items-center gap-2">
			<span class="text-lg">+</span>
			Add Event
		</Button>
	</div>

	<!-- Search bar -->
	<div class="relative">
			<AppSearchBar
			bind:value={searchQuery}
			placeholder="Search organisers by name or location"
			showIcon={true}
		/>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-4">
		<!-- Location Dropdown -->
		<div class="relative dropdown-container">
			<AppFilterDropdown
				bind:selectedValues={selectedLocations}
				options={locationOptions}
				label="Location"
				icon={MapPin}
				isOpen={activeDropdown === 'location'}
				onToggle={() => handleDropdownToggle('location')}
			/>
		</div>

		<!-- Event Size Dropdown -->
		<div class="relative dropdown-container">
			<AppFilterDropdown
            	bind:selectedValues={selectedEventSizes}
				options={eventSizeOptions}
				label="Event Size"
				icon={User2}
				isOpen={activeDropdown === 'size'}
				onToggle={() => handleDropdownToggle('size')}
			/>
		</div>

		<!-- Tags Dropdown -->
		<div class="dropdown-container">
			<AppFilterDropdown
				bind:selectedValues={selectedTags}
				options={tagOptions}
				label="Tags"
				icon={TagIcon}
				isOpen={activeDropdown === 'tags'}
				onToggle={() => handleDropdownToggle('tags')}
			/>
		</div>
	</div>

	<div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Showing {paginatedEvents.length} of {filteredEvents.length} events
        </p>
    </div>

	<!-- Event cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {#each paginatedEvents as event (event.id)}
            <div 
                animate:flip={{duration: 500}}
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

	<Pagination.Root 
		count={filteredEvents.length} 
		perPage={itemsPerPage}
		bind:page={currentPage}
	>
		{#snippet children({ pages, currentPage: paginationCurrentPage })}
		  <Pagination.Content>
			<Pagination.Item>
			  <Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
			  {#if page.type === "ellipsis"}
				<Pagination.Item class="bg-primary text-white">
				  <Pagination.Ellipsis />
				</Pagination.Item>
			  {:else}
				<Pagination.Item>
				  <Pagination.Link {page} isActive={paginationCurrentPage === page.value}>
					{page.value}
				  </Pagination.Link>
				</Pagination.Item>
			  {/if}
			{/each}
			<Pagination.Item>
			  <Pagination.NextButton />
			</Pagination.Item>
		  </Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>



<!-- Modal -->
{#if showModal && selectedEvent}
	<AppEventDetailsModal bind:open={showModal} event={selectedEvent} />
{/if}
