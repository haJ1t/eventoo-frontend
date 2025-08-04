<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import { Building2, MapPin, Calendar, Star, Mail, Phone, Globe, Twitter, Instagram, Facebook, Linkedin } from "lucide-svelte";
	import AppEventCard from "./app-event-card.svelte";

	export let open = false;
	export let organiser: any = null;

	// Sample events for this organiser with updated image paths
	const organiserEvents = [
		{
			id: 101,
			title: "Tech Summit 2024",
			date: "October 15, 2024",
			location: "Grand Convention Center",
			attendees: "800 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/tech.jpg"
		},
		{
			id: 102,
			title: "Developer Workshop",
			date: "November 5, 2024",
			location: "Tech Hub Downtown",
			attendees: "150 Attendees",
			status: "Scheduled",
			image: "/images/eventImages/tech.jpg"
		}
	];

	// Sample testimonials
	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Event Attendee",
			text: "The events organized by this team are always top-notch. Great attention to detail and excellent speaker lineup.",
			rating: 5
		},
		{
			name: "Michael Chen",
			role: "Corporate Partner",
			text: "We've collaborated on multiple events and the results have consistently exceeded our expectations.",
			rating: 4
		}
	];

	function handleEventClick(event) {
		console.log("Event clicked:", event);
		// Here you would typically open the event details modal
	}

	function getSocialIcon(platform) {
		switch (platform) {
			case 'twitter': return Twitter;
			case 'instagram': return Instagram;
			case 'facebook': return Facebook;
			case 'linkedin': return Linkedin;
			case 'website': return Globe;
			default: return Globe;
		}
	}
</script>

<Dialog bind:open>
	<DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
		{#if organiser}
			<!-- Organiser Header/Banner -->
			<div class="relative">
				<img 
					src={organiser.image} 
					alt={organiser.name}
					class="w-full h-64 object-cover rounded-t-lg"
				/>
				
				{#if organiser.featured}
					<div class="absolute top-4 left-4">
						<Badge 
							variant="secondary"
							class="bg-amber-100 text-amber-800 border-amber-300"
						>
							<Star class="w-3 h-3 mr-1 inline" /> Featured Organiser
						</Badge>
					</div>
				{/if}
			</div>

			<!-- Content -->
			<div class="p-6 space-y-6">
				<!-- Header -->
				<DialogHeader class="space-y-2">
					<div class="flex items-center gap-2">
						<Badge variant="outline" class="text-xs">
							{organiser.category}
						</Badge>
						<div class="flex items-center text-amber-600 text-sm">
							<Star class="w-4 h-4 mr-1 fill-amber-400 text-amber-400" />
							{organiser.rating} / 5
						</div>
					</div>
					<DialogTitle class="text-3xl font-bold">{organiser.name}</DialogTitle>
					<div class="flex items-center text-gray-600">
						<MapPin class="w-4 h-4 mr-1" />
						{organiser.location}
					</div>
				</DialogHeader>

				<!-- Bio Section -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">About</h3>
					<p class="text-muted-foreground leading-relaxed">
						{organiser.bio}
					</p>
				</div>

				<!-- Contact & Social Media -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Contact Info -->
					<div class="space-y-3">
						<h3 class="text-lg font-semibold">Contact Information</h3>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<Mail class="w-4 h-4 text-gray-500" />
								<a href={`mailto:${organiser.contact.email}`} class="text-primary hover:underline">
									{organiser.contact.email}
								</a>
							</div>
							<div class="flex items-center gap-2">
								<Phone class="w-4 h-4 text-gray-500" />
								<a href={`tel:${organiser.contact.phone}`} class="hover:underline">
									{organiser.contact.phone}
								</a>
							</div>
						</div>
					</div>

					<!-- Social Media -->
					<div class="space-y-3">
						<h3 class="text-lg font-semibold">Connect</h3>
						<div class="flex flex-wrap gap-3">
							{#each Object.entries(organiser.socialMedia) as [platform, handle]}
								<a 
									href="#" 
									class="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
								>
									<svelte:component this={getSocialIcon(platform)} class="w-4 h-4" />
									<span class="text-sm">{handle}</span>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<Separator />

				<!-- Upcoming Events -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Upcoming Events</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each organiserEvents as event}
							<AppEventCard {event} onclick={handleEventClick} />
						{/each}
					</div>
				</div>

				<Separator />

				<!-- Testimonials -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Testimonials</h3>
					<div class="space-y-4">
						{#each testimonials as testimonial}
							<div class="bg-gray-50 p-4 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<div>
										<p class="font-medium">{testimonial.name}</p>
										<p class="text-sm text-gray-500">{testimonial.role}</p>
									</div>
									<div class="flex">
										{#each Array(5) as _, i}
											<Star class="w-4 h-4 {i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
										{/each}
									</div>
								</div>
								<p class="text-gray-600 italic">
									"{testimonial.text}"
								</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3 pt-4 border-t">
					<Button class="flex-1">
						Contact Organiser
					</Button>
					<Button variant="outline" class="flex-1">
						Share Profile
					</Button>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>