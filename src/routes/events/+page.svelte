<script lang="ts">
	import AppEventCard from "$lib/components/app-event-card.svelte";
	import { Button } from "$lib/components/ui/button";

	const events = [
		{
			title: "Tech Conference 2024",
			date: "July 15, 2024",
			location: "Grand Ballroom",
			attendees: "500 Attendees",
			status: "Scheduled",
			image: "/images/tech.jpg"
		},
		{
			title: "Summer Music Festival",
			date: "August 20, 2024",
			location: "Central Park",
			attendees: "10000 Attendees",
			status: "Scheduled",
			image: "/images/music.jpeg"
		},
		{
			title: "Art Exhibition",
			date: "September 5, 2024",
			location: "City Art Gallery",
			attendees: "200 Attendees",
			status: "Scheduled",
			image: "/images/art.jpg"
		},
	];
</script>

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
		<Button variant="outline">Location ⌄</Button>
		<Button variant="outline">Event Size ⌄</Button>
	</div>

	<!-- Event cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each events as event}
			<AppEventCard
				title={event.title}
				date={event.date}
				location={event.location}
				attendees={event.attendees}
				status={event.status}
				image={event.image}
			/>
		{/each}
	</div>
</div>
