<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, scale } from 'svelte/transition';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { 
    MapPin, Users, Calendar, Clock, Star, Wifi, Car, Coffee, Music, Camera, Shield, 
    CheckCircle, Heart, Share2, ChevronLeft, ChevronRight, DollarSign, 
    MessageCircle, Phone, Mail, Building, Sparkles, FileText, AlertCircle,
    ThumbsUp, User
  } from 'lucide-svelte';

  // Venue data
  const venue = {
    name: "Grand Ballroom Elite",
    location: "Downtown Manhattan, NY",
    pricePerHour: 150,
    capacity: 200,
    rating: 4.8,
    reviewCount: 127,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2098&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    description: "Experience luxury and elegance in our premier event space located in the heart of Manhattan.",
    amenities: [
      { name: "High-Speed WiFi", icon: Wifi },
      { name: "Valet Parking", icon: Car },
      { name: "Catering Kitchen", icon: Coffee },
      { name: "Sound System", icon: Music },
      { name: "Professional Lighting", icon: Camera },
      { name: "Security", icon: Shield }
    ],
    policies: [
      {
        title: "Cancellation Policy",
        description: "Free cancellation up to 48 hours before the event. 50% refund within 24-48 hours.",
        icon: AlertCircle,
        type: "warning"
      },
      {
        title: "Security Deposit",
        description: "$500 refundable security deposit required for all bookings.",
        icon: Shield,
        type: "info"
      },
      {
        title: "Setup Time",
        description: "2 hours setup time included. Additional time available at $75/hour.",
        icon: Clock,
        type: "success"
      },
      {
        title: "Catering Rules",
        description: "Outside catering allowed with prior approval. Kitchen facilities available.",
        icon: Coffee,
        type: "info"
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely stunning venue! The staff was incredibly helpful and the space exceeded our expectations. Perfect for our corporate event.",
        helpful: 12,
        avatar: "SJ"
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 5,
        date: "2024-01-10",
        comment: "Beautiful ballroom with excellent acoustics. The lighting system is top-notch and really made our wedding reception magical.",
        helpful: 8,
        avatar: "MC"
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        rating: 4,
        date: "2024-01-05",
        comment: "Great venue with professional service. Only minor issue was parking, but the valet service made up for it. Highly recommend!",
        helpful: 15,
        avatar: "ER"
      },
      {
        id: 4,
        name: "David Kim",
        rating: 5,
        date: "2023-12-28",
        comment: "Hosted our company holiday party here. The team was amazing and handled everything perfectly. Will definitely book again!",
        helpful: 6,
        avatar: "DK"
      }
    ]
  };

  let currentImageIndex = 0;
  let activeTab = "overview";
  let formData = { date: "", startTime: "", endTime: "", guestCount: "" };
  let showSuccess = false;

  const nextImage = () => currentImageIndex = (currentImageIndex + 1) % venue.images.length;
  const prevImage = () => currentImageIndex = currentImageIndex === 0 ? venue.images.length - 1 : currentImageIndex - 1;
  
  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2024-01-01T${formData.startTime}`);
    const end = new Date(`2024-01-01T${formData.endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / 3600000);
  };

  const handleBooking = () => {
    showSuccess = true;
    setTimeout(() => showSuccess = false, 3000);
  };

  const isFormValid = () => Object.values(formData).every(val => val);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPolicyColor = (type) => {
    switch(type) {
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  onMount(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  });
</script>

<div class="min-h-screen">
  <!-- Hero Section -->
  <div class="relative h-96 lg:h-[500px] overflow-hidden">
    <!-- Image Carousel -->
    <div class="absolute inset-0">
      {#each venue.images as image, index}
        <div class="absolute inset-0 transition-opacity duration-1000 {index === currentImageIndex ? 'opacity-100' : 'opacity-0'}">
          <img src={image} alt="Venue {index + 1}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      {/each}
    </div>

    <!-- Navigation -->
    <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all z-10" on:click={prevImage}>
      <ChevronLeft class="h-6 w-6" />
    </button>
    <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all z-10" on:click={nextImage}>
      <ChevronRight class="h-6 w-6" />
    </button>

    <!-- Venue Info -->
    <div class="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
      <div class="max-w-7xl mx-auto flex justify-between items-end">
        <div>
          <h1 class="text-5xl font-bold mb-4" in:fly={{ y: 30, duration: 600 }}>{venue.name}</h1>
          <div class="flex items-center gap-6 text-lg">
            <div class="flex items-center gap-2">
              <MapPin class="h-5 w-5" />
              <span>{venue.location}</span>
            </div>
            <div class="flex items-center gap-2">
              <Users class="h-5 w-5" />
              <span>{venue.capacity} guests</span>
            </div>
            <div class="flex items-center gap-2">
              <DollarSign class="h-5 w-5" />
              <span>${venue.pricePerHour}/hour</span>
            </div>
            <div class="flex items-center gap-2">
              <Star class="h-5 w-5 fill-current text-yellow-400" />
              <span>{venue.rating} ({venue.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all">
            <Heart class="h-5 w-5" />
          </button>
          <button class="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all">
            <Share2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-8 py-4">
    <div class="grid grid-cols-3 gap-8">
      <!-- Content Tabs -->
      <div class="col-span-2">
        <Tabs bind:value={activeTab} class="w-full">
          <TabsList class="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="amenities" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Amenities</TabsTrigger>
            <TabsTrigger value="policies" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Policies</TabsTrigger>
            <TabsTrigger value="reviews" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Reviews</TabsTrigger>
            <TabsTrigger value="contact" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Contact</TabsTrigger>
          </TabsList>

          <!-- Overview -->
          <TabsContent value="overview" class="mt-6">
            <div class="space-y-6">
              <!-- About Section -->
              <Card class="border-0 shadow-sm">
                <CardHeader class="">
                  <CardTitle class="flex items-center gap-2">
                    <Building class="h-5 w-5 text-blue-600" />
                    About This Venue
                  </CardTitle>
                </CardHeader>
                <CardContent class="">
                  <p class="text-gray-700 text-lg leading-relaxed mb-6">{venue.description}</p>
                  
                  <!-- Extended Description -->
                  <div class="prose prose-gray max-w-none">
                    <p class="text-gray-600 leading-relaxed mb-4">
                      Our Grand Ballroom Elite features soaring 20-foot ceilings with crystal chandeliers, 
                      hardwood floors, and floor-to-ceiling windows offering stunning city views. The space 
                      seamlessly combines classic elegance with modern amenities to create the perfect 
                      atmosphere for your special event.
                    </p>
                    <p class="text-gray-600 leading-relaxed">
                      Whether you're planning a wedding reception, corporate gala, or private celebration, 
                      our dedicated event team will work with you to ensure every detail is perfect. 
                      From initial planning to day-of coordination, we're here to make your vision a reality.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <!-- Key Stats -->
              <Card class="border-0 shadow-sm">
                <CardHeader class="">
                  <CardTitle class="flex items-center gap-2">
                    <Star class="h-5 w-5 text-yellow-600" />
                    Venue Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent class="">
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center">
                      <Users class="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <p class="text-2xl font-bold text-blue-600 mb-1">{venue.capacity}</p>
                      <p class="text-sm text-gray-600">Max Capacity</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl text-center">
                      <Star class="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <p class="text-2xl font-bold text-green-600 mb-1">{venue.rating}</p>
                      <p class="text-sm text-gray-600">{venue.reviewCount} Reviews</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl text-center">
                      <MapPin class="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <p class="text-2xl font-bold text-purple-600 mb-1">Prime</p>
                      <p class="text-sm text-gray-600">Location</p>
                    </div>
                    <div class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl text-center">
                      <DollarSign class="h-8 w-8 text-orange-600 mx-auto mb-3" />
                      <p class="text-2xl font-bold text-orange-600 mb-1">${venue.pricePerHour}</p>
                      <p class="text-sm text-gray-600">Per Hour</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Space Details -->
              <Card class="border-0 shadow-sm">
                <CardHeader class="">
                  <CardTitle class="flex items-center gap-2">
                    <Building class="h-5 w-5 text-indigo-600" />
                    Space Details
                  </CardTitle>
                </CardHeader>
                <CardContent class="">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Dimensions -->
                    <div class="space-y-4">
                      <h4 class="font-semibold text-gray-900 mb-3">Dimensions & Layout</h4>
                      <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Total Area</span>
                          <span class="font-medium">3,500 sq ft</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Ceiling Height</span>
                          <span class="font-medium">20 feet</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Dance Floor</span>
                          <span class="font-medium">800 sq ft</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                          <span class="text-gray-600">Stage Area</span>
                          <span class="font-medium">200 sq ft</span>
                        </div>
                      </div>
                    </div>

                    <!-- Capacity Breakdown -->
                    <div class="space-y-4">
                      <h4 class="font-semibold text-gray-900 mb-3">Capacity Options</h4>
                      <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Cocktail Style</span>
                          <span class="font-medium">250 guests</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Seated Dinner</span>
                          <span class="font-medium">200 guests</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                          <span class="text-gray-600">Theater Style</span>
                          <span class="font-medium">300 guests</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                          <span class="text-gray-600">Conference</span>
                          <span class="font-medium">150 guests</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Event Types -->
              <Card class="border-0 shadow-sm">
                <CardHeader class="">
                  <CardTitle class="flex items-center gap-2">
                    <Calendar class="h-5 w-5 text-pink-600" />
                    Perfect For These Events
                  </CardTitle>
                </CardHeader>
                <CardContent class="">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each [
                      { name: "Weddings", icon: Heart, color: "text-pink-600 bg-pink-50" },
                      { name: "Corporate Events", icon: Building, color: "text-blue-600 bg-blue-50" },
                      { name: "Galas & Fundraisers", icon: Star, color: "text-purple-600 bg-purple-50" },
                      { name: "Private Parties", icon: Users, color: "text-green-600 bg-green-50" },
                      { name: "Product Launches", icon: Sparkles, color: "text-yellow-600 bg-yellow-50" },
                      { name: "Award Ceremonies", icon: Star, color: "text-orange-600 bg-orange-50" },
                      { name: "Holiday Parties", icon: Calendar, color: "text-red-600 bg-red-50" },
                      { name: "Networking Events", icon: Users, color: "text-indigo-600 bg-indigo-50" }
                    ] as eventType}
                      <div class="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all group">
                        <div class="p-2 rounded-lg {eventType.color} group-hover:scale-110 transition-transform">
                          <svelte:component this={eventType.icon} class="h-5 w-5" />
                        </div>
                        <span class="font-medium text-sm">{eventType.name}</span>
                      </div>
                    {/each}
                  </div>
                </CardContent>
              </Card>

              <!-- Location & Accessibility -->
              <Card class="border-0 shadow-sm">
                <CardHeader class="">
                  <CardTitle class="flex items-center gap-2">
                    <MapPin class="h-5 w-5 text-green-600" />
                    Location & Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent class="">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-3">Transportation</h4>
                      <div class="space-y-2 text-gray-600">
                        <p class="flex items-center gap-2">
                          <Car class="h-4 w-4" />
                          Valet parking available ($15/car)
                        </p>
                        <p class="flex items-center gap-2">
                          <MapPin class="h-4 w-4" />
                          2 blocks from Grand Central Station
                        </p>
                        <p class="flex items-center gap-2">
                          <Users class="h-4 w-4" />
                          Multiple subway lines nearby
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-3">Accessibility</h4>
                      <div class="space-y-2 text-gray-600">
                        <p class="flex items-center gap-2">
                          <CheckCircle class="h-4 w-4 text-green-600" />
                          Wheelchair accessible
                        </p>
                        <p class="flex items-center gap-2">
                          <CheckCircle class="h-4 w-4 text-green-600" />
                          Accessible restrooms
                        </p>
                        <p class="flex items-center gap-2">
                          <CheckCircle class="h-4 w-4 text-green-600" />
                          Elevator access to all floors
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Quick Facts -->
              <Card class="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent class="p-6">
                  <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles class="h-5 w-5 text-blue-600" />
                    Quick Facts
                  </h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div class="text-center">
                      <p class="font-semibold text-blue-600">Established</p>
                      <p class="text-gray-600">2018</p>
                    </div>
                    <div class="text-center">
                      <p class="font-semibold text-blue-600">Events Hosted</p>
                      <p class="text-gray-600">500+</p>
                    </div>
                    <div class="text-center">
                      <p class="font-semibold text-blue-600">Staff</p>
                      <p class="text-gray-600">Professional</p>
                    </div>
                    <div class="text-center">
                      <p class="font-semibold text-blue-600">Availability</p>
                      <p class="text-gray-600">7 Days/Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          
          <!-- Amenities -->
          <TabsContent value="amenities" class="mt-6">
            <Card class="border-0 shadow-sm">
              <CardHeader class="">
                <CardTitle class="flex items-center gap-2">
                  <Sparkles class="h-5 w-5 text-yellow-600" />
                  Amenities & Services
                </CardTitle>
              </CardHeader>
              <CardContent class="">
                <div class="grid grid-cols-2 gap-4">
                  {#each venue.amenities as amenity}
                    <div class="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all group">
                      <div class="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        <svelte:component this={amenity.icon} class="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <h4 class="font-medium">{amenity.name}</h4>
                    </div>
                  {/each}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Policies -->
          <TabsContent value="policies" class="mt-6">
            <Card class="border-0 shadow-sm">
              <CardHeader class="">
                <CardTitle class="flex items-center gap-2">
                  <FileText class="h-5 w-5 text-purple-600" />
                  Venue Policies
                </CardTitle>
              </CardHeader>
              <CardContent class="">
                <div class="space-y-4">
                  {#each venue.policies as policy}
                    <div class="border rounded-lg p-4 {getPolicyColor(policy.type)} transition-all hover:shadow-md">
                      <div class="flex items-start gap-3">
                        <div class="p-2 rounded-lg bg-white/50">
                          <svelte:component this={policy.icon} class="h-5 w-5" />
                        </div>
                        <div class="flex-1">
                          <h4 class="font-semibold mb-2">{policy.title}</h4>
                          <p class="text-sm opacity-80">{policy.description}</p>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Reviews -->
          <TabsContent value="reviews" class="mt-6">
            <Card class="border-0 shadow-sm">
              <CardHeader class="">
                <CardTitle class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Star class="h-5 w-5 text-yellow-500" />
                    Reviews ({venue.reviewCount})
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Star class="h-4 w-4 fill-current text-yellow-400" />
                    <span class="font-semibold">{venue.rating}</span>
                    <span>out of 5</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent class="">
                <div class="space-y-6">
                  {#each venue.reviews as review}
                    <div class="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0" in:fly={{ y: 20, duration: 300 }}>
                      <div class="flex items-start gap-4">
                        <!-- Avatar -->
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.avatar}
                        </div>
                        
                        <div class="flex-1">
                          <!-- Header -->
                          <div class="flex items-center justify-between mb-2">
                            <div>
                              <h4 class="font-semibold text-gray-900">{review.name}</h4>
                              <p class="text-sm text-gray-500">{formatDate(review.date)}</p>
                            </div>
                            <div class="flex items-center gap-1">
                              {#each Array(5) as _, i}
                                <Star class="h-4 w-4 {i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}" />
                              {/each}
                            </div>
                          </div>
                          
                          <!-- Comment -->
                          <p class="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                          
                          <!-- Helpful -->
                          <div class="flex items-center gap-4 text-sm text-gray-500">
                            <button class="flex items-center gap-1 hover:text-blue-600 transition-colors">
                              <ThumbsUp class="h-4 w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                  
                  <!-- Load More Reviews -->
                  <div class="text-center pt-4">
                    <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <!-- Contact -->
          <TabsContent value="contact" class="mt-6">
            <Card class="border-0 shadow-sm">
              <CardHeader class="">
                <CardTitle class="flex items-center gap-2">
                  <MessageCircle class="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent class="">
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone class="h-5 w-5 text-blue-600" />
                    <div>
                      <p class="font-medium">(555) 123-4567</p>
                      <p class="text-sm text-gray-500">Available 9 AM - 6 PM</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail class="h-5 w-5 text-blue-600" />
                    <div>
                      <p class="font-medium">events@grandballroom.com</p>
                      <p class="text-sm text-gray-500">Response within 2 hours</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin class="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p class="font-medium">{venue.location}</p>
                      <p class="text-sm text-gray-500">Easy subway and taxi access</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Booking Sidebar -->
      <div class="sticky top-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div class="flex justify-between">
                <span class="text-xl font-semibold">Book Venue</span>
                <div class="text-right">
                  <div class="text-3xl font-bold">${venue.pricePerHour}</div>
                  <div class="text-blue-100 text-sm">per hour</div>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <form on:submit|preventDefault={handleBooking} class="space-y-4">
                <div>
                  <label class="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar class="h-4 w-4 text-blue-600" />
                    Date
                  </label>
                  <input type="date" bind:value={formData.date} class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="flex items-center gap-2 text-sm font-medium mb-2">
                      <Clock class="h-4 w-4 text-green-600" />
                      Start
                    </label>
                    <input type="time" bind:value={formData.startTime} class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="flex items-center gap-2 text-sm font-medium mb-2">
                      <Clock class="h-4 w-4 text-red-600" />
                      End
                    </label>
                    <input type="time" bind:value={formData.endTime} class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div>
                  <label class="flex items-center gap-2 text-sm font-medium mb-2">
                    <Users class="h-4 w-4 text-purple-600" />
                    Guests
                  </label>
                  <input type="number" max={venue.capacity} bind:value={formData.guestCount} 
                        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Price Calculation -->
                {#if calculateHours() > 0}
                  <div class="bg-gray-50 p-4 rounded-lg space-y-2" in:scale={{ duration: 300 }}>
                    <div class="flex justify-between text-sm">
                      <span>Duration: {calculateHours()} hours</span>
                      <span>${venue.pricePerHour} × {calculateHours()}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${venue.pricePerHour * calculateHours()}</span>
                    </div>
                  </div>
                {/if}

                <button 
                  type="submit" 
                  disabled={!isFormValid()}
                  class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold 
                        hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed 
                        transition-all transform hover:scale-105 active:scale-95">
                  {isFormValid() ? 'Book Now' : 'Complete Form to Book'}
                </button>
              </form>

              <!-- Success Message -->
              {#if showSuccess}
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3" 
                    in:fly={{ y: -20, duration: 300 }}>
                  <CheckCircle class="h-6 w-6 text-green-600" />
                  <div>
                    <p class="font-medium text-green-800">Booking Request Sent!</p>
                    <p class="text-sm text-green-600">We'll contact you within 2 hours.</p>
                  </div>
                </div>
              {/if}

              <!-- Quick Actions -->
              <div class="pt-4 border-t space-y-3">
                <button class="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle class="h-5 w-5" />
                  Message Venue
                </button>
                <button class="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone class="h-5 w-5" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
      </div>



    </div>
  </div>
</div>