<script lang="ts">
	import AppOrganiserCard from "$lib/components/app-organiser-card.svelte";
	import AppOrganiserDetailsModal from "$lib/components/app-organiser-details-modal.svelte";

	import AppSearchBar from "$lib/components/app-search-bar.svelte";
	import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
	// Remove this import:
	// import AppFilterTags from "$lib/components/app-filter-tags.svelte";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import { Button } from "$lib/components/ui/button";
	// Import Svelte's transition and animation functions
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Building2, MapPin, Award, Search, TagIcon } from "lucide-svelte";
	
	let searchQuery = $state("");

	let selectedTags = $state([]);
	let selectedLocations = $state([]); // Changed from selectedLocation to selectedLocations array
	let selectedOrganiser = $state(null);
	let isModalOpen = $state(false);

	function handleViewDetails(organiser) {
		selectedOrganiser = organiser;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		// Use setTimeout to ensure the modal animation completes before clearing the organiser
		setTimeout(() => {
			selectedOrganiser = null;
		}, 150);
	}
	
	// Pagination state variables
    let currentPage = $state(1);
    let itemsPerPage = $state(6);

	// Add state to track which dropdown is currently open
	let activeDropdown = $state(null); // 'location' | 'tags' | null

	// Sample organisers data with updated image paths
	const organisers = [
		{
			id: 1,
			name: "Tech Events Inc.",
			location: "San Francisco, CA",
			tag: "Technology",
			eventsCount: "12 Events",
			rating: 4.8,
			image: "/images/companyImages/Company_A.jpg",
			featured: true,
			bio: "Leading technology event organiser specializing in conferences, workshops, and networking events for tech professionals.",
			socialMedia: {
				twitter: "@techevents",
				linkedin: "techevents",
				website: "www.techevents.com"
			},
			contact: {
				email: "info@techevents.com",
				phone: "+1 (555) 123-4567"
			},
			tags: ["Technology", "Networking", "Professional"]
		},
		{
			id: 2,
			name: "Music Events Co.",
			location: "Austin, TX",
			tag: "Music",
			eventsCount: "24 Events",
			rating: 4.6,
			image: "/images/companyImages/Company_B.jpg",
			featured: true,
			bio: "Creating unforgettable music experiences from intimate venues to large-scale festivals across the country.",
			socialMedia: {
				twitter: "@musiceventsco",
				instagram: "musiceventsco",
				website: "www.musiceventsco.com"
			},
			contact: {
				email: "bookings@musiceventsco.com",
				phone: "+1 (555) 987-6543"
			},
			tags: ["Music", "Entertainment", "Festivals"]
		},
		{
			id: 3,
			name: "Mentor Wise",
			location: "London, UK",
			tag: "Education",
			eventsCount: "8 Events",
			rating: 4.9,
			image: "/images/companyImages/MentorWise.png",
			featured: false,
			bio: "Empowering the next generation through mentorship programs, workshops, and community engagement to foster personal and professional growth.",
			socialMedia: {
				instagram: "mentorwise",
				facebook: "mentorwise",
				website: "www.mentor.org.uk"
			},
			contact: {
				email: "info@mentorwise.org",
				phone: "+1 (555) 456-7890"
			},
			tags: ["Art", "Culture", "Exhibition"]
		},
		{
			id: 4,
			name: "Sohbet Society",
			location: "Istanbul, Turkey", 
			tag: "Cultural",
			eventsCount: "15 Events",
			rating: 4.7,
			image: "/images/companyImages/SohbetSociety.png",
			featured: true,
			bio: "Bringing people together through cultural exchange, conversation, and community-building events that celebrate diversity and heritage.",
			socialMedia: {
				twitter: "@sohbetsociety",
				instagram: "sohbetsociety",
				website: "www.sohbetsociety.org"
			},
			contact: {
				email: "connect@sohbetsociety.org",
				phone: "+90 (212) 555-1234"
			},
			tags: ["Cultural", "Community", "Education"]
		},
		{
			id: 5,
			name: "Sports United",
			location: "Chicago, IL",
			tag: "Sports",
			eventsCount: "20 Events",
			rating: 4.5,
			image: "/images/companyImages/SportsUnited.png",
			featured: false,
			bio: "Uniting communities through sports events, tournaments, and fitness challenges for all skill levels and ages.",
			socialMedia: {
				twitter: "@sportsunited",
				instagram: "sportsunited",
				website: "www.sportsunited.com"
			},
			contact: {
				email: "info@sportsunited.com",
				phone: "+1 (312) 555-7890"
			},
			tags: ["Sports", "Community", "Health"]
		},
		{
			id: 6,
			name: "Foodie Festivals",
			location: "New York, NY",
			tag: "Food & Drink",
			eventsCount: "30 Events",
			rating: 4.9,
			image: "/images/companyImages/FoodieFestivals.png",
			featured: true,
			bio: "Curating exceptional culinary experiences through food festivals, tasting events, and cooking workshops.",
			socialMedia: {
				twitter: "@foodiefests",
				instagram: "foodiefestivals",
				website: "www.foodiefestivals.com"
			},
			contact: {
				email: "taste@foodiefestivals.com",
				phone: "+1 (212) 555-3456"
			},
			tags: ["Food & Drink", "Culture", "Entertainment"]
		},
		{
			id: 7,
			name: "Art Collective",
			location: "Los Angeles, CA",
			tag: "Art",
			eventsCount: "18 Events",
			rating: 4.6,
			image: "/images/companyImages/ArtCollective.png",
			featured: false,
			bio: "Supporting emerging artists through exhibitions, galleries, and interactive art experiences.",
			socialMedia: {
				twitter: "@artcollective",
				instagram: "artcollectivela",
				website: "www.artcollective.org"
			},
			contact: {
				email: "create@artcollective.org",
				phone: "+1 (323) 555-9012"
			},
			tags: ["Art", "Culture", "Entertainment"]
		},
		{
			id: 8,
			name: "Business Summit",
			location: "London, UK",
			tag: "Business",
			eventsCount: "25 Events",
			rating: 4.8,
			image: "/images/companyImages/BusinessSummit.png",
			featured: true,
			bio: "Connecting industry leaders through professional conferences, networking events, and business workshops.",
			socialMedia: {
				twitter: "@bizsummit",
				linkedin: "businesssummit",
				website: "www.businesssummit.co.uk"
			},
			contact: {
				email: "contact@businesssummit.co.uk",
				phone: "+44 20 7123 4567"
			},
			tags: ["Business", "Professional", "Networking"]
		},
		{
			id: 9,
			name: "Green Events",
			location: "San Francisco, CA",
			tag: "Environment",
			eventsCount: "22 Events",
			rating: 4.7,
			image: "/images/companyImages/GreenEvents.png",
			featured: false,
			bio: "Promoting sustainability through eco-friendly events, environmental workshops, and green technology showcases.",
			socialMedia: {
				twitter: "@greenevents",
				instagram: "greeneventssf",
				website: "www.greenevents.org"
			},
			contact: {
				email: "sustainable@greenevents.org",
				phone: "+1 (415) 555-6789"
			},
			tags: ["Environment", "Technology", "Education"]
		}
	];

	// Get all unique tags
	//const allTags = $derived([...new Set(organisers.flatMap(organiser => organiser.tags || []))]);

	// Filter organisers based on search query and selected tags
	// Update the filter logic to handle multiple locations
	const filteredOrganisers = $derived(
		organisers
			.filter(organiser => {
			const matchesSearch = searchQuery === "" || 
				organiser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				organiser.location.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesTags = selectedTags.length === 0 ||
				selectedTags.some(tag => organiser.tags?.includes(tag));

			// Updated location filter logic
			const matchesLocation = selectedLocations.length === 0 ||
				selectedLocations.some(loc => organiser.location.includes(loc));

			return matchesSearch && matchesTags && matchesLocation;
			})
			.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)) // Featured come first
		);


	// Reset to page 1 when filters change
	$effect(() => {
		// Watch for changes in filters
		searchQuery;
		selectedTags;
		selectedLocations;
		
		// Reset to page 1 when any filter changes
		currentPage = 1;
	});

    // Derived store for paginated organisers (fix variable name)
    const paginatedOrganisers = $derived(
		filteredOrganisers.slice(
			(currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
		)
	);



	function toggleCategory(tag) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(c => c !== tag);
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

	// Configuration variables for number of options to show
	const maxTagsToShow = 6;
	const maxLocationsToShow = 6;

	// Function to calculate most popular options based on frequency
	function getMostPopularOptions(data, field, maxCount = 6) {
		const frequency = {};
		
		// Count frequency of each option
		data.forEach(item => {
			if (field === 'tags' && item.tags && Array.isArray(item.tags)) {
				item.tags.forEach(tag => {
					frequency[tag] = (frequency[tag] || 0) + 1;
				});
			} else if (field === 'location' && item.location) {
				frequency[item.location] = (frequency[item.location] || 0) + 1;
			}
		});
		
		// Sort by frequency and return top X
		return Object.entries(frequency)
			.sort(([,a], [,b]) => Number(b) - Number(a))
			.slice(0, maxCount)
			.map(([option]) => option);
	}

	// Replace static options with dynamic popular options
	const locationOptions = getMostPopularOptions(organisers, 'location', maxLocationsToShow);
	const tagOptions = getMostPopularOptions(organisers, 'tags', maxTagsToShow);

	// Modified click outside handler
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			closeAllDropdowns();
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="p-6 space-y-6">
	<!-- Page title -->
	<h1 class="text-3xl font-bold tracking-tight">Organisers</h1>

	<!-- Search bar -->
	<AppSearchBar
		bind:value={searchQuery}
		placeholder="Search organisers by name or location"
		showIcon={true}
	/>

	<!-- Filters -->
	<div class="flex flex-wrap gap-4">
		<!-- Location Dropdown -->
		<div class="dropdown-container">
			<AppFilterDropdown
				bind:selectedValues={selectedLocations}
				options={locationOptions}
				label="Location"
				icon={MapPin}
				isOpen={activeDropdown === 'location'}
				onToggle={() => handleDropdownToggle('location')}
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

	<!-- Results Info -->
  <div class="flex items-center justify-between text-sm text-gray-600">
    <span>
      Showing {paginatedOrganisers.length} of {filteredOrganisers.length} organisers
    </span>
    <span>
      Page {currentPage} of {Math.ceil(filteredOrganisers.length / itemsPerPage)}
    </span>
  </div>

	<!-- Organiser cards (including featured) -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
		{#each paginatedOrganisers as organiser (organiser.id)}
			<div 
				animate:flip={{duration: 500}}
                in:fade={{duration: 300}}
			>
				<AppOrganiserCard
					{organiser}
					featured={organiser.featured}
					onclick={() => handleViewDetails(organiser)}
				/>
			</div>
		{/each}
	</div>
	<!-- No results message -->
	{#if filteredOrganisers.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No organisers found with selected filters.</p>
			<button onclick={clearAllTags} class="text-primary hover:underline mt-2">
				Clear filters
			</button>
		</div>
	{/if}

	<Pagination.Root
		class=""
		count={filteredOrganisers.length} 
		perPage={itemsPerPage}
		bind:page={currentPage}
	>
		{#snippet children({ pages, currentPage: paginationCurrentPage })}
		  <Pagination.Content class="">
			<Pagination.Item>
			  <Pagination.PrevButton class="" children={null}/>
			</Pagination.Item>
			{#each pages as page (page.key)}
			  {#if page.type === "ellipsis"}
				<Pagination.Item class="bg-primary text-white">
				  <Pagination.Ellipsis class=""/>
				</Pagination.Item>
			  {:else}
				<Pagination.Item>
				  <Pagination.Link class="" {page} isActive={paginationCurrentPage === page.value}>
					{page.value}
				  </Pagination.Link>
				</Pagination.Item>
			  {/if}
			{/each}
			<Pagination.Item>
			  <Pagination.NextButton class="" children={null}/>
			</Pagination.Item>
		  </Pagination.Content>
		{/snippet}
	</Pagination.Root>

	<!-- Modal -->
	{#if selectedOrganiser}
		<AppOrganiserDetailsModal
			organiser={selectedOrganiser}
			bind:open={isModalOpen}
		/>
	{/if}
</div>