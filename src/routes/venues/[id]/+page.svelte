<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fly, fade, scale, slide } from 'svelte/transition';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
    import { Badge } from '$lib/components/ui/badge';
    import { 
      MapPin, 
      Users, 
      Calendar, 
      Clock, 
      Star, 
      Wifi, 
      Car, 
      Coffee, 
      Music, 
      Camera, 
      Shield, 
      CheckCircle, 
      Heart, 
      Share2, 
      ChevronLeft, 
      ChevronRight, 
      Play,
      DollarSign,
      MessageCircle,
      Zap,
      Phone,
      Mail
    } from 'lucide-svelte';
  
    let venue = {
      id: 1,
      name: "Grand Ballroom Elite",
      location: "Downtown Manhattan, NY",
      pricePerHour: 150,
      capacity: 200,
      rating: 4.8,
      reviewCount: 127,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600", 
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      description: "Experience luxury and elegance in our premier event space located in the heart of Manhattan. Perfect for weddings, corporate events, and special celebrations.",
      amenities: [
        { name: "High-Speed WiFi", icon: "wifi" },
        { name: "Valet Parking", icon: "car" },
        { name: "Catering Kitchen", icon: "coffee" },
        { name: "Sound System", icon: "music" },
        { name: "Professional Lighting", icon: "camera" },
        { name: "Security", icon: "shield" }
      ],
      policies: {
        cancellation: "Free cancellation up to 48 hours before the event. 50% refund for cancellations within 24-48 hours.",
        deposit: "25% deposit required to secure booking. Remaining balance due 7 days before event.",
        overtime: "Additional $75/hour for events extending beyond booked time. Must be arranged in advance.",
        cleanup: "Basic cleanup included. Additional cleaning fees may apply for excessive mess or damage."
      },
      reviews: [
        {
          id: 1,
          author: "Sarah Johnson",
          rating: 5,
          date: "2024-01-15",
          comment: "Absolutely stunning venue! The staff was incredibly professional and the space exceeded our expectations.",
          avatar: "/api/placeholder/50/50"
        },
        {
          id: 2,
          author: "Michael Chen",
          rating: 5,
          date: "2024-01-10", 
          comment: "Perfect for our corporate event. Great location, excellent amenities, and seamless booking process.",
          avatar: "/api/placeholder/50/50"
        },
        {
          id: 3,
          author: "Emily Rodriguez",
          rating: 4,
          date: "2024-01-05",
          comment: "Beautiful venue with great service. Only minor issue was parking availability during peak hours.",
          avatar: "/api/placeholder/50/50"
        }
      ]
    };
  
    let currentImageIndex = 0;
    let activeTab = "overview";
    let selectedDate = "";
    let startTime = "";
    let endTime = "";
    let guestCount = "";
    let showBookingSuccess = false;
  
    const getIconComponent = (iconName: string) => {
      const icons = {
        wifi: Wifi,
        car: Car,
        coffee: Coffee,
        music: Music,
        camera: Camera,
        shield: Shield
      };
      return icons[iconName] || CheckCircle;
    };
  
    const nextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % venue.images.length;
    };
  
    const prevImage = () => {
      currentImageIndex = currentImageIndex === 0 ? venue.images.length - 1 : currentImageIndex - 1;
    };
  
    const calculateHours = () => {
      if (!startTime || !endTime) return 0;
      const start = new Date(`2024-01-01T${startTime}`);
      const end = new Date(`2024-01-01T${endTime}`);
      return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
    };
  
    const handleBooking = () => {
      showBookingSuccess = true;
      setTimeout(() => {
        showBookingSuccess = false;
      }, 5000);
    };
  
    onMount(() => {
      const interval = setInterval(nextImage, 5000);
      return () => clearInterval(interval);
    });
  </script>
  
  <svelte:head>
    <title>{venue.name} - Evento</title>
    <meta name="description" content={venue.description} />
  </svelte:head>
  
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Hero Section with Enhanced Animations -->
    <div class="relative h-96 lg:h-[500px] overflow-hidden">
      <!-- Image Carousel with Smooth Transitions -->
      <div class="absolute inset-0">
        {#each venue.images as image, index}
          <div 
            class="absolute inset-0 transition-opacity duration-1000 {index === currentImageIndex ? 'opacity-100' : 'opacity-0'}"
          >
            <img 
              src={image} 
              alt="Venue {index + 1}"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        {/each}
      </div>
  
      <!-- Navigation Controls with Hover Effects -->
      <button 
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
        on:click={prevImage}
        in:scale={{ duration: 300, delay: 600 }}
      >
        <ChevronLeft class="h-6 w-6" />
      </button>
      
      <button 
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
        on:click={nextImage}
        in:scale={{ duration: 300, delay: 600 }}
      >
        <ChevronRight class="h-6 w-6" />
      </button>
  
      <!-- Image Indicators -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {#each venue.images as _, index}
          <button 
            class="w-3 h-3 rounded-full transition-all duration-300 {index === currentImageIndex ? 'bg-white' : 'bg-white/50'} hover:bg-white/80"
            on:click={() => currentImageIndex = index}
          ></button>
        {/each}
      </div>
  
      <!-- Venue Info Overlay with Staggered Animations -->
      <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div class="space-y-4">
              <h1 
                class="text-3xl lg:text-5xl font-bold leading-tight"
                in:fly={{ y: 30, duration: 600, delay: 200 }}
              >
                {venue.name}
              </h1>
              
              <div 
                class="flex items-center gap-2 text-lg"
                in:fly={{ x: -20, duration: 400, delay: 400 }}
              >
                <MapPin class="h-5 w-5" />
                <span>{venue.location}</span>
              </div>
  
              <div class="flex flex-wrap items-center gap-6 text-sm lg:text-base">
                <div 
                  class="flex items-center gap-2"
                  in:fly={{ x: -20, duration: 400, delay: 500 }}
                >
                  <Users class="h-5 w-5" />
                  <span>Up to {venue.capacity} guests</span>
                </div>
                
                <div 
                  class="flex items-center gap-2"
                  in:fly={{ x: -20, duration: 400, delay: 600 }}
                >
                  <DollarSign class="h-5 w-5" />
                  <span>${venue.pricePerHour}/hour</span>
                </div>
  
                <!-- Rating with Stars Animation - DÜZELTME -->
                <div class="flex items-center gap-3" in:fly={{ x: -20, duration: 400, delay: 700 }}>
                  <div class="flex items-center gap-1">
                    {#each Array(5) as _, i}
                      <div in:scale={{ duration: 200, delay: 800 + (i * 100) }}>
                        <Star 
                          class="h-5 w-5 {i < Math.floor(venue.rating) ? 'fill-current text-yellow-400' : 'text-gray-400'}"
                        />
                      </div>
                    {/each}
                  </div>
                  <span class="font-semibold">{venue.rating}</span>
                  <span class="text-white/80">({venue.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
  
            <!-- Action Buttons with Hover Effects -->
            <div 
              class="flex gap-3"
              in:fly={{ x: 20, duration: 400, delay: 800 }}
            >
              <button class="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Heart class="h-5 w-5" />
              </button>
              <button class="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Share2 class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Main Content with Enhanced Layout -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Enhanced Tabs Navigation -->
          <Tabs bind:value={activeTab} class="w-full">
            <TabsList class="grid w-full grid-cols-4 bg-white shadow-sm border">
              <TabsTrigger 
                value="overview" 
                class="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="amenities"
                class="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Amenities
              </TabsTrigger>
              <TabsTrigger 
                value="policies"
                class="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                class="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
  
                        <!-- Overview Tab with Rich Content -->
            <TabsContent value="overview" class="space-y-6 mt-6">
                {#if activeTab === "overview"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <Card class="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                        <Play class="h-5 w-5 text-blue-600" />
                        About This Venue
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="prose max-w-none">
                        <p class="text-gray-700 leading-relaxed text-lg">{venue.description}</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div 
                            class="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
                            in:fly={{ x: -20, duration: 300, delay: 200 }}
                        >
                            <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <Users class="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 class="font-semibold text-gray-900">Capacity</h3>
                            </div>
                            <p class="text-2xl font-bold text-blue-600">{venue.capacity}</p>
                            <p class="text-gray-600 text-sm">Maximum guests</p>
                        </div>
            
                        <div 
                            class="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300"
                            in:fly={{ x: 20, duration: 300, delay: 300 }}
                        >
                            <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <MapPin class="h-6 w-6 text-green-600" />
                            </div>
                            <h3 class="font-semibold text-gray-900">Location</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{venue.location}</p>
                            <p class="text-gray-600 text-sm">Prime downtown location</p>
                        </div>
                        </div>
            
                        <!-- Contact Information -->
                        <div 
                        class="bg-gray-50 p-6 rounded-xl mt-8 border"
                        in:fly={{ y: 20, duration: 300, delay: 400 }}
                        >
                        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageCircle class="h-5 w-5 text-purple-600" />
                            Contact Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex items-center gap-3">
                            <Phone class="h-4 w-4 text-gray-600" />
                            <span class="text-gray-700">(555) 123-4567</span>
                            </div>
                            <div class="flex items-center gap-3">
                            <Mail class="h-4 w-4 text-gray-600" />
                            <span class="text-gray-700">info@grandballroom.com</span>
                            </div>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                {/if}
            </TabsContent>
            
            <!-- Amenities Tab with Interactive Grid -->
            <TabsContent value="amenities" class="space-y-6 mt-6">
                {#if activeTab === "amenities"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <Card class="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                        <Zap class="h-5 w-5 text-yellow-600" />
                        Venue Amenities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {#each venue.amenities as amenity, index}
                            <div 
                            class="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
                            in:fly={{ y: 20, duration: 300, delay: index * 100 }}
                            >
                            <div class="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                                <svelte:component this={getIconComponent(amenity.icon)} class="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                                {amenity.name}
                                </h4>
                            </div>
                            </div>
                        {/each}
                        </div>
                    </CardContent>
                    </Card>
                </div>
                {/if}
            </TabsContent>
            
            <!-- Policies Tab with Detailed Information -->
            <TabsContent value="policies" class="space-y-6 mt-6">
                {#if activeTab === "policies"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <Card class="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                        <Shield class="h-5 w-5 text-purple-600" />
                        Booking Policies
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-4">
                        <div 
                            class="flex items-start gap-4 p-4 rounded-lg bg-white border hover:shadow-md transition-all duration-300"
                            in:fly={{ x: -20, duration: 300, delay: 0 }}
                        >
                            <div class="p-2 rounded-full bg-gray-100">
                            <CheckCircle class="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                            <h4 class="font-medium text-gray-900 mb-1">Cancellation Policy</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">{venue.policies.cancellation}</p>
                            </div>
                        </div>
            
                        <div 
                            class="flex items-start gap-4 p-4 rounded-lg bg-white border hover:shadow-md transition-all duration-300"
                            in:fly={{ x: -20, duration: 300, delay: 100 }}
                        >
                            <div class="p-2 rounded-full bg-gray-100">
                            <DollarSign class="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                            <h4 class="font-medium text-gray-900 mb-1">Deposit Requirement</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">{venue.policies.deposit}</p>
                            </div>
                        </div>
            
                        <div 
                            class="flex items-start gap-4 p-4 rounded-lg bg-white border hover:shadow-md transition-all duration-300"
                            in:fly={{ x: -20, duration: 300, delay: 200 }}
                        >
                            <div class="p-2 rounded-full bg-gray-100">
                            <Clock class="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                            <h4 class="font-medium text-gray-900 mb-1">Overtime Charges</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">{venue.policies.overtime}</p>
                            </div>
                        </div>
            
                        <div 
                            class="flex items-start gap-4 p-4 rounded-lg bg-white border hover:shadow-md transition-all duration-300"
                            in:fly={{ x: -20, duration: 300, delay: 300 }}
                        >
                            <div class="p-2 rounded-full bg-gray-100">
                            <Shield class="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                            <h4 class="font-medium text-gray-900 mb-1">Cleanup Policy</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">{venue.policies.cleanup}</p>
                            </div>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                {/if}
            </TabsContent>
            
            <!-- Reviews Tab with Enhanced Design -->
            <TabsContent value="reviews" class="space-y-6 mt-6">
                {#if activeTab === "reviews"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <Card class="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Star class="h-5 w-5 text-yellow-600" />
                            Guest Reviews
                        </div>
                        <div class="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                            <Star class="h-5 w-5 fill-current text-yellow-400" />
                            <span class="font-bold text-yellow-600">{venue.rating}</span>
                            <span class="text-gray-600 text-sm">({venue.reviewCount} reviews)</span>
                        </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        {#each venue.reviews as review, index}
                        <div 
                            class="border-b border-gray-200 pb-6 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
                            in:fly={{ y: 20, duration: 300, delay: index * 100 }}
                        >
                            <div class="flex items-start gap-4">
                            <img 
                                src={review.avatar} 
                                alt={review.author}
                                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-gray-900">{review.author}</h4>
                                    <div class="flex items-center gap-1 mt-1">
                                    {#each Array(5) as _, i}
                                        <div in:scale={{ duration: 100, delay: (index * 100) + (i * 50) }}>
                                        <Star 
                                            class="h-4 w-4 {i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}"
                                        />
                                        </div>
                                    {/each}
                                    </div>
                                </div>
                                <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{review.date}</span>
                                </div>
                                <p class="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                            </div>
                        </div>
                        {/each}
                    </CardContent>
                    </Card>
                </div>
                {/if}
            </TabsContent>
  
  
            <!-- Reviews Tab with Enhanced Design -->
            <TabsContent value="reviews" class="space-y-6 mt-6">
              {#if activeTab === "reviews"}
                <Card class="border-0 shadow-sm" in:fly={{ y: 20, duration: 400 }}>
                  <CardHeader>
                    <CardTitle class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Star class="h-5 w-5 text-yellow-600" />
                        Guest Reviews
                      </div>
                      <div class="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star class="h-5 w-5 fill-current text-yellow-400" />
                        <span class="font-bold text-yellow-600">{venue.rating}</span>
                        <span class="text-gray-600 text-sm">({venue.reviewCount} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    {#each venue.reviews as review, index}
                      <div 
                        class="border-b border-gray-200 pb-6 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
                        in:fly={{ y: 20, duration: 300, delay: index * 100 }}
                      >
                        <div class="flex items-start gap-4">
                          <img 
                            src={review.avatar} 
                            alt={review.author}
                            class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div class="flex-1">
                            <div class="flex items-start justify-between mb-2">
                              <div>
                                <h4 class="font-medium text-gray-900">{review.author}</h4>
                                <div class="flex items-center gap-1 mt-1">
                                  {#each Array(5) as _, i}
                                    <div in:scale={{ duration: 100, delay: (index * 100) + (i * 50) }}>
                                      <Star 
                                        class="h-4 w-4 {i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}"
                                      />
                                    </div>
                                  {/each}
                                </div>
                              </div>
                              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{review.date}</span>
                            </div>
                            <p class="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </CardContent>
                </Card>
              {/if}
            </TabsContent>
          </Tabs>
        </div>
  
        <!-- Right Column - Enhanced Booking Sidebar -->
        <div class="lg:col-span-1" in:fly={{ x: 30, duration: 600, delay: 800 }}>
          <div class="sticky top-8">
            <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle class="flex items-center justify-between">
                  <span class="text-lg">Book This Venue</span>
                  <div class="text-right">
                    <div class="text-3xl font-bold">${venue.pricePerHour}</div>
                    <div class="text-blue-100 text-sm">per hour</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-6 p-6">
                <!-- Booking Form with Enhanced Animations -->
                <form class="space-y-4" on:submit|preventDefault={handleBooking}>
                  <!-- Date Selection with Animation -->
                  <div in:fly={{ x: -20, duration: 300, delay: 100 }}>
                    <label for="event-date" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar class="h-4 w-4 text-blue-600" />
                      Event Date
                    </label>
                    <input 
                      id="event-date"
                      type="date" 
                      bind:value={selectedDate}
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                    />
                  </div>
                  
                  <!-- Time Selection with Grid Animation -->
                  <div class="grid grid-cols-2 gap-4">
                    <div in:fly={{ x: -20, duration: 300, delay: 200 }}>
                      <label for="start-time" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock class="h-4 w-4 text-green-600" />
                        Start Time
                      </label>
                      <input 
                        id="start-time"
                        type="time" 
                        bind:value={startTime}
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                      />
                    </div>
                    <div in:fly={{ x: 20, duration: 300, delay: 200 }}>
                      <label for="end-time" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock class="h-4 w-4 text-red-600" />
                        End Time
                      </label>
                      <input 
                        id="end-time"
                        type="time" 
                        bind:value={endTime}
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <!-- Guest Count with Validation -->
                  <div in:fly={{ x: -20, duration: 300, delay: 300 }}>
                    <label for="guest-count" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users class="h-4 w-4 text-purple-600" />
                      Number of Guests
                    </label>
                    <div class="relative">
                      <input 
                        id="guest-count"
                        type="number" 
                        placeholder="Enter guest count"
                        max={venue.capacity}
                        bind:value={guestCount}
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                      />
                      <div class="absolute right-3 top-3 text-sm text-gray-500">
                        Max: {venue.capacity}
                      </div>
                    </div>
                  </div>
  
                  <!-- Price Calculation Display -->
                  {#if startTime && endTime}
                    <div 
                      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      in:slide={{ duration: 300 }}
                    >
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Estimated Total:</span>
                        <span class="text-xl font-bold text-blue-600">
                          ${venue.pricePerHour * calculateHours()}
                        </span>
                      </div>
                      <div class="text-xs text-gray-500 mt-1">
                        Based on hourly rate × duration ({calculateHours()} hours)
                      </div>
                    </div>
                  {/if}
                  
                                  <!-- Booking Buttons with Loading States -->
                <div class="space-y-3 pt-4" in:fly={{ y: 20, duration: 300, delay: 400 }}>
                    <button 
                      type="submit"
                      class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      disabled={!selectedDate || !startTime || !endTime || !guestCount}
                    >
                      <CheckCircle class="h-5 w-5" />
                      Book Now
                    </button>
                    
                    <button 
                      type="button"
                      class="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle class="h-5 w-5" />
                      Contact Venue
                    </button>
                  </div>
                </form>
  
                <!-- Success Message Animation -->
                {#if showBookingSuccess}
                  <div 
                    class="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    in:fly={{ y: -20, duration: 400 }}
                    out:fly={{ y: -20, duration: 300 }}
                  >
                    <div class="flex items-center justify-center gap-2 text-green-700 mb-2">
                      <CheckCircle class="h-5 w-5" />
                      <span class="font-semibold">Booking Request Sent!</span>
                    </div>
                    <p class="text-sm text-green-600">
                      We'll contact you within 24 hours to confirm your booking.
                    </p>
                  </div>
                {/if}
  
                <!-- Additional Information -->
                <div class="border-t pt-6 space-y-4">
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <Shield class="h-4 w-4 text-green-500" />
                    <span>Secure booking process</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle class="h-4 w-4 text-blue-500" />
                    <span>Free cancellation up to 48 hours</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <Clock class="h-4 w-4 text-purple-500" />
                    <span>Instant confirmation available</span>
                  </div>
                </div>
  
                <!-- Trust Badges -->
                <div class="border-t pt-4">
                  <div class="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                      <Shield class="h-3 w-3" />
                      <span>SSL Secured</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Star class="h-3 w-3" />
                      <span>Verified Venue</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            <!-- Similar Venues Suggestion -->
            <Card class="border-0 shadow-sm mt-6" in:fly={{ y: 30, duration: 600, delay: 1000 }}>
              <CardHeader>
                <CardTitle class="text-lg flex items-center gap-2">
                  <Heart class="h-5 w-5 text-red-500" />
                  You Might Also Like
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                {#each [1, 2] as item, index}
                  <div 
                    class="flex gap-3 p-3 rounded-lg border hover:shadow-md transition-all duration-300 cursor-pointer group"
                    in:fly={{ x: 20, duration: 300, delay: 1100 + (index * 100) }}
                  >
                    <img 
                      src="/api/placeholder/80/60" 
                      alt="Similar venue"
                      class="w-20 h-15 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        Elite Event Space {item}
                      </h4>
                      <div class="flex items-center gap-1 mt-1">
                        <Star class="h-3 w-3 fill-current text-yellow-400" />
                        <span class="text-sm text-gray-600">4.{7 + item}</span>
                      </div>
                      <p class="text-sm text-gray-500 mt-1">
                        ${120 + (item * 10)}/hour
                      </p>
                    </div>
                  </div>
                {/each}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    :global(html) {
      scroll-behavior: smooth;
    }
  
    :global(.card-hover) {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  
    :global(.card-hover:hover) {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  
    :global(.gradient-text) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  
    /* Keyframes doğru syntax ile */
    @keyframes -global-float {
      0%, 100% { 
        transform: translateY(0px); 
      }
      50% { 
        transform: translateY(-10px); 
      }
    }
  
    :global(.float-animation) {
      animation: float 3s ease-in-out infinite;
    }
  
    :global(.pulse-on-hover:hover) {
      animation: pulse 1s infinite;
    }
  
    @keyframes -global-shimmer {
      0% { 
        background-position: -200% 0; 
      }
      100% { 
        background-position: 200% 0; 
      }
    }
  
    :global(.shimmer) {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  
    :global(input:focus),
    :global(button:focus) {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  
    :global(button),
    :global(input),
    :global(.card),
    :global(.tab-trigger) {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  </style>
  
  