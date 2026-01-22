<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import { ArrowLeft } from "@lucide/svelte";
	import FileUpload from "$lib/components/file-upload.svelte";

	// Form state
	let formData = $state({
		title: "",
		date: "",
		location: "",
		attendees: "",
		description: "",
		organizer: "",
		price: "",
		category: "",
		tags: [],
		image: "",
	});

	let selectedTags = $state([]);
	let showTagsDropdown = $state(false);
	let isSubmitting = $state(false);
	let customTagInput = $state("");

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

	const locationOptions = [
		"Grand Ballroom",
		"Central Park",
		"City Art Gallery",
		"Convention Center",
		"Downtown Plaza",
		"Community Center",
		"University Campus",
		"Sports Complex",
		"Hotel Conference Room",
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

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;

		try {
			// Form validation
			if (!formData.title || !formData.date || !formData.location) {
				alert("Please fill in all required fields");
				return;
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Create new event object
			const newEvent = {
				id: Date.now(), // Temporary ID generation
				...formData,
				status: "Scheduled",
				tags: selectedTags,
			};

			console.log("New event created:", newEvent);

			// Redirect back to events page
			goto("/events");
		} catch (error) {
			console.error("Error creating event:", error);
			alert("Error creating event. Please try again.");
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

<div class="p-6 max-w-4xl mx-auto" in:fade={{ duration: 300 }}>
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center gap-4 mb-4">
			<Button
				variant="ghost"
				size="sm"
				onclick={handleCancel}
				class="h-9 w-9 p-0"
				disabled={false}
			>
				<ArrowLeft class="w-4 h-4" />
			</Button>
			<h1 class="text-3xl font-bold tracking-tight">Add New Event</h1>
		</div>
		<p class="text-gray-600">
			Create a new event and share it with the community.
		</p>
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

			<!-- Location -->
			<div>
				<label
					for="event-location"
					class="block text-sm font-medium text-gray-700 mb-2"
				>
					Location *
				</label>
				<select
					id="event-location"
					bind:value={formData.location}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					required
				>
					<option value="">Select location</option>
					{#each locationOptions as location}
						<option value={location}>{location}</option>
					{/each}
				</select>
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
					Organizer
				</label>
				<input
					id="event-organizer"
					type="text"
					bind:value={formData.organizer}
					placeholder="Organization or person name"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
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
