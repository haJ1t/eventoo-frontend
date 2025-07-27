<script>
	import { Badge as BadgeComponent } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardFooter, CardHeader } from "$lib/components/ui/card";
	import { Calendar, MapPin, Users } from "lucide-svelte";

	let { event, onclick } = $props();

	function handleViewDetails() {
		if (onclick) {
			onclick(event);
		}
	}
</script>

<Card class="overflow-hidden hover:shadow-lg transition-shadow p-0">
	<div class="relative">
		<img src={event.image} alt={event.title} class="w-full h-48 object-cover" />
		<div class="absolute top-2 right-2">
			<BadgeComponent variant={event.status === 'Scheduled' ? 'default' : 'secondary'}>
				{#snippet children()}
					{event.status}
				{/snippet}
			</BadgeComponent>
		</div>
	</div>
	
	<CardHeader class="pb-2">
		<h3 class="text-lg font-semibold line-clamp-2">{event.title}</h3>
	</CardHeader>
	
	<CardContent class="space-y-2">
		<div class="flex items-center text-sm text-gray-600">
			<Calendar class="w-4 h-4 mr-2" />
			{event.date}
		</div>
		<div class="flex items-center text-sm text-gray-600">
			<MapPin class="w-4 h-4 mr-2" />
			{event.location}
		</div>
		<div class="flex items-center text-sm text-gray-600">
			<Users class="w-4 h-4 mr-2" />
			{event.attendees}
		</div>
	</CardContent>
	
	<CardFooter>
		<Button onclick={handleViewDetails} class="w-full">
			View Details
		</Button>
	</CardFooter>
</Card>
