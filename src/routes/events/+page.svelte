<script>
    import EventCard from '$lib/components/EventCard.svelte';
    import SearchFilters from '$lib/components/SearchFilters.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    
    let events = [
        {
            id: 1,
            title: "Tech Conference 2024",
            date: "July 15, 2024",
            venue: "Grand Ballroom",
            attendees: 500,
            status: "Scheduled",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYCUKCFKTr57KJ7eejv-F2VstSpXxmPuBAtRLrKjkhr1wfvUtNy2sIlxCkQKuuUAv3EkPpbOSTdjtjtjZ4ADRO_d-aXHgCFIr1RIp0mdTtTe5spy8MmMo_vNqThjBatRyIZ2B3zFipfE7VvjIUqAbOoKcGLTIV0VjgElsisLa7XFd3KspRVAQO0GrYAeC24PBafJJ67UtmGwS5EXgOeKtXc8DJf2lY1NmYcNq9M__9Ty55PYSasvl7qGWN2KGzvplOUH0jSx_rFoA"
        },
        {
            id: 2,
            title: "Summer Music Festival",
            date: "August 20, 2024",
            venue: "Central Park",
            attendees: 10000,
            status: "Scheduled",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW899Wl1SU8ouecYrw7w1_7cGh6Fsji-tiX7iNxR2dqzsqKdCv32h_CsH75y2ntKq7FIXKkfF1YFowwsD5QqsdqWD8fDDda8_Dup68wPmmUVC3rZPgHs6VSLEeAQFIKzUS6b1cBZExS4s-MOUG6GT19qeAXxUR3VxfSRBLNae_2ddorMrmKoRpTcWLUQ6RUZdXvFxYiRDXnNQUbBtDaaLtWs306v8BQpt-WJ_kNk1yCU3OssaIMeoOt4fxxMmvdVa85t6o5NQCmuc"
        },
        {
            id: 3,
            title: "Art Exhibition",
            date: "September 5, 2024",
            venue: "City Art Gallery",
            attendees: 200,
            status: "Scheduled",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyx-1ZWDfw5ScwXlPU42q2qF0IgirviAlSIMiUksiEBVKz6_Xb_8K7RY9pXJltx1UorrUh4PB3Dw4EHnmCxdX2ITyhs3u4ynrbaBsOemiZeeU3ex5SlNkeEksxJROWnyXIv9PBkfAOqwAzT4MuWmY79paMIa4lBpZvFizewSwlV2Nz6yKrxojQorewPzJ8E8QD89U1HJwT2cr2Zx_QxLJmCbypUmXCK50o-xGZc5HbDw7_jPowX3yyhgIGS1FMenPPSMe1ddqDiz8"
        },
        {
            id: 4,
            title: "Business Networking Event",
            date: "October 12, 2024",
            venue: "Convention Center",
            attendees: 300,
            status: "Scheduled",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB36EQ0NNZ_XrVhWdAc0U40s-7QOFhmux6usnaYZ6Kk37nCKgZwIuoVFv1aVil8ESFJpIZFv1XwseMiiQRv7G7g_x5ubCtEMaU6lKfLvoje7FPiBtmxOC5hNHxfD-vDRyxIbM_3wgQWntrp_scWIyycyoy7DNGh77ZuRwOc1KE005tyO6AQFKIEz43igvL2UYl0H2KP7QUPUlyeZoN1HKFlTrRE8Q6345KpnZa6CHm0jIY4bakCket1Nu2P159HPU78N_oGiVFf6EI"
        },
        {
            id: 5,
            title: "Charity Gala",
            date: "November 22, 2024",
            venue: "Luxury Hotel",
            attendees: 400,
            status: "Scheduled",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs5uwN9hL-iOWZAfUL1GJDMe5pW2lCEGaULVK8Mrx0UKSso5xEUzIvc-_f9hMSyJzz3jydxjoP7RgEYhB_hIHMZ6wqcb3jScVnZ_v0oTC1VhVNdmK520J4DOsi_SCEtdKkPbA1PCxTtzU6ApAoI9LpUh7FXhzRtv3fFVMGn1zmhZtiZ6Ozp-sNcVNlTLs6rIjkgZBKK_0NVuyaNgECI4zRFZTIARMUWL3rlKkA4NnS_GFZvpLSRBFA_HbgrOwnfFI_xaQAYD3Zaxg"
        },
        {
            id: 6,
            title: "Food & Wine Festival",
            date: "December 8, 2024",
            venue: "Riverside Park",
            attendees: 2500,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
        },
        {
            id: 7,
            title: "Corporate Training Workshop",
            date: "January 15, 2025",
            venue: "Training Center A",
            attendees: 50,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
        },
        {
            id: 8,
            title: "Wedding Reception",
            date: "February 14, 2025",
            venue: "Garden Pavilion",
            attendees: 120,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
        },
        {
            id: 9,
            title: "Product Launch Event",
            date: "March 10, 2025",
            venue: "Innovation Hub",
            attendees: 250,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
        },
        {
            id: 10,
            title: "Marathon Event",
            date: "April 5, 2025",
            venue: "City Streets",
            attendees: 5000,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop"
        },
        {
            id: 11,
            title: "Science Fair",
            date: "May 18, 2025",
            venue: "Science Museum",
            attendees: 800,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop"
        },
        {
            id: 12,
            title: "Fashion Show",
            date: "June 25, 2025",
            venue: "Fashion District",
            attendees: 350,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop"
        },
        {
            id: 13,
            title: "Gaming Tournament",
            date: "July 12, 2025",
            venue: "Esports Arena",
            attendees: 1200,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        },
        {
            id: 14,
            title: "Book Fair",
            date: "August 8, 2025",
            venue: "Public Library",
            attendees: 600,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
        },
        {
            id: 15,
            title: "Startup Pitch Competition",
            date: "September 20, 2025",
            venue: "Tech Incubator",
            attendees: 180,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
        },
        {
            id: 16,
            title: "Halloween Party",
            date: "October 31, 2025",
            venue: "Community Center",
            attendees: 450,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1509557965043-6b9f3a516d40?w=400&h=300&fit=crop"
        },
        {
            id: 17,
            title: "Christmas Market",
            date: "December 15, 2025",
            venue: "Town Square",
            attendees: 3000,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop"
        },
        {
            id: 18,
            title: "Yoga Retreat",
            date: "January 20, 2026",
            venue: "Mountain Resort",
            attendees: 80,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        },
        {
            id: 19,
            title: "Photography Workshop",
            date: "February 28, 2026",
            venue: "Art Studio",
            attendees: 25,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop"
        },
        {
            id: 20,
            title: "Music Concert",
            date: "March 15, 2026",
            venue: "Concert Hall",
            attendees: 1500,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
        },
        {
            id: 21,
            title: "Cooking Class",
            date: "April 10, 2026",
            venue: "Culinary School",
            attendees: 30,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
        },
        {
            id: 22,
            title: "Dance Competition",
            date: "May 5, 2026",
            venue: "Dance Studio",
            attendees: 200,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop"
        },
        {
            id: 23,
            title: "Film Festival",
            date: "June 18, 2026",
            venue: "Cinema Complex",
            attendees: 900,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1489599904472-c2c8c6e8b8a2?w=400&h=300&fit=crop"
        },
        {
            id: 24,
            title: "Pet Show",
            date: "July 22, 2026",
            venue: "Park Pavilion",
            attendees: 400,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop"
        },
        {
            id: 25,
            title: "Vintage Car Show",
            date: "August 14, 2026",
            venue: "Exhibition Ground",
            attendees: 1800,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"
        },
        {
            id: 26,
            title: "Garden Party",
            date: "September 12, 2026",
            venue: "Botanical Garden",
            attendees: 150,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
        },
        {
            id: 27,
            title: "Craft Fair",
            date: "October 8, 2026",
            venue: "Artisan Market",
            attendees: 650,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop"
        },
        {
            id: 28,
            title: "Wine Tasting",
            date: "November 16, 2026",
            venue: "Vineyard",
            attendees: 100,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop"
        },
        {
            id: 29,
            title: "New Year Gala",
            date: "December 31, 2026",
            venue: "Grand Hotel",
            attendees: 500,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=300&fit=crop"
        },
        {
            id: 30,
            title: "Fitness Bootcamp",
            date: "January 25, 2027",
            venue: "Sports Complex",
            attendees: 75,
            status: "Confirmed",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        },
        {
            id: 31,
            title: "Comedy Night",
            date: "February 18, 2027",
            venue: "Comedy Club",
            attendees: 120,
            status: "Scheduled",
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"
        },
        {
            id: 32,
            title: "Farmers Market",
            date: "March 20, 2027",
            venue: "Market Square",
            attendees: 800,
            status: "Planning",
            image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop"
        }
    ];
    
    // Pagination - 8 events per page
    let currentPage = 1;
    let eventsPerPage = 8;
    let totalPages = Math.ceil(events.length / eventsPerPage);
    
    // Get events for current page
    $: paginatedEvents = events.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );
    
    // Search and filter functionality
    let searchQuery = '';
    let filteredEvents = events;
    
    $: {
        if (searchQuery.trim()) {
            filteredEvents = events.filter(event => 
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.venue.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            filteredEvents = events;
        }
        
        // Recalculate pagination
        totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
        currentPage = 1; // Reset to first page when filtering
        
        paginatedEvents = filteredEvents.slice(
            (currentPage - 1) * eventsPerPage,
            currentPage * eventsPerPage
        );
    }
    
    function handleNewEvent() {
        console.log('Creating new event...');
        // Navigate to new event page or open modal
    }
    
    function handlePageChange(page) {
        currentPage = page;
        paginatedEvents = filteredEvents.slice(
            (currentPage - 1) * eventsPerPage,
            currentPage * eventsPerPage
        );
        
        // Scroll to top of events grid
        document.querySelector('.events-grid')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
</script>

<svelte:head>
    <title>Events - Evently</title>
</svelte:head>

<div class="p-8 h-screen flex flex-col">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h2 class="text-3xl font-bold">Events</h2>
            <p class="text-gray-600 mt-1">
                Showing {paginatedEvents.length} of {filteredEvents.length} events
            </p>
        </div>
        <button 
            class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            on:click={handleNewEvent}
        >
            New Event
        </button>
    </div>
    
    <!-- Search and Filters -->
    <div class="flex items-center space-x-4 mb-6">
        <div class="relative flex-grow">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
                class="w-full bg-gray-200 border-none rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Search events by name or venue" 
                type="text"
                bind:value={searchQuery}
            />
        </div>
        
        <div class="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
            <span class="text-gray-700">Location</span>
            <span class="material-icons text-gray-500">arrow_drop_down</span>
        </div>
        
        <div class="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
            <span class="text-gray-700">Event Size</span>
            <span class="material-icons text-gray-500">arrow_drop_down</span>
        </div>
        
        <div class="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
            <span class="text-gray-700">Status</span>
            <span class="material-icons text-gray-500">arrow_drop_down</span>
        </div>
    </div>
    
    <!-- Events Grid - Fixed height for 8 cards -->
    <div class="events-grid grid grid-cols-4 gap-6 flex-1 mb-6">
        {#each paginatedEvents as event (event.id)}
            <EventCard {event} />
        {/each}
    </div>
    
    <!-- No Results Message -->
    {#if filteredEvents.length === 0}
        <div class="text-center py-12 flex-1 flex flex-col justify-center">
            <span class="material-icons text-gray-400 text-6xl mb-4">search_off</span>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p class="text-gray-600">Try adjusting your search or filters</p>
        </div>
    {/if}
    
    <!-- Pagination - Fixed at bottom -->
    {#if totalPages > 1}
        <div class="flex justify-center space-x-1 mt-auto">
            <button 
                class="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <span class="material-icons text-lg">chevron_left</span>
            </button>
            
            {#each Array(Math.min(5, totalPages)) as _, i}
                {@const pageNum = i + 1}
                <button 
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    class:bg-blue-500={currentPage === pageNum}
                    class:text-white={currentPage === pageNum}
                    class:bg-white={currentPage !== pageNum}
                    class:border={currentPage !== pageNum}
                    class:border-gray-300={currentPage !== pageNum}
                    class:text-gray-700={currentPage !== pageNum}
                    class:hover:bg-gray-100={currentPage !== pageNum}
                    on:click={() => handlePageChange(pageNum)}
                >
                    {pageNum}
                </button>
            {/each}
            
            {#if totalPages > 5}
                <span class="flex items-center px-2 text-gray-500">...</span>
                <button 
                    class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
                    on:click={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            {/if}
            
            <button 
                class="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span class="material-icons text-lg">chevron_right</span>
            </button>
        </div>
        
        <!-- Page Info -->
        <div class="text-center mt-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
        </div>
    {/if}
</div>

<style>
    .events-grid {
        /* 2 rows of 4 cards each = 8 cards total */
        grid-template-rows: 1fr 1fr;
        height: calc(100vh - 300px); /* Adjust based on header and pagination height */
    }
</style>
