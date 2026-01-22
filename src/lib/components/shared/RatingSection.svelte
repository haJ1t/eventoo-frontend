<script lang="ts">
    import { Star } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    export let initialRating = 0;
    export let onSubmit: (rating: number, text: string) => void;
    export let title = "Rate This";

    // State
    let userRating = initialRating;
    let hoverRating = 0;
    let reviewText = "";
    let submitted = false;

    function setRating(rating: number) {
        if (!submitted) {
            userRating = rating;
            hoverRating = 0;
        }
    }

    function handleMouseEnter(rating: number) {
        if (!submitted) {
            hoverRating = rating;
        }
    }

    function handleMouseLeave() {
        hoverRating = 0;
    }

    function handleSubmit() {
        if (userRating > 0 && reviewText.trim()) {
            submitted = true;
            onSubmit(userRating, reviewText);
        }
    }

    function handleClear() {
        userRating = 0;
        hoverRating = 0;
        reviewText = "";
        submitted = false;
    }

    function handleChange() {
        submitted = false;
    }
</script>

<div class="space-y-4">
    <h3 class="text-lg font-semibold">{title}</h3>
    <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
        {#if !submitted}
            <p class="text-gray-600 mb-4">
                How would you rate your experience?
            </p>

            <!-- Star Rating Input -->
            <div class="mb-4">
                <div class="flex items-center gap-2 mb-2">
                    {#each Array(5) as _, i}
                        {@const starIndex = i + 1}
                        {@const isActive =
                            hoverRating > 0
                                ? starIndex <= hoverRating
                                : starIndex <= userRating}
                        <button
                            type="button"
                            on:click={() => setRating(starIndex)}
                            on:mouseenter={() => handleMouseEnter(starIndex)}
                            on:mouseleave={handleMouseLeave}
                            class="transition-all hover:scale-110 transform focus:outline-none"
                        >
                            <Star
                                class="w-8 h-8 {isActive
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'}"
                            />
                        </button>
                    {/each}
                    {#if (hoverRating > 0 ? hoverRating : userRating) > 0}
                        <span class="ml-2 text-lg font-medium text-gray-700">
                            {hoverRating > 0 ? hoverRating : userRating} out of 5
                        </span>
                    {/if}
                </div>
            </div>

            <!-- Review Text Input -->
            {#if userRating > 0}
                <div class="mb-4" role="group">
                    <label
                        for="review-text"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Write your review <span class="text-red-500">*</span>
                    </label>
                    <textarea
                        id="review-text"
                        bind:value={reviewText}
                        placeholder="Share your experience..."
                        class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        rows="4"
                    ></textarea>
                    {#if reviewText.trim().length < 10 && reviewText.length > 0}
                        <p class="text-sm text-red-500 mt-1">
                            Review must be at least 10 characters long
                        </p>
                    {/if}
                </div>

                <div class="flex gap-3">
                    <Button
                        on:click={handleSubmit}
                        disabled={!reviewText.trim() ||
                            reviewText.trim().length < 10}
                        class=""
                    >
                        Submit Review
                    </Button>
                    <Button
                        on:click={handleClear}
                        variant="outline"
                        class=""
                        disabled={false}
                    >
                        Clear
                    </Button>
                </div>
            {/if}
        {:else}
            <!-- Submitted State -->
            <div class="text-center">
                <p class="text-green-600 font-medium mb-3">
                    Thank you for your review!
                </p>
                <div class="flex justify-center items-center gap-2 mb-3">
                    <span class="text-gray-600">You rated:</span>
                    {#each Array(5) as _, i}
                        <Star
                            class="w-6 h-6 {i < userRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'}"
                        />
                    {/each}
                    <span class="font-semibold text-lg"
                        >{userRating} out of 5</span
                    >
                </div>
                <div class="bg-white p-4 rounded-lg border mb-4 text-left">
                    <p class="text-gray-700 italic">"{reviewText}"</p>
                </div>
                <Button
                    on:click={handleChange}
                    variant="outline"
                    class=""
                    disabled={false}
                >
                    Change Review
                </Button>
            </div>
        {/if}
    </div>
</div>
