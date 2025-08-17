<script>
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { X } from "lucide-svelte";
    import { MapPin, User, User2, Tag } from "@lucide/svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let {
        selectedValues = $bindable([]),
        options = [],
        label = "Filter",
        icon = null,
        class: className = "",
        isOpen = $bindable(false),
        onToggle = null
    } = $props();

    function handleToggle() {
        isOpen = !isOpen;
        if (onToggle) onToggle();
        dispatch('toggle', { isOpen });
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
        dispatch('change', { selectedValues });
        dispatch('close');
    }

    function handleClickOutside(event) {
        if (!event.target.closest('.dropdown-container')) {
            if (isOpen) {
                isOpen = false;
                dispatch('close');
            }
        }
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
            <svelte:component this={icon} class="h-4 w-4" />
        {/if}
        {label}
        {#if selectedValues.length > 0}
            <Badge variant="secondary" class="ml-2">{selectedValues.length}</Badge>
        {/if}
        <span class="transform transition-transform {isOpen ? 'rotate-180' : ''}">⌄</span>
    </Button>

    <!-- Selected Values Display section removed -->

    {#if isOpen}
        <div class="absolute z-10 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div class="p-2 space-y-1">
                {#each options as option}
                    <button
                        class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                        onclick={() => toggleOption(option)}
                    >
                        <span>{option}</span>
                        {#if selectedValues.includes(option)}
                            <span class="text-sm">✓</span>
                        {/if}
                    </button>
                {/each}
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