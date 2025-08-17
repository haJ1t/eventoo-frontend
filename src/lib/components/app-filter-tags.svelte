<script>
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { X, Tag } from "lucide-svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let {
        selectedTags = $bindable([]),
        availableTags = [],
        label = "Tags",
        class: className = "",
        isOpen = $bindable(false),
        onToggle = null
    } = $props();

    function handleToggle() {
        isOpen = !isOpen;
        if (onToggle) onToggle();
        dispatch('toggle', { isOpen });
    }

    function toggleTag(tag) {
        if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(t => t !== tag);
        } else {
            selectedTags = [...selectedTags, tag];
        }
    }

    function clearAllTags() {
        selectedTags = [];
        isOpen = false;
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

<svelte:window onclick={handleClickOutside} />

<div class="relative dropdown-container {className}">
    <Button
        variant="outline"
        onclick={handleToggle}
        class="flex items-center gap-2"
    >
        <Tag class="h-4 w-4" />
        {label}
        {#if selectedTags.length > 0}
            <Badge variant="secondary" class="ml-2">{selectedTags.length}</Badge>
        {/if}
        <span class="transform transition-transform {isOpen ? 'rotate-180' : ''}">⌄</span>
    </Button>

    {#if isOpen}
        <div class="absolute z-10 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div class="p-2 space-y-1">
                {#each availableTags as tag}
                    <button
                        class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                        onclick={() => toggleTag(tag)}
                    >
                        <span>{tag}</span>
                        {#if selectedTags.includes(tag)}
                            <span class="text-sm">✓</span>
                        {/if}
                    </button>
                {/each}
            </div>

            {#if selectedTags.length > 0}
                <div class="p-2 border-t">
                    <button
                        onclick={clearAllTags}
                        class="text-xs text-red-500 hover:text-red-700 underline"
                    >
                        Clear All ({selectedTags.length})
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>