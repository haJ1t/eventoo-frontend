<script lang="ts">
	import AppOrganiserCard from "$lib/components/app-organiser-card.svelte";
	import AppOrganiserDetailsModal from "$lib/components/app-organiser-details-modal.svelte";
	import { Button } from "$lib/components/ui/button";
	// Import Svelte's transition and animation functions
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Building2, MapPin, Award, Search } from "lucide-svelte";

	let selectedOrganiser = $state(null);
	let showModal = $state(false);
	let selectedCategories = $state([]);
	let showLocationDropdown = $state(false);
	let showCategoryDropdown = $state(false);
	let searchQuery = $state("");

	// Sample organisers data with updated image paths
	const organisers = [
		{
			id: 1,
			name: "Tech Events Inc.",
			location: "San Francisco, CA",
			category: "Technology",
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
			categories: ["Technology", "Networking", "Professional"]
		},
		{
			id: 2,
			name: "Music Events Co.",
			location: "Austin, TX",
			category: "Music",
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
			categories: ["Music", "Entertainment", "Festivals"]
		},
		{
			id: 3,
			name: "Mentor Wise",
			location: "London, UK",
			category: "Education",
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
			categories: ["Art", "Culture", "Exhibition"]
		},
		{
			id: 4,
			name: "Sohbet Society",
			location: "Istanbul, Turkey",
			category: "Cultural",
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
			categories: ["Cultural", "Community", "Education"]
		}
	];

	// Location options
	const locationOptions = [
		"All Locations",
		"San Francisco, CA",
		"Austin, TX",
		"New York, NY",
		"Chicago, IL",
		"Los Angeles, CA"
	];

	// Category options
	const categoryOptions = [
		"Technology",
		"Music",
		"Art",
		"Food & Drink",
		"Sports",
		"Business",
		"Education",
		"Entertainment"
	];

	// Get all unique categories
	const allCategories = $derived([...new Set(organisers.flatMap(organiser => organiser.categories || []))]);

	// Filter organisers based on search query and selected categories
	const filteredOrganisers = $derived(
		organisers
			.filter(organiser => {
			const matchesSearch = searchQuery === "" || 
				organiser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				organiser.location.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategories = selectedCategories.length === 0 ||
				selectedCategories.some(cat => organiser.categories?.includes(cat));

			return matchesSearch && matchesCategories;
			})
			.sort((a, b) => b.featured - a.featured) // Featured come first
		);


	// Featured organisers
	const featuredOrganisers = $derived(
		organisers.filter(organiser => organiser.featured)
	);

	function handleViewDetails(organiser) {
		selectedOrganiser = organiser;
		showModal = true;
	}

	function toggleCategory(category) {
		if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter(c => c !== category);
		} else {
			selectedCategories = [...selectedCategories, category];
		}
	}

	function clearAllCategories() {
		selectedCategories = [];
		showCategoryDropdown = false;
	}

	function selectLocation(location) {
		console.log("Selected location:", location);
		showLocationDropdown = false;
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			showLocationDropdown = false;
			showCategoryDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="p-6 space-y-6">
	<!-- Page title -->
	<h1 class="text-3xl font-bold tracking-tight">Organisers</h1>



	<!-- Search bar -->
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="h-5 w-5 text-gray-400" />
		</div>
		<input
			type="text"
			placeholder="Search organisers by name or location"
			class="w-full pl-10 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
			bind:value={searchQuery}
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
			>
				<MapPin class="h-4 w-4" />
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

		<!-- Category Dropdown -->
		<div class="relative dropdown-container">
			<Button 
				variant="outline" 
				onclick={() => showCategoryDropdown = !showCategoryDropdown}
				class="flex items-center gap-2"
			>
				<Building2 class="h-4 w-4" />
				Category {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}
				<span class="transform transition-transform {showCategoryDropdown ? 'rotate-180' : ''}">⌄</span>
			</Button>
			
			{#if showCategoryDropdown}
				<div class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
					<!-- Category options -->
					<div class="p-2 border-b border-gray-100">
						{#each allCategories as category}
							<button
								onclick={() => toggleCategory(category)}
								class="w-full px-3 py-2 text-left rounded-md transition-colors flex items-center justify-between
									{selectedCategories.includes(category) 
										? 'bg-primary text-primary-foreground' 
										: 'hover:bg-gray-100'
									}"
							>
								<span>{category}</span>
								{#if selectedCategories.includes(category)}
									<span class="text-sm">✓</span>
								{/if}
							</button>
						{/each}
					</div>
					
					<!-- Clear button -->
					{#if selectedCategories.length > 0}
						<div class="p-2 space-y-1">
							<button 
								onclick={clearAllCategories}
								class="text-xs text-red-500 hover:text-red-700 underline"
							>
								Clear All ({selectedCategories.length})
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Organiser cards (including featured) -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
		{#each filteredOrganisers as organiser (organiser.id)}
			<div 
				animate:flip={{duration: 500}}
				in:fade={{duration: 300}}
				out:fade={{duration: 200}}
			>
				<AppOrganiserCard
					{organiser}
					onclick={handleViewDetails}
					featured={organiser.featured}
				/>
			</div>
		{/each}
	</div>
	


	<!-- No results message -->
	{#if filteredOrganisers.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No organisers found with selected filters.</p>
			<button onclick={clearAllCategories} class="text-primary hover:underline mt-2">
				Clear filters
			</button>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal && selectedOrganiser}
	<AppOrganiserDetailsModal bind:open={showModal} organiser={selectedOrganiser} />
{/if}