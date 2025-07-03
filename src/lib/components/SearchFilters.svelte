<script>
    let searchQuery = '';
    let selectedLocation = '';
    let selectedEventSize = '';
</script>

<div class="flex items-center space-x-4 mb-8">
    <div class="relative flex-grow">
        <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input 
            class="w-full bg-gray-200 border-none rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Search events" 
            type="text"
            bind:value={searchQuery}
        />
    </div>
    
    <div class="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">
        <span class="text-gray-700">Location</span>
        <span class="material-icons text-gray-500">arrow_drop_down</span>
    </div>
    
    <div class="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">
        <span class="text-gray-700">Event Size</span>
        <span class="material-icons text-gray-500">arrow_drop_down</span>
    </div>
</div>
