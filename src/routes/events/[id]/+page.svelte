<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { 
      ArrowLeft, 
      Calendar, 
      MapPin, 
      Users, 
      Share2, 
      Heart,
      Star,
      Clock,
      DollarSign,
      Tag,
      MessageCircle,
      User,
      ExternalLink,
      Download,
      Bell,
      CheckCircle
    } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import { fade, fly } from 'svelte/transition';
  
    // Event ID'yi URL'den al
    const eventId = $page.params.id;
  
    // Mock data - gerçek uygulamada API'den gelecek
    const events = [
      {
        id: 1,
        title: "Tech Conference 2024",
        date: "July 15, 2024",
        time: "09:00 AM - 06:00 PM",
        location: "San Francisco, CA",
        address: "Moscone Center, 747 Howard St, San Francisco, CA 94103",
        size: "Medium (101-1000)",
        attendees: "500 Attendees",
        maxAttendees: 1000,
        status: "Scheduled",
        image: "/images/eventImages/tech.jpg",
        description: "Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities. This comprehensive event will cover the latest trends in AI, blockchain, cloud computing, and software development.",
        organizer: "Tech Events Inc.",
        organizerImage: "/images/organizers/tech-events.jpg",
        price: "$299",
        originalPrice: "$399",
        category: "Technology",
        tags: ["Technology", "Conference", "Networking", "AI", "Blockchain"],
        rating: 4.8,
        reviews: 156,
        highlights: [
          "50+ Expert Speakers",
          "Interactive Workshops",
          "Networking Sessions",
          "Free Lunch & Coffee",
          "Certificate of Attendance"
        ],
        agenda: [
          { time: "09:00 AM", title: "Registration & Welcome Coffee" },
          { time: "10:00 AM", title: "Keynote: Future of AI" },
          { time: "11:30 AM", title: "Workshop: Blockchain Basics" },
          { time: "01:00 PM", title: "Lunch Break" },
          { time: "02:00 PM", title: "Panel: Cloud Computing Trends" },
          { time: "04:00 PM", title: "Networking Session" },
          { time: "05:30 PM", title: "Closing Ceremony" }
        ],
        speakers: [
          { name: "John Doe", title: "AI Expert", company: "TechCorp", image: "/images/speakers/john.jpg" },
          { name: "Jane Smith", title: "Blockchain Developer", company: "CryptoInc", image: "/images/speakers/jane.jpg" },
          { name: "Mike Johnson", title: "Cloud Architect", company: "CloudTech", image: "/images/speakers/mike.jpg" }
        ],
        comments: [
          { 
            id: 1, 
            user: "Alice Cooper", 
            avatar: "/images/users/alice.jpg",
            rating: 5, 
            comment: "Amazing event! Learned so much about AI trends.",
            date: "2 days ago"
          },
          { 
            id: 2, 
            user: "Bob Wilson", 
            avatar: "/images/users/bob.jpg",
            rating: 4, 
            comment: "Great networking opportunities and excellent speakers.",
            date: "1 week ago"
          }
        ]
      }
      // Diğer eventler...
    ];
  
    // Event'i bul
    const event = events.find(e => e.id === parseInt(eventId)) || events[0];
  
    let isLiked = $state(false);
    let isRegistered = $state(false);
    let showAllComments = $state(false);
    let newComment = $state('');
    let userRating = $state(0);
  
    function toggleLike() {
      isLiked = !isLiked;
    }
  
    function handleRegister() {
      isRegistered = !isRegistered;
    }
  
    function shareEvent() {
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        // Toast notification burada olabilir
      }
    }
  
    function goBack() {
      goto('/events');
    }
  
    function submitComment() {
      if (newComment.trim()) {
        // Comment submit logic
        newComment = '';
        userRating = 0;
      }
    }
  </script>
  
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header with Back Button -->
    <div class="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            onclick={goBack}
            disabled={false}
            class="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to Events
          </Button>
          
          <div class="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onclick={toggleLike}
              disabled={false}
              class="flex items-center gap-2 {isLiked ? 'text-red-500' : 'text-gray-500'}"
            >
              <Heart class="w-4 h-4 {isLiked ? 'fill-current' : ''}" />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onclick={shareEvent}
              disabled={false}
              class="flex items-center gap-2"
            >
              <Share2 class="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Hero Image & Title -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden" in:fade={{duration: 600}}>
            <div class="relative h-96 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6">
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each event.tags as tag}
                    <span class="bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  {/each}
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
                <div class="flex items-center gap-4 text-white/90">
                  <div class="flex items-center gap-1">
                    <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span class="font-medium">{event.rating}</span>
                    <span class="text-sm">({event.reviews} reviews)</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Users class="w-4 h-4" />
                    <span class="text-sm">{event.attendees}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Event Details -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8" in:fly={{y: 50, duration: 600, delay: 200}}>
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar class="w-6 h-6 text-blue-600" />
              Event Details
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <Calendar class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p class="font-medium">{event.date}</p>
                    <p class="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <MapPin class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p class="font-medium">{event.location}</p>
                    <p class="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <Users class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p class="font-medium">{event.size}</p>
                    <p class="text-sm text-gray-500">{event.attendees} registered</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <DollarSign class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-2xl font-bold text-green-600">{event.price}</span>
                      {#if event.originalPrice}
                        <span class="text-sm text-gray-500 line-through">{event.originalPrice}</span>
                      {/if}
                    </div>
                    <p class="text-sm text-gray-500">Early bird pricing</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <User class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p class="font-medium">{event.organizer}</p>
                    <p class="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <Tag class="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p class="font-medium">{event.category}</p>
                    <p class="text-sm text-gray-500">Category</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Description -->
            <div class="border-t pt-6">
              <h3 class="text-xl font-semibold mb-4">About This Event</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>
  
            <!-- Highlights -->
            <div class="border-t pt-6 mt-6">
              <h3 class="text-xl font-semibold mb-4">Event Highlights</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each event.highlights as highlight}
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-5 h-5 text-green-500" />
                    <span class="text-gray-600 dark:text-gray-300">{highlight}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
  
          <!-- Agenda -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8" in:fly={{y: 50, duration: 600, delay: 400}}>
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock class="w-6 h-6 text-purple-600" />
              Event Agenda
            </h2>
            
            <div class="space-y-4">
              {#each event.agenda as item, index}
                <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span class="text-purple-600 dark:text-purple-400 font-semibold text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="text-sm font-medium text-purple-600 dark:text-purple-400">{item.time}</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                  </div>
                </div>
              {/each}
            </div>
          </div>
  
          <!-- Speakers -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8" in:fly={{y: 50, duration: 600, delay: 600}}>
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users class="w-6 h-6 text-orange-600" />
              Featured Speakers
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {#each event.speakers as speaker}
                <div class="text-center group">
                  <div class="relative mb-4">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      class="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div class="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">{speaker.name}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{speaker.title}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">{speaker.company}</p>
                </div>
              {/each}
            </div>
          </div>
  
          <!-- Comments & Reviews -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8" in:fly={{y: 50, duration: 600, delay: 800}}>
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle class="w-6 h-6 text-green-600" />
              Reviews & Comments
            </h2>
  
            <!-- Add Comment Form -->
            <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h3 class="font-semibold mb-4">Share your thoughts</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm">Your rating:</span>
                  <div class="flex gap-1">
                    {#each Array(5) as _, i}
                      <button 
                        onclick={() => userRating = i + 1}
                        class="text-2xl {i < userRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors"
                      >
                        ★
                      </button>
                    {/each}
                  </div>
                </div>
                <textarea 
                  bind:value={newComment}
                  placeholder="Write your review..."
                  class="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <Button 
                  onclick={submitComment} 
                  disabled={false}
                  class="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Review
                </Button>
              </div>
            </div>
  
            <!-- Comments List -->
            <div class="space-y-6">
              {#each event.comments.slice(0, showAllComments ? event.comments.length : 2) as comment}
                <div class="flex gap-4">
                  <!-- Avatar yerine gradient div -->
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.user.charAt(0).toUpperCase()}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="font-semibold">{comment.user}</h4>
                      <div class="flex gap-1">
                        {#each Array(5) as _, i}
                          <Star class="w-3 h-3 {i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                        {/each}
                      </div>
                      <span class="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300">{comment.comment}</p>
                  </div>
                </div>
              {/each}
              
              {#if event.comments.length > 2}
                <Button 
                  variant="outline" 
                  onclick={() => showAllComments = !showAllComments}
                  disabled={false}
                  class="w-full"
                >
                  {showAllComments ? 'Show Less' : `Show All ${event.comments.length} Reviews`}
                </Button>
              {/if}
            </div>
          </div>
        </div>
  
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <!-- Registration Card -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6" in:fly={{x: 50, duration: 600, delay: 300}}>
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-green-600 mb-2">{event.price}</div>
                {#if event.originalPrice}
                  <div class="text-sm text-gray-500 line-through">{event.originalPrice}</div>
                {/if}
                <div class="text-sm text-gray-600 mt-1">per person</div>
              </div>
  
              <div class="space-y-4 mb-6">
                <div class="flex justify-between text-sm">
                  <span>Available spots:</span>
                  <span class="font-medium">{event.maxAttendees - parseInt(event.attendees)} left</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full transition-all duration-500" 
                    style="width: {(parseInt(event.attendees) / event.maxAttendees) * 100}%"
                  ></div>
                </div>
              </div>
  
              <Button 
                onclick={handleRegister}
                disabled={false}
                class="w-full {isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isRegistered ? 'Registered ✓' : 'Register Now'}
              </Button>
  
              <div class="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={false}
                  class="flex-1"
                >
                  <Bell class="w-4 h-4 mr-2" />
                  Remind Me
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={false}
                  class="flex-1"
                >
                  <Download class="w-4 h-4 mr-2" />
                  Save Event
                </Button>
              </div>
            </div>
  
            <!-- Event Stats -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6" in:fly={{x: 50, duration: 600, delay: 500}}>
              <h3 class="font-semibold mb-4">Event Statistics</h3>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Registered</span>
                  <span class="font-semibold">{event.attendees}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Capacity</span>
                  <span class="font-semibold">{event.maxAttendees}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Rating</span>
                  <span class="font-semibold flex items-center gap-1">
                    <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    {event.rating}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Reviews</span>
                  <span class="font-semibold">{event.reviews}</span>
                </div>
              </div>
            </div>
  
            <!-- Organizer Info -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6" in:fly={{x: 50, duration: 600, delay: 700}}>
              <h3 class="font-semibold mb-4">Organizer</h3>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {event.organizer.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 class="font-medium">{event.organizer}</h4>
                  <p class="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                disabled={false}
                class="w-full"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
  
            <!-- Map Preview -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6" in:fly={{x: 50, duration: 600, delay: 900}}>
              <h3 class="font-semibold mb-4">Location</h3>
              <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <MapPin class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{event.address}</p>
              <Button 
                variant="outline" 
                disabled={false}
                class="w-full"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View on Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  