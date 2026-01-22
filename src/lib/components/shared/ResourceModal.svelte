<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
    } from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import {
        MapPin,
        Star,
        Share2,
        Heart,
        X,
        ExternalLink,
    } from "lucide-svelte";

    import RatingSection from "./RatingSection.svelte";

    export let open: boolean = false;
    export let title: string;
    export let image: string;
    export let location: string;
    export let rating: number | undefined = undefined;
    export let tags: string[] = [];
    export let description: string;

    // Custom slots/sections
    export let showRating = true;
    export let ratingTitle = "Rate This";
    export let onRatingSubmit:
        | ((rating: number, text: string) => void)
        | undefined = undefined;

    // Actions
    export let primaryActionLabel = "Book Now";
    export let secondaryActionLabel = "View Full Details";
    export let onPrimaryAction: (() => void) | undefined = undefined;
    export let onSecondaryAction: (() => void) | undefined = undefined;

    const dispatch = createEventDispatcher();
    let isLiked = false;

    function handleClose() {
        open = false;
        dispatch("close");
    }

    function toggleLike() {
        isLiked = !isLiked;
    }

    function share() {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: description,
                url: window.location.href,
            });
        }
    }
</script>

<Dialog bind:open on:close={handleClose}>
    <DialogContent
        portalProps={{}}
        class="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0"
    >
        <!-- Hero Image Section -->
        <div class="relative h-64 w-full group">
            <img
                src={image || "/api/placeholder/800/400"}
                alt={title}
                class="w-full h-full object-cover"
            />
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            ></div>

            <!-- Top Actions -->
            <div class="absolute top-4 right-12 flex gap-2">
                <button
                    on:click={toggleLike}
                    class="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full transition-all hover:scale-110"
                >
                    <Heart
                        class="w-5 h-5 {isLiked
                            ? 'fill-red-500 text-red-500'
                            : ''}"
                    />
                </button>
                <button
                    on:click={share}
                    class="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full transition-all hover:scale-110"
                >
                    <Share2 class="w-5 h-5" />
                </button>
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-0 left-0 p-6 w-full text-white">
                {#if tags.length > 0}
                    <div class="flex flex-wrap gap-2 mb-2">
                        {#each tags as tag}
                            <Badge
                                variant="secondary"
                                class="bg-white/20 text-white border-none hover:bg-white/30"
                            >
                                {tag}
                            </Badge>
                        {/each}
                    </div>
                {/if}
                <h2 class="text-3xl font-bold mb-1 shadow-black drop-shadow-lg">
                    {title}
                </h2>
                <div
                    class="flex items-center text-white/90 text-sm font-medium"
                >
                    <MapPin class="w-4 h-4 mr-1.5" />
                    {location}
                    {#if rating}
                        <div class="flex items-center ml-4 text-amber-300">
                            <Star class="w-4 h-4 mr-1 fill-current" />
                            {rating} / 5
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="p-6 space-y-8">
            <!-- Key Stats / Grid Slot -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <div
                        class="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                    >
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                            About
                        </h3>
                        <p>{description}</p>
                    </div>
                    <!-- Extra Info Slot (e.g. Schedule, Contact) -->
                    <slot name="extra-info" />
                </div>

                <div class="space-y-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        Highlights
                    </h3>
                    <!-- Metrics/Details Slot -->
                    <slot name="metrics" />
                </div>
            </div>

            <!-- Full Width Content Slot (e.g. Map, Amenities) -->
            <slot name="full-width" />

            {#if showRating}
                <Separator />
                <RatingSection
                    title={ratingTitle}
                    onSubmit={onRatingSubmit || ((r, t) => console.log(r, t))}
                />
            {/if}
        </div>

        <!-- Sticky Footer -->
        <div
            class="p-4 bg-white border-t border-gray-100 flex gap-3 sticky bottom-0 z-10"
        >
            <Button
                class="flex-1 text-lg h-12 shadow-lg hover:shadow-xl transition-all"
                on:click={onPrimaryAction}
            >
                {primaryActionLabel}
            </Button>
            {#if onSecondaryAction}
                <Button
                    variant="outline"
                    class="flex-1 h-12"
                    on:click={onSecondaryAction}
                >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    {secondaryActionLabel}
                </Button>
            {/if}
        </div>
    </DialogContent>
</Dialog>
