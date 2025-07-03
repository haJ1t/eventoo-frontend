<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    $: currentPath = $page.url.pathname;

    let sidebarOpen = false;

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function closeSidebar() {
        sidebarOpen = false;
    }

    function handleClickOutside(event) {
        if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-toggle')) {
            closeSidebar();
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<!-- Mobile menu toggle button -->
<button 
    class="menu-toggle fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg border"
    on:click={toggleSidebar}
>
    <span class="material-icons text-gray-700">
        {sidebarOpen ? 'close' : 'menu'}
    </span>
</button>

<!-- Overlay for mobile -->
{#if sidebarOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" on:click={closeSidebar}></div>
{/if}

<!-- Sidebar -->
<aside 
    class="sidebar w-64 bg-white border-r fixed md:relative h-full z-40 transition-transform duration-300 ease-in-out flex flex-col"
    class:translate-x-0={sidebarOpen}
    class:-translate-x-full={!sidebarOpen}
    class:md:translate-x-0={true}
>
    <!-- Scrollable content (üst kısım + nav) -->
    <div class="flex-1 overflow-y-auto">
        <div class="px-8 py-6">
            <h1 class="text-2xl font-bold">Evently</h1>
        </div>

        <nav class="mt-8 space-y-1">
            <a 
                class="flex items-center px-8 py-3 text-gray-700 hover:bg-gray-100"
                class:bg-gray-200={currentPath === '/'}
                class:text-gray-900={currentPath === '/'}
                href="/"
                on:click={closeSidebar}
            >
                <span class="material-icons mr-3">home</span>
                Home
            </a>

            <a 
                class="flex items-center px-8 py-3 text-gray-700 hover:bg-gray-100"
                class:bg-gray-200={currentPath === '/events'}
                class:text-gray-900={currentPath === '/events'}
                href="/events"
                on:click={closeSidebar}
            >
                <div class="relative">
                    <span class="material-icons mr-3">event</span>
                    <span class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs text-white bg-black rounded-full">12</span>
                </div>
                Events
            </a>

            <a 
                class="flex items-center px-8 py-3 text-gray-700 hover:bg-gray-100"
                class:bg-gray-200={currentPath === '/venues'}
                class:text-gray-900={currentPath === '/venues'}
                href="/venues"
                on:click={closeSidebar}
            >
                <span class="material-icons mr-3">place</span>
                Venues
            </a>

            <a 
                class="flex items-center px-8 py-3 text-gray-700 hover:bg-gray-100"
                class:bg-gray-200={currentPath === '/attendees'}
                class:text-gray-900={currentPath === '/attendees'}
                href="/attendees"
                on:click={closeSidebar}
            >
                <span class="material-icons mr-3">people</span>
                Attendees
            </a>
        </nav>
    </div>

    <!-- Alt butonlar: Scroll sonunda görünür -->
    <div class="border-t">
        <a 
            class="flex items-center px-8 py-3 text-gray-700 hover:bg-gray-100" 
            href="/settings" 
            on:click={closeSidebar}
        >
            <span class="material-icons mr-3">settings</span>
            Settings
        </a>

        <button 
            class="flex items-center px-8 py-3 text-red-500 hover:bg-gray-100 w-full text-left"
        >
            <span class="material-icons mr-3">logout</span>
            Logout
        </button>
    </div>
</aside>
