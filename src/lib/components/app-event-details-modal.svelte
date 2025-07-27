<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Calendar, MapPin, Users, DollarSign } from "lucide-svelte";

	export let open = false;
	export let event: any = null;

	// Dummy detailed data for the selected event
	$: eventDetails = event ? {
		...event,
		description: "Join us for an amazing experience! This event will feature keynote speakers, networking opportunities, and hands-on workshops. Don't miss out on this incredible opportunity to learn and connect with like-minded individuals.",
		time: "9:00 AM - 6:00 PM",
		price: event.title.includes("Tech") ? "$99" : event.title.includes("Music") ? "$150" : "Free",
		organizer: "Event Organizers Inc.",
		category: event.title.includes("Tech") ? "Technology" : event.title.includes("Music") ? "Entertainment" : "Arts & Culture",
		tags: event.title.includes("Tech") ? ["Technology", "Networking", "Innovation"] : 
			  event.title.includes("Music") ? ["Music", "Festival", "Outdoor"] : 
			  ["Art", "Exhibition", "Culture"]
	} : null;
</script>

<Dialog bind:open>
	<DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
		{#if eventDetails}
			<!-- Event Image -->
			<div class="relative">
				<img 
					src={eventDetails.image} 
					alt={eventDetails.title}
					class="w-full h-64 object-cover rounded-t-lg"
				/>
				
				<!-- Status Badge -->
				<div class="absolute top-4 left-4">
					<Badge 
						variant={eventDetails.status === 'Scheduled' ? 'default' : 'secondary'}
						class="text-sm"
					>
						{eventDetails.status}
					</Badge>
				</div>
			</div>

			<!-- Content -->
			<div class="p-6 space-y-6">
				<!-- Header -->
				<DialogHeader class="space-y-2">
					<div class="flex items-center gap-2">
						<Badge variant="outline" class="text-xs">
							{eventDetails.category}
						</Badge>
					</div>
					<DialogTitle class="text-3xl font-bold">{eventDetails.title}</DialogTitle>
				</DialogHeader>

				<!-- Event Details Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Date & Time -->
					<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<Calendar class="w-5 h-5 text-primary" />
						<div>
							<p class="font-medium">{eventDetails.date}</p>
							<p class="text-sm text-muted-foreground">{eventDetails.time}</p>
						</div>
					</div>

					<!-- Location -->
					<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<MapPin class="w-5 h-5 text-primary" />
						<div>
							<p class="font-medium">{eventDetails.location}</p>
							<p class="text-sm text-muted-foreground">Venue</p>
						</div>
					</div>

					<!-- Attendees -->
					<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<Users class="w-5 h-5 text-primary" />
						<div>
							<p class="font-medium">{eventDetails.attendees}</p>
							<p class="text-sm text-muted-foreground">Expected</p>
						</div>
					</div>

					<!-- Price -->
					<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<DollarSign class="w-5 h-5 text-primary" />
						<div>
							<p class="font-medium">{eventDetails.price}</p>
							<p class="text-sm text-muted-foreground">Ticket Price</p>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">About This Event</h3>
					<p class="text-muted-foreground leading-relaxed">
						{eventDetails.description}
					</p>
				</div>

				<!-- Organizer -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">Organized by</h3>
					<p class="text-muted-foreground">{eventDetails.organizer}</p>
				</div>

				<!-- Tags -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">Tags</h3>
					<div class="flex flex-wrap gap-2">
						{#each eventDetails.tags as tag}
							<Badge variant="secondary" class="text-xs">
								{tag}
							</Badge>
						{/each}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3 pt-4 border-t">
					<Button class="flex-1">
						Register Now
					</Button>
					<Button variant="outline" class="flex-1">
						Share Event
					</Button>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>
