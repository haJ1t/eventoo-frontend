<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import { Building2, MapPin, Calendar, Star, Mail, Phone, Globe, Twitter, Instagram, Facebook, Linkedin } from "lucide-svelte";

	let { open = $bindable(false), organiser = null }: { open?: boolean, organiser?: any } = $props();



	// User rating state
	let userRating = $state(0);
	let hoverRating = $state(0);
	let reviewText = $state('');
	let hasRated = $state(false);

	function setRating(rating) {
		userRating = rating;
		hoverRating = 0;
	}

	function handleMouseEnter(rating) {
		hoverRating = rating;
	}

	function handleMouseLeave() {
		hoverRating = 0;
	}

	function submitRating() {
		if (userRating > 0 && reviewText.trim()) {
			hasRated = true;
			// Here you would typically save the rating and review to your backend
			console.log(`User rated organiser ${organiser?.name} with ${userRating} stars and review: ${reviewText}`);
		}
	}

	function resetRating() {
		userRating = 0;
		hoverRating = 0;
		reviewText = '';
		hasRated = false;
	}

	function handleViewFullProfile() {
		if (organiser) {
			// Navigate to dedicated organiser page
			window.location.href = `/organisers/${organiser.id}`;
		}
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
	<DialogContent portalProps={{}} class="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
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
						<Badge href="#"
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
						<Badge href="#" variant="outline" class="text-xs">
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
									href={`https://${platform}.com/${handle}`} 
									class="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
								>
									<svelte:component this={getSocialIcon(platform)} class="w-4 h-4" />
									<span class="text-sm">{handle}</span>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<Separator class="my-6" />

				<!-- Rate This Organiser -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Rate This Organiser</h3>
					<div class="bg-gray-50 p-6 rounded-lg">
						{#if !hasRated}
							<p class="text-gray-600 mb-4">How would you rate this organiser?</p>
							
							<!-- Star Rating -->
							<div class="mb-4">
								<div class="flex items-center gap-2 mb-2">
									{#each Array(5) as _, i}
										{@const starIndex = i + 1}
										{@const isActive = (hoverRating > 0 ? starIndex <= hoverRating : starIndex <= userRating)}
										<button
											onclick={() => setRating(starIndex)}
											onmouseenter={() => handleMouseEnter(starIndex)}
											onmouseleave={handleMouseLeave}
											class="transition-all hover:scale-110 transform"
										>
											<Star class="w-8 h-8 {isActive ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
										</button>
									{/each}
									{#if (hoverRating > 0 ? hoverRating : userRating) > 0}
										<span class="ml-2 text-lg font-medium text-gray-700">{hoverRating > 0 ? hoverRating : userRating} out of 5</span>
									{/if}
								</div>
							</div>
							
							<!-- Review Text -->
							{#if userRating > 0}
								<div class="mb-4">
									<label for="review-text" class="block text-sm font-medium text-gray-700 mb-2">
										Write your review *
									</label>
									<textarea
										id="review-text"
										bind:value={reviewText}
										placeholder="Share your experience with this organiser..."
										class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										rows="4"
									></textarea>
									{#if reviewText.trim().length < 10 && reviewText.length > 0}
										<p class="text-sm text-red-500 mt-1">Review must be at least 10 characters long</p>
									{/if}
								</div>
								
								<div class="flex gap-3">
									<Button 
										onclick={submitRating} 
										class="" 
										disabled={!reviewText.trim() || reviewText.trim().length < 10}
									>
										Submit Review
									</Button>
									<Button onclick={resetRating} variant="outline" class="" disabled={false}>
										Clear
									</Button>
								</div>
							{/if}
						{:else}
							<div class="text-center">
								<p class="text-green-600 font-medium mb-3">Thank you for your review!</p>
								<div class="flex justify-center items-center gap-2 mb-3">
									<span class="text-gray-600">You rated:</span>
									{#each Array(5) as _, i}
										<Star class="w-6 h-6 {i < userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
									{/each}
									<span class="font-semibold text-lg">{userRating} out of 5</span>
								</div>
								<div class="bg-white p-4 rounded-lg border mb-4">
									<p class="text-gray-700 italic">"{reviewText}"</p>
								</div>
								<Button onclick={resetRating} variant="outline" class="" disabled={false}>
									Change Review
								</Button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3 pt-4 border-t">
					<Button onclick={handleViewFullProfile} class="flex-1" disabled={false}>
						View Full Profile
					</Button>
					<Button href="#" variant="outline" class="flex-1" disabled={false}>
						Share Profile
					</Button>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>