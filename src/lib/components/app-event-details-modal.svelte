<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import { Calendar, MapPin, Users, DollarSign, Clock, Star, Heart, Share2 } from "lucide-svelte";

	let { open = $bindable(false), event = null }: { open?: boolean, event?: any } = $props();

	// State
	let isLiked = $state(false);
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
			console.log(`User rated event ${event?.title} with ${userRating} stars and review: ${reviewText}`);
		}
	}

	function resetRating() {
		userRating = 0;
		hoverRating = 0;
		reviewText = '';
		hasRated = false;
	}

	function toggleLike() {
		isLiked = !isLiked;
	}

	function shareEvent() {
		if (navigator.share && event) {
			navigator.share({
				title: event.title,
				text: event.description,
				url: window.location.href
			});
		}
	}

	function registerForEvent() {
		console.log('Register clicked for:', event?.title);
		// Registration logic here
	}

	function viewFullDetails() {
		console.log('View details clicked for:', event?.id);
		if (event?.id) {
			open = false;
			// Navigate to event details page
			window.location.href = `/events/${event.id}`;
		}
	}
</script>

<Dialog bind:open>
	<DialogContent portalProps={{}} class="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
		{#if event}
			<!-- Event Header/Banner -->
			<div class="relative">
				<img 
					src={event.image || '/api/placeholder/600/300'} 
					alt={event.title}
					class="w-full h-64 object-cover rounded-t-lg"
				/>
				
				<!-- Tags -->
				{#if event.tags && event.tags.length > 0}
					<div class="absolute top-4 left-4">
						<div class="flex flex-wrap gap-2">
							{#each event.tags as tag}
								<Badge href="#" variant="secondary" class="bg-blue-100 text-blue-800 border-blue-300">
									{tag}
								</Badge>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Action buttons in top right -->
				<div class="absolute top-4 right-4 flex gap-2">
					<button
						onclick={toggleLike}
						class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
					>
						<Heart class="w-4 h-4 {isLiked ? 'fill-red-500 text-red-500' : ''}" />
					</button>
					<button
						onclick={shareEvent}
						class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
					>
						<Share2 class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Content -->
			<div class="p-6 space-y-6">
				<!-- Header -->
				<DialogHeader class="space-y-2">
					<div class="flex items-center gap-2">
						<Badge href="#" variant="outline" class="text-xs">
							{event.category || 'Event'}
						</Badge>
						{#if event.rating}
							<div class="flex items-center text-amber-600 text-sm">
								<Star class="w-4 h-4 mr-1 fill-amber-400 text-amber-400" />
								{event.rating} / 5
							</div>
						{/if}
					</div>
					<DialogTitle class="text-3xl font-bold">{event.title}</DialogTitle>
					<div class="flex items-center text-gray-600">
						<MapPin class="w-4 h-4 mr-1" />
						{event.location || 'Location TBD'}
					</div>
				</DialogHeader>

				<!-- Event Details Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Date & Time -->
					<div class="space-y-3">
						<h3 class="text-lg font-semibold">When</h3>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<Calendar class="w-4 h-4 text-gray-500" />
								<span class="font-medium">{event.date || 'Date TBD'}</span>
							</div>
							<div class="flex items-center gap-2">
								<Clock class="w-4 h-4 text-gray-500" />
								<span>{event.time || 'Time TBD'}</span>
							</div>
						</div>
					</div>

					<!-- Event Info -->
					<div class="space-y-3">
						<h3 class="text-lg font-semibold">Details</h3>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<Users class="w-4 h-4 text-gray-500" />
								<span>{event.attendees || '0'} attendees</span>
							</div>
							<div class="flex items-center gap-2">
								<DollarSign class="w-4 h-4 text-gray-500" />
								<span class="font-medium">{event.price || 'Free'}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Description Section -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">About This Event</h3>
					<p class="text-muted-foreground leading-relaxed">
						{event.description || 'No description available.'}
					</p>
				</div>

				<Separator class="my-6" />

				<!-- Rate This Event -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Rate This Event</h3>
					<div class="bg-gray-50 p-6 rounded-lg">
						{#if !hasRated}
							<p class="text-gray-600 mb-4">How would you rate this event?</p>
							
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
										placeholder="Share your experience with this event..."
										class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										rows="4"
									></textarea>
									{#if reviewText.trim().length < 10 && reviewText.length > 0}
										<p class="text-sm text-red-500 mt-1">Review must be at least 10 characters long</p>
									{/if}
								</div>
								
								<div class="flex gap-3">
									<Button class=""
										onclick={submitRating} 
										disabled={!reviewText.trim() || reviewText.trim().length < 10}
									>
										Submit Review
									</Button>
									<Button class="" onclick={resetRating} variant="outline" disabled={false}>
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
									<p class="text-gray-700 italic">\"{reviewText}\"</p>
								</div>
								<Button class="" onclick={resetRating} variant="outline" disabled={false}>
									Change Review
								</Button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3 pt-4 border-t">
					<Button onclick={registerForEvent} class="flex-1" disabled={false}>
						Register Now
					</Button>
					<Button onclick={viewFullDetails} variant="outline" class="flex-1" disabled={false}>
						View Full Details
					</Button>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>