<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import { Building2, MapPin, Calendar, Star, Mail, Phone, Globe, Twitter, Instagram, Facebook, Linkedin, ArrowLeft } from "lucide-svelte";
	import { goto } from '$app/navigation';

	// Get organiser ID from URL params
	const organiserId = $page.params.id;

	// Sample organisers data (in a real app, this would come from an API)
	const organisers = [
		{
			id: 1,
			name: "Tech Events Inc.",
			location: "San Francisco, CA",
			tag: "Technology",
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
			tags: ["Technology", "Networking", "Professional"]
		},
		{
			id: 2,
			name: "Music Events Co.",
			location: "Austin, TX",
			tag: "Music",
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
			tags: ["Music", "Entertainment", "Festivals"]
		},
		{
			id: 3,
			name: "Mentor Wise",
			location: "London, UK",
			tag: "Education",
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
			tags: ["Art", "Culture", "Exhibition"]
		},
		{
			id: 4,
			name: "Sohbet Society",
			location: "Istanbul, Turkey", 
			tag: "Cultural",
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
			tags: ["Cultural", "Community", "Education"]
		},
		{
			id: 5,
			name: "Sports United",
			location: "Chicago, IL",
			tag: "Sports",
			eventsCount: "20 Events",
			rating: 4.5,
			image: "/images/companyImages/SportsUnited.png",
			featured: false,
			bio: "Uniting communities through sports events, tournaments, and fitness challenges for all skill levels and ages.",
			socialMedia: {
				twitter: "@sportsunited",
				instagram: "sportsunited",
				website: "www.sportsunited.com"
			},
			contact: {
				email: "info@sportsunited.com",
				phone: "+1 (312) 555-7890"
			},
			tags: ["Sports", "Community", "Health"]
		},
		{
			id: 6,
			name: "Foodie Festivals",
			location: "New York, NY",
			tag: "Food & Drink",
			eventsCount: "30 Events",
			rating: 4.9,
			image: "/images/companyImages/FoodieFestivals.png",
			featured: true,
			bio: "Curating exceptional culinary experiences through food festivals, tasting events, and cooking workshops.",
			socialMedia: {
				twitter: "@foodiefests",
				instagram: "foodiefestivals",
				website: "www.foodiefestivals.com"
			},
			contact: {
				email: "taste@foodiefestivals.com",
				phone: "+1 (212) 555-3456"
			},
			tags: ["Food & Drink", "Culture", "Entertainment"]
		},
		{
			id: 7,
			name: "Art Collective",
			location: "Los Angeles, CA",
			tag: "Art",
			eventsCount: "18 Events",
			rating: 4.6,
			image: "/images/companyImages/ArtCollective.png",
			featured: false,
			bio: "Supporting emerging artists through exhibitions, galleries, and interactive art experiences.",
			socialMedia: {
				twitter: "@artcollective",
				instagram: "artcollectivela",
				website: "www.artcollective.org"
			},
			contact: {
				email: "create@artcollective.org",
				phone: "+1 (323) 555-9012"
			},
			tags: ["Art", "Culture", "Entertainment"]
		},
		{
			id: 8,
			name: "Business Summit",
			location: "London, UK",
			tag: "Business",
			eventsCount: "25 Events",
			rating: 4.8,
			image: "/images/companyImages/BusinessSummit.png",
			featured: true,
			bio: "Connecting industry leaders through professional conferences, networking events, and business workshops.",
			socialMedia: {
				twitter: "@bizsummit",
				linkedin: "businesssummit",
				website: "www.businesssummit.co.uk"
			},
			contact: {
				email: "contact@businesssummit.co.uk",
				phone: "+44 20 7123 4567"
			},
			tags: ["Business", "Professional", "Networking"]
		},
		{
			id: 9,
			name: "Green Events",
			location: "San Francisco, CA",
			tag: "Environment",
			eventsCount: "22 Events",
			rating: 4.7,
			image: "/images/companyImages/GreenEvents.png",
			featured: false,
			bio: "Promoting sustainability through eco-friendly events, environmental workshops, and green technology showcases.",
			socialMedia: {
				twitter: "@greenevents",
				instagram: "greeneventssf",
				website: "www.greenevents.org"
			},
			contact: {
				email: "sustainable@greenevents.org",
				phone: "+1 (415) 555-6789"
			},
			tags: ["Environment", "Technology", "Education"]
		}
	];

	// Find the organiser by ID
	const organiser = organisers.find(org => org.id === parseInt(organiserId));

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
		if (userRating > 0 && reviewText.trim() && reviewText.trim().length >= 10) {
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

	// Sample reviews with 5-star ratings
	const reviews = [
		{
			name: "Sarah Johnson",
			role: "Event Attendee",
			text: "Outstanding event organization with excellent attention to detail. Every event I've attended has been professionally managed and engaging.",
			rating: 5
		},
		{
			name: "Michael Chen",
			role: "Corporate Partner",
			text: "Professional service that consistently exceeds expectations. Great communication and flawless execution.",
			rating: 5
		},
		{
			name: "Emma Davis",
			role: "Event Coordinator",
			text: "Seamless collaboration and fantastic results every time. Highly recommend for any event needs.",
			rating: 5
		},
		{
			name: "David Wilson",
			role: "Venue Manager",
			text: "Professional, reliable, and creative. They bring fresh ideas to every project.",
			rating: 5
		},
		{
			name: "Lisa Rodriguez",
			role: "Marketing Director",
			text: "Exceptional service and attention to detail. Our events have never been better organized.",
			rating: 5
		}
	];

	function goBack() {
		goto('/organisers');
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

	function contactOrganiser() {
		if (organiser?.contact?.email) {
			window.location.href = `mailto:${organiser.contact.email}`;
		}
	}
</script>

<svelte:head>
	<title>{organiser ? organiser.name : 'Organiser'} - Evento</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	{#if organiser}
		<!-- Back Button -->
		<div class="mb-6">
			<Button onclick={goBack} variant="outline" class="flex items-center gap-2" disabled={false}>
				<ArrowLeft class="w-4 h-4" />
				Back to Organisers
			</Button>
		</div>

		<!-- Organiser Header/Banner -->
		<div class="relative mb-8">
			<img 
				src={organiser.image} 
				alt={organiser.name}
				class="w-full h-80 object-cover rounded-lg shadow-lg"
			/>
			
			{#if organiser.featured}
				<div class="absolute top-4 left-4">
					<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-300">
						<Star class="w-3 h-3 mr-1" /> Featured Organiser
					</span>
				</div>
			{/if}
		</div>

		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column - Main Info -->
			<div class="lg:col-span-2 space-y-8">
				<!-- Header Info -->
				<div class="space-y-4">
					<div class="flex items-center gap-3 flex-wrap">
						<h1 class="text-3xl font-bold">{organiser.name}</h1>
						<span class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
							{organiser.tag}
						</span>
					</div>
					
					<div class="flex items-center gap-6 text-gray-600">
						<div class="flex items-center gap-2">
							<MapPin class="w-5 h-5" />
							<span>{organiser.location}</span>
						</div>
						<div class="flex items-center gap-2">
							<Calendar class="w-5 h-5" />
							<span>{organiser.eventsCount}</span>
						</div>
						<div class="flex items-center gap-2 text-amber-600">
							<Star class="w-5 h-5 fill-amber-400 text-amber-400" />
							<span class="font-medium">{organiser.rating} / 5</span>
						</div>
					</div>
				</div>

				<!-- About Section -->
				<div class="space-y-4">
					<h2 class="text-2xl font-semibold">About</h2>
					<p class="text-gray-700 leading-relaxed text-lg">
						{organiser.bio}
					</p>
				</div>

				<!-- Specialties/Tags -->
				<div class="space-y-4">
					<h2 class="text-2xl font-semibold">Specialties</h2>
					<div class="flex flex-wrap gap-2">
						{#each organiser.tags as tag}
							<span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
								{tag}
							</span>
						{/each}
					</div>
				</div>

				<!-- Rate This Organiser Section -->
				<div class="space-y-6">
					<h2 class="text-2xl font-semibold">Rate This Organiser</h2>
					<div class="bg-white p-8 rounded-lg border shadow-sm">
						{#if !hasRated}
							<p class="text-gray-600 mb-6 text-lg">Share your experience with this organiser</p>
							
							<!-- Star Rating -->
							<div class="mb-6">
								<div class="flex items-center gap-3 mb-3">
									{#each Array(5) as _, i}
										{@const starIndex = i + 1}
										{@const isActive = (hoverRating > 0 ? starIndex <= hoverRating : starIndex <= userRating)}
										<button
											onclick={() => setRating(starIndex)}
											onmouseenter={() => handleMouseEnter(starIndex)}
											onmouseleave={handleMouseLeave}
											class="transition-all hover:scale-110 transform"
											aria-label="Rate {starIndex} stars"
										>
											<Star class="w-10 h-10 {isActive ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
										</button>
									{/each}
									{#if (hoverRating > 0 ? hoverRating : userRating) > 0}
										<span class="ml-3 text-xl font-semibold text-gray-700">{hoverRating > 0 ? hoverRating : userRating} out of 5</span>
									{/if}
								</div>
							</div>
							
							<!-- Review Text -->
							{#if userRating > 0}
								<div class="mb-6">
									<label for="review-text-profile" class="block text-lg font-medium text-gray-700 mb-3">
										Write your review *
									</label>
									<textarea
										id="review-text-profile"
										bind:value={reviewText}
										placeholder="Share your detailed experience with this organiser..."
										class="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
										rows="5"
									></textarea>
									{#if reviewText.trim().length < 10 && reviewText.length > 0}
										<p class="text-sm text-red-500 mt-2">Review must be at least 10 characters long</p>
									{/if}
								</div>
								
								<div class="flex gap-4">
									<Button 
										onclick={submitRating} 
										class="px-8 py-3" 
										disabled={!reviewText.trim() || reviewText.trim().length < 10}
									>
										Submit Review
									</Button>
									<Button onclick={resetRating} variant="outline" class="px-8 py-3" disabled={false}>
										Clear
									</Button>
								</div>
							{/if}
						{:else}
							<div class="text-center">
								<p class="text-green-600 font-semibold mb-4 text-lg">Thank you for your review!</p>
								<div class="flex justify-center items-center gap-3 mb-4">
									<span class="text-gray-600 text-lg">You rated:</span>
									{#each Array(5) as _, i}
										<Star class="w-7 h-7 {i < userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}" />
									{/each}
									<span class="font-bold text-xl">{userRating} out of 5</span>
								</div>
								<div class="bg-gray-50 p-6 rounded-lg border mb-6">
									<p class="text-gray-700 italic text-lg leading-relaxed">"{reviewText}"</p>
								</div>
								<Button onclick={resetRating} variant="outline" class="px-8 py-3" disabled={false}>
									Change Review
								</Button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Reviews Section -->
				<div class="space-y-6">
					<h2 class="text-2xl font-semibold">Reviews</h2>
					<div class="space-y-4">
						{#each reviews as review}
							<div class="bg-gray-50 p-6 rounded-lg border">
								<div class="flex items-center justify-between mb-3">
									<div>
										<p class="font-semibold text-lg">{review.name}</p>
										<p class="text-sm text-gray-500">{review.role}</p>
									</div>
									<div class="flex">
										{#each Array(5) as _, i}
											<Star class="w-5 h-5 fill-amber-400 text-amber-400" />
										{/each}
									</div>
								</div>
								<p class="text-gray-700 italic text-base leading-relaxed">
									"{review.text}"
								</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Column - Contact & Social -->
			<div class="space-y-6">
				<!-- Contact Card -->
				<div class="bg-white p-6 rounded-lg border shadow-sm">
					<h3 class="text-xl font-semibold mb-4">Contact Information</h3>
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<Mail class="w-5 h-5 text-gray-500" />
							<a href={`mailto:${organiser.contact.email}`} class="text-primary hover:underline">
								{organiser.contact.email}
							</a>
						</div>
						<div class="flex items-center gap-3">
							<Phone class="w-5 h-5 text-gray-500" />
							<a href={`tel:${organiser.contact.phone}`} class="hover:underline">
								{organiser.contact.phone}
							</a>
						</div>
					</div>
					
					<Button onclick={contactOrganiser} class="w-full mt-6" disabled={false}>
						<Mail class="w-4 h-4 mr-2" />
						Contact Organiser
					</Button>
				</div>

				<!-- Social Media Card -->
				<div class="bg-white p-6 rounded-lg border shadow-sm">
					<h3 class="text-xl font-semibold mb-4">Connect</h3>
					<div class="space-y-3">
						{#each Object.entries(organiser.socialMedia) as [platform, handle]}
							{@const IconComponent = getSocialIcon(platform)}
							<a 
								href={platform === 'website' ? `https://${handle}` : `https://${platform}.com/${handle}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<IconComponent class="w-5 h-5 text-gray-600" />
								<span class="text-sm font-medium">{handle}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- Statistics Card -->
				<div class="bg-white p-6 rounded-lg border shadow-sm">
					<h3 class="text-xl font-semibold mb-4">Statistics</h3>
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Total Events</span>
							<span class="font-semibold">{organiser.eventsCount}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Average Rating</span>
							<div class="flex items-center gap-1">
								<Star class="w-4 h-4 fill-amber-400 text-amber-400" />
								<span class="font-semibold">{organiser.rating}</span>
							</div>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Total Reviews</span>
							<span class="font-semibold">{reviews.length}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Organiser Not Found -->
		<div class="text-center py-16">
			<div class="mb-6">
				<Building2 class="w-16 h-16 mx-auto text-gray-400" />
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Organiser Not Found</h1>
			<p class="text-gray-600 mb-6">The organiser you're looking for doesn't exist or has been removed.</p>
			<Button onclick={goBack} variant="outline" class="" disabled={false}>
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Organisers
			</Button>
		</div>
	{/if}
</div>
