<script lang="ts">
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import { Home, AlertTriangle } from "lucide-svelte";
</script>

<svelte:head>
    <title>Error - Evento</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div
        class="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
    >
        <div
            class="relative mx-auto h-24 w-24 bg-red-50 rounded-full flex items-center justify-center"
        >
            <AlertTriangle class="h-12 w-12 text-red-500" />
            <div
                class="absolute inset-0 rounded-full animate-ping bg-red-100 opacity-25"
            ></div>
        </div>

        <div class="space-y-2">
            <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">
                {$page.status}
            </h1>
            <h2 class="text-xl font-semibold text-gray-700">
                {$page.error?.message || "Something went wrong"}
            </h2>
            <p class="text-gray-500 text-sm">
                We couldn't find the page you were looking for or an unexpected
                error occurred.
            </p>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button class="gap-2" onclick={() => goto("/")}>
                <Home class="h-4 w-4" /> Go Home
            </Button>
            <Button
                variant="outline"
                class="gap-2"
                onclick={() => history.back()}
            >
                Go Back
            </Button>
        </div>
    </div>
</div>
