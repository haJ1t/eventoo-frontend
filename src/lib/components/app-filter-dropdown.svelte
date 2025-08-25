<script>
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { X, Search } from "lucide-svelte";
    import { MapPin, User, User2, Tag } from "@lucide/svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let {
        selectedValues = $bindable([]),
        options = [], // Limited popular options for display
        allOptions = [], // All available options for searching
        label = "Filter",
        icon = null,
        class: className = "",
        isOpen = $bindable(false),
        onToggle = null
    } = $props();

    // Add search state
    let searchQuery = $state("");
    let searchInputRef;

    // Use allOptions for searching if provided, otherwise fall back to options
    const searchableOptions = allOptions.length > 0 ? allOptions : options;

    // Filtered options based on search query - FIXED: removed function call
    const filteredOptions = $derived(
        searchQuery.trim() === "" 
            ? options // When no search query, show the limited popular options
            : searchableOptions.filter(option => 
                option.toLowerCase().includes(searchQuery.toLowerCase())
            ) // When searching, search through ALL available options
    );

    function handleToggle() {
        isOpen = !isOpen;
        if (onToggle) onToggle();
        dispatch('toggle', { isOpen });
        
        // Focus search input when dropdown opens
        if (isOpen) {
            setTimeout(() => {
                if (searchInputRef) {
                    searchInputRef.focus();
                }
            }, 100);
        } else {
            // Clear search when dropdown closes
            searchQuery = "";
        }
    }

    function toggleOption(option) {
        if (selectedValues.includes(option)) {
            selectedValues = selectedValues.filter(v => v !== option);
        } else {
            selectedValues = [...selectedValues, option];
        }
        dispatch('change', { selectedValues });
    }

    function removeValue(valueToRemove) {
        selectedValues = selectedValues.filter(v => v !== valueToRemove);
        dispatch('change', { selectedValues });
    }

    function clearAllValues() {
        selectedValues = [];
        isOpen = false;
        searchQuery = "";
        dispatch('change', { selectedValues });
        dispatch('close');
    }

    function clearSearch() {
        searchQuery = "";
        if (searchInputRef) {
            searchInputRef.focus();
        }
    }

    function handleClickOutside(event) {
        if (!event.target.closest('.dropdown-container')) {
            if (isOpen) {
                isOpen = false;
                searchQuery = "";
                dispatch('close');
            }
        }
    }

    // Prevent dropdown from closing when clicking inside search input
    function handleSearchClick(event) {
        event.stopPropagation();
    }
</script>

<svelte:window onclick={handleClickOutside}/>

<div class="relative dropdown-container {className}">
    <Button
        variant="outline"
        onclick={handleToggle}
        class="flex items-center gap-2"
    >
        {#if icon}
            {#if typeof icon === 'function'}
                {@const Icon = icon}
                <Icon class="h-4 w-4" />
            {:else}
                <icon class="h-4 w-4"></icon>
            {/if}
        {/if}
        {label}
        {#if selectedValues.length > 0}
            <Badge variant="secondary" class="ml-2">{selectedValues.length}</Badge>
        {/if}
        <span class="transform transition-transform {isOpen ? 'rotate-180' : ''}">⌄</span>
    </Button>

    {#if isOpen}
        <div class="absolute z-10 mt-2 w-64 rounded-md bg-white shadow-lg border border-gray-200">
            <!-- Search Input -->
            <div class="p-3 border-b border-gray-100" onclick={handleSearchClick}>
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        bind:this={searchInputRef}
                        type="text"
                        placeholder="Search {label.toLowerCase()}..."
                        class="w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        bind:value={searchQuery}
                        onclick={handleSearchClick}
                    />
                    {#if searchQuery}
                        <button
                            type="button"
                            onclick={clearSearch}
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Options List -->
            <div class="max-h-48 overflow-y-auto">
                <div class="p-2 space-y-1">
                    {#if filteredOptions.length > 0}
                        {#each filteredOptions as option}
                            <button
                                class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                                onclick={() => toggleOption(option)}
                            >
                                <span>{option}</span>
                                {#if selectedValues.includes(option)}
                                    <span class="text-sm text-green-600">✓</span>
                                {/if}
                            </button>
                        {/each}
                    {:else}
                        <div class="px-4 py-3 text-sm text-gray-500 text-center">
                            No {label.toLowerCase()} found matching "{searchQuery}"
                        </div>
                    {/if}
                </div>
            </div>

            {#if selectedValues.length > 0}
                <div class="p-2 border-t">
                    <button
                        onclick={clearAllValues}
                        class="text-xs text-red-500 hover:text-red-700 underline"
                    >
                        Clear All ({selectedValues.length})
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>