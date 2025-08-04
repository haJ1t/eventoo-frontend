<script>
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardFooter, CardHeader } from "$lib/components/ui/card";
	import { Building2, MapPin, Calendar, Star } from "lucide-svelte";

	let { organiser, onclick, featured = false } = $props();

	function handleViewDetails() {
		if (onclick) {
			onclick(organiser);
		}
	}
</script>

<Card class="overflow-hidden hover:shadow-lg transition-shadow p-0 {featured ? 'border-amber-300 border-2' : ''}">
	<div class="relative">
		<img src={organiser.image} alt={organiser.name} class="w-full h-48 object-cover" />
		{#if featured}
			<div class="absolute top-2 right-2">
				<Badge variant="secondary" class="bg-amber-100 text-amber-800 border-amber-300">
					<Star class="w-3 h-3 mr-1 inline" /> Featured
				</Badge>
			</div>
		{/if}
	</div>
	
	<CardHeader class="pb-2">
		<h3 class="text-lg font-semibold line-clamp-2">{organiser.name}</h3>
	</CardHeader>
	
	<CardContent class="space-y-2">
		<div class="flex items-center text-sm text-gray-600">
			<Building2 class="w-4 h-4 mr-2" />
			{organiser.category}
		</div>
		<div class="flex items-center text-sm text-gray-600">
			<MapPin class="w-4 h-4 mr-2" />
			{organiser.location}
		</div>
		<div class="flex items-center text-sm text-gray-600">
			<Calendar class="w-4 h-4 mr-2" />
			{organiser.eventsCount}
		</div>
		<div class="flex items-center text-sm text-amber-600">
			<Star class="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />
			{organiser.rating} / 5
		</div>
	</CardContent>
	
	<CardFooter>
		<Button onclick={handleViewDetails} class="w-full" style="margin-bottom: 1rem;">
			View Profile
		</Button>
	</CardFooter>
</Card>