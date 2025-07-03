<script>
    export let currentPage = 1;
    export let totalPages = 10;
    
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            // Handle page change logic here
        }
    }
</script>

<div class="flex justify-center mt-12 space-x-1">
    <button 
        class="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 flex items-center"
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
    >
        <span class="material-icons text-lg">chevron_left</span>
    </button>
    
    <button 
        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
        class:bg-blue-500={currentPage === 1}
        class:text-white={currentPage === 1}
        class:bg-white={currentPage !== 1}
        class:border={currentPage !== 1}
        class:border-gray-300={currentPage !== 1}
        class:text-gray-700={currentPage !== 1}
        on:click={() => goToPage(1)}
    >
        1
    </button>
    
    {#each Array(Math.min(3, totalPages - 1)) as _, i}
        <button 
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
            on:click={() => goToPage(i + 2)}
        >
            {i + 2}
        </button>
    {/each}
    
    {#if totalPages > 4}
        <span class="flex items-center px-2 text-gray-500">...</span>
        <button 
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
            on:click={() => goToPage(totalPages)}
        >
            {totalPages}
        </button>
    {/if}
    
    <button 
        class="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 flex items-center"
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        <span class="material-icons text-lg">chevron_right</span>
    </button>
</div>
