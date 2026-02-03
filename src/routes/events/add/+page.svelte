<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { ArrowLeft, Calendar } from "@lucide/svelte";
	import FileUpload from "$lib/components/file-upload.svelte";
	import { createEvent, fetchVenues, fetchOrganizers, type Venue, type Organizer } from "$lib/services/api";

	// Loaded data from API
	let venues = $state<Venue[]>([]);
	let organizers = $state<Organizer[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Form state
	let formData = $state({
		title: "",
		date: "",
		startTime: "09:00",
		endTime: "17:00",
		venueId: "" as string | number,
		locationOverride: "",
		attendees: "",
		description: "",
		organizerId: "" as string | number,
		price: "",
		category: "",
		tags: [] as string[],
		image: "",
	});

	let selectedTags = $state<string[]>([]);
	let showTagsDropdown = $state(false);
	let isSubmitting = $state(false);
	let customTagInput = $state("");

	// Load venues and organizers on mount
	onMount(async () => {
		try {
			const [venuesData, organizersData] = await Promise.all([
				fetchVenues(),
				fetchOrganizers()
			]);
			venues = venuesData;
			organizers = organizersData;
		} catch (err) {
			console.error("Failed to load data:", err);
			error = "Failed to load venues and organizers";
		} finally {
			isLoading = false;
		}
	});

	// Predefined options
	const categoryOptions = [
		"Technology",
		"Music",
		"Art",
		"Cultural",
		"Sports",
		"Business",
		"Education",
		"Health",
		"Food",
		"Entertainment",
	];

	const availableTags = [
		"Technology",
		"Conference",
		"Networking",
		"Music",
		"Festival",
		"Outdoor",
		"Art",
		"Exhibition",
		"Culture",
		"Community",
		"Religious",
		"Workshop",
		"Seminar",
		"Competition",
		"Charity",
	];

	function toggleTag(tag) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		formData.tags = selectedTags;
	}

	function addCustomTag() {
		const trimmedTag = customTagInput.trim();
		if (trimmedTag && !selectedTags.includes(trimmedTag)) {
			selectedTags = [...selectedTags, trimmedTag];
			formData.tags = selectedTags;
			customTagInput = "";
		}
	}

	function handleCustomTagKeydown(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			addCustomTag();
		}
	}

	function handleImageUpload(event) {
		const { files } = event.detail;
		if (files) {
			// In a real application, you would upload the file here
			// For now, using placeholder image
			formData.image = "/images/eventImages/placeholder.jpg";
			console.log("File selected:", files);
		}
	}

	function normalizeId(value: string | number | null | undefined) {
		if (value === null || value === undefined || value === "") return null;
		if (typeof value === "number") return value;
		const parsed = Number(value);
		return Number.isNaN(parsed) ? value : parsed;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			// Form validation
			if (!formData.title || !formData.date) {
				alert("Please fill in all required fields (Title and Date)");
				isSubmitting = false;
				return;
			}

			// Need either venue or location override
			if (!formData.venueId && !formData.locationOverride) {
				alert("Please select a venue or enter a custom location");
				isSubmitting = false;
				return;
			}

			// Need organizer
			if (!formData.organizerId) {
				alert("Please select an organizer");
				isSubmitting = false;
				return;
			}

			// Parse price (remove $ and convert to number)
			const priceValue = formData.price.replace(/[^0-9.]/g, '');
			const price = priceValue ? parseFloat(priceValue) : 0;

			// Parse max attendees
			const maxAttendees = formData.attendees.replace(/[^0-9]/g, '');

			// Build API payload
			const eventData = {
				title: formData.title,
				description: formData.description || undefined,
				event_date: formData.date,
				start_time: formData.startTime + ":00",
				end_time: formData.endTime + ":00",
				venue: normalizeId(formData.venueId),
				location_override: formData.locationOverride || undefined,
				organizer: normalizeId(formData.organizerId),
				image: formData.image || undefined,
				status: "Scheduled",
				category: formData.category || "General",
				price: price,
				tags: selectedTags,
				max_attendees: maxAttendees ? parseInt(maxAttendees) : 100,
			};

			await createEvent(eventData);

			// Redirect back to events page on success
			goto("/events");
		} catch (err: any) {
			console.error("Error creating event:", err);
			error = err.message || "Error creating event. Please try again.";
			alert(error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto("/events");
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest(".dropdown-container")) {
			showTagsDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="max-w-4xl mx-auto page-pad" in:fade={{ duration: 300 }}>
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-start gap-4">
			<Button
				variant="ghost"
				size="sm"
				onclick={handleCancel}
				class="h-9 w-9 p-0"
				disabled={false}
			>
				<ArrowLeft class="w-4 h-4" />
			</Button>
			<div class="flex items-start gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
				>
					<Calendar class="h-5 w-5" />
				</div>
				<div>
					<h1 class="text-3xl font-bold tracking-tight">
						Add New Event
					</h1>
					<p class="mt-1 text-gray-600">
						Create a new event and share it with the community.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Form -->
	<form onsubmit={handleSubmit} class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Event Title -->
			<div class="md:col-span-2">
				<label
					for="event-title"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Event Title *
				</label>
				<input
					id="event-title"
					type="text"
					bind:value={formData.title}
					placeholder="Enter event title"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					required
				/>
			</div>

			<!-- Date -->
			<div>
				<label
					for="event-date"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Date *
				</label>
				<input
					id="event-date"
					type="date"
					bind:value={formData.date}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					required
				/>
			</div>

			<!-- Start Time -->
			<div>
				<label
					for="event-start-time"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Start Time *
				</label>
				<input
					id="event-start-time"
					type="time"
					bind:value={formData.startTime}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					required
				/>
			</div>

			<!-- End Time -->
			<div>
				<label
					for="event-end-time"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					End Time *
				</label>
				<input
					id="event-end-time"
					type="time"
					bind:value={formData.endTime}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					required
				/>
			</div>

			<!-- Venue -->
			<div>
				<label
					for="event-venue"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Venue
				</label>
				<select
					id="event-venue"
					bind:value={formData.venueId}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					disabled={isLoading}
				>
					<option value="">Select venue (or use custom location below)</option>
					{#each venues as venue}
						<option value={venue.id}>{venue.name} - {venue.city}</option>
					{/each}
				</select>
			</div>

			<!-- Custom Location (if no venue selected) -->
			<div>
				<label
					for="event-location-override"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Custom Location
				</label>
				<input
					id="event-location-override"
					type="text"
					bind:value={formData.locationOverride}
					placeholder="Or enter custom location"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					disabled={!!formData.venueId}
				/>
			</div>

			<!-- Expected Attendees -->
			<div>
				<label
					for="event-attendees"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Expected Attendees
				</label>
				<input
					id="event-attendees"
					type="text"
					bind:value={formData.attendees}
					placeholder="e.g., 100 Attendees"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<!-- Price -->
			<div>
				<label
					for="event-price"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Price
				</label>
				<input
					id="event-price"
					type="text"
					bind:value={formData.price}
					placeholder="e.g., $99 or Free"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<!-- Category -->
			<div>
				<label
					for="event-category"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Category
				</label>
				<select
					id="event-category"
					bind:value={formData.category}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				>
					<option value="">Select category</option>
					{#each categoryOptions as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>

			<!-- Organizer -->
			<div>
				<label
					for="event-organizer"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Organizer *
				</label>
				<select
					id="event-organizer"
					bind:value={formData.organizerId}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					disabled={isLoading}
					required
				>
					<option value="">Select organizer</option>
					{#each organizers as org}
						<option value={org.id}>{org.organization_name || `${org.first_name} ${org.last_name}`}</option>
					{/each}
				</select>
			</div>

			<!-- Tags -->
			<div class="md:col-span-2">
				<label
					for="event-tags"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Tags
				</label>
				<div class="relative dropdown-container">
					<Button
						type="button"
						variant="outline"
						disabled={false}
						onclick={() => (showTagsDropdown = !showTagsDropdown)}
						class="flex items-center gap-2 w-full justify-between"
					>
						<span>
							{selectedTags.length > 0
								? `${selectedTags.length} tags selected`
								: "Select tags"}
						</span>
						<span
							class="transform transition-transform {showTagsDropdown
								? 'rotate-180'
								: ''}">⌄</span
						>
					</Button>

					{#if showTagsDropdown}
						<div
							class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto"
						>
							<!-- Custom tag input -->
							<div class="p-3 border-b border-gray-200">
								<div class="flex gap-2">
									<input
										type="text"
										bind:value={customTagInput}
										onkeydown={handleCustomTagKeydown}
										placeholder="Add custom tag..."
										class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
									/>
									<Button
										type="button"
										onclick={addCustomTag}
										disabled={!customTagInput.trim()}
										class="px-3 py-2 text-sm"
									>
										Add
									</Button>
								</div>
							</div>

							<!-- Predefined tags -->
							{#each availableTags as tag}
								<button
									type="button"
									onclick={() => toggleTag(tag)}
									class="w-full px-4 py-2 text-left rounded-none transition-colors flex items-center justify-between
										{selectedTags.includes(tag)
										? 'bg-primary text-primary-foreground'
										: 'hover:bg-gray-100'}"
								>
									<span>{tag}</span>
									{#if selectedTags.includes(tag)}
										<span class="text-sm">✓</span>
									{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Selected tags display -->
				{#if selectedTags.length > 0}
					<div class="flex flex-wrap gap-2 mt-2">
						{#each selectedTags as tag}
							<span
								class="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
							>
								{tag}
								<button
									type="button"
									onclick={() => toggleTag(tag)}
									class="hover:text-red-500 ml-1"
								>
									×
								</button>
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Event Image -->
			<div class="md:col-span-2">
				<span class="block text-sm font-medium text-gray-700 mb-2">
					Event Image
				</span>
				<FileUpload
					accept="image/*"
					maxSize={5 * 1024 * 1024}
					placeholder="Drag and drop your event image here, or click to browse"
					on:change={handleImageUpload}
				/>
				<p class="text-sm text-gray-500 mt-1">
					Upload an image for your event (optional)
				</p>
			</div>

			<!-- Description -->
			<div class="md:col-span-2">
				<label
					for="event-description"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Description
				</label>
				<textarea
					id="event-description"
					bind:value={formData.description}
					placeholder="Describe your event..."
					rows="4"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
				></textarea>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex gap-4 pt-6 border-t">
			<Button
				type="button"
				variant="outline"
				onclick={handleCancel}
				disabled={isSubmitting}
				class="flex-1 sm:flex-none"
			>
				Cancel
			</Button>
			<Button
				type="submit"
				disabled={isSubmitting}
				class="flex-1 sm:flex-none"
			>
				{#if isSubmitting}
					Creating Event...
				{:else}
					Create Event
				{/if}
			</Button>
		</div>
	</form>
</div>
