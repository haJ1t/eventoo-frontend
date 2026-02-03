<script lang="ts">
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Badge } from "$lib/components/ui/badge";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import {
        ArrowLeft,
        Save,
        Building2,
        Mail,
        Phone,
        MapPin,
        Globe,
        Briefcase,
        Twitter,
        Linkedin,
        Instagram,
        ImagePlus,
    } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { createOrganizer } from "$lib/services/api";

    // Form data
    let formData = $state({
        name: "",
        email: "",
        phone: "",
        website: "",
        location: "",
        bio: "",
        tag: "Technology",
        twitter: "",
        linkedin: "",
        instagram: "",
    });

    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    const tags = [
        "Technology",
        "Music",
        "Education",
        "Cultural",
        "Sports",
        "Food & Drink",
        "Art",
        "Business",
        "Environment",
    ];

    function handleBackClick() {
        goto("/organisers");
    }

    function handleCancelClick() {
        if (
            Object.values(formData).some((v) => v !== "" && v !== "Technology")
        ) {
            if (
                !confirm(
                    "Are you sure you want to cancel? All changes will be lost.",
                )
            )
                return;
        }
        goto("/organisers");
    }

    async function handleSubmit() {
        isSubmitting = true;
        error = null;

        try {
            // Form validation
            if (!formData.name || !formData.email) {
                alert("Please fill in all required fields (Company Name and Email)");
                isSubmitting = false;
                return;
            }

            // Build API payload - organizers are users with organization_name
            const safeLastName = formData.name.trim().split(' ').slice(1).join(' ') || "Organization";
            const organizerData = {
                first_name: formData.name.trim() || "Organization",
                last_name: safeLastName, // Backend requires non-blank last_name
                email: formData.email,
                phone: formData.phone || undefined,
                organization_name: formData.name, // This marks it as an organizer
                profile_image: undefined,
            };

            await createOrganizer(organizerData);

            // Redirect back to organisers page on success
            goto("/organisers");
        } catch (err: any) {
            console.error("Error creating organiser:", err);
            error = err.message || "Error creating organiser. Please try again.";
            alert(error);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Add New Organiser - Evento</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 page-pad">
    <div class="mx-auto max-w-7xl" in:fade={{ duration: 300 }}>
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={handleBackClick}
                    class="h-9 w-9 p-0"
                    disabled={false}
                >
                    <ArrowLeft class="h-4 w-4" />
                </Button>
                <div class="flex items-start gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
                    >
                        <Building2 class="h-5 w-5" />
                    </div>
                    <div>
                        <h1
                            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
                        >
                            Add New Organiser
                        </h1>
                        <p class="mt-1 text-gray-500 dark:text-gray-400">
                            Register a new event partner or agency
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button
                    variant="outline"
                    onclick={handleCancelClick}
                    disabled={isSubmitting}
                    class=""
                >
                    Cancel
                </Button>
                <Button onclick={handleSubmit} disabled={isSubmitting} class="">
                    {#if isSubmitting}
                        Saving...
                    {:else}
                        <Save class="mr-2 h-4 w-4" />
                        Save Organiser
                    {/if}
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <Building2 class="h-5 w-5 text-primary" />
                            Company Information
                        </CardTitle>
                        <CardDescription class="">
                            Enter the core details about the organiser.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="name" class="">Company Name *</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="name"
                                        bind:value={formData.name}
                                        placeholder="e.g., Tech Events Inc."
                                        class="pl-9 bg-gray-50/50"
                                        required
                                        type="text"
                                    />
                                    <Building2
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="tag" class=""
                                    >Primary Category</Label
                                >
                                <select
                                    id="tag"
                                    bind:value={formData.tag}
                                    class="flex h-10 w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {#each tags as tag}
                                        <option value={tag}>{tag}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="bio" class="">Bio / Description</Label>
                            <textarea
                                id="bio"
                                bind:value={formData.bio}
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Brief description of the organiser..."
                            ></textarea>
                        </div>

                        <div class="space-y-2">
                            <Label class="">Logo / Cover Image</Label>
                            <div
                                class="flex items-center justify-center w-full"
                            >
                                <label
                                    for="dropzone-file"
                                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:border-gray-500 dark:border-gray-600"
                                >
                                    <div
                                        class="flex flex-col items-center justify-center pt-5 pb-6"
                                    >
                                        <ImagePlus
                                            class="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                                        />
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            <span class="font-semibold"
                                                >Click to upload</span
                                            > or drag and drop
                                        </p>
                                        <p
                                            class="text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            SVG, PNG, JPG or GIF (MAX.
                                            800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        class="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Contact Information -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <Mail class="h-5 w-5 text-primary" />
                            Contact Details
                        </CardTitle>
                        <CardDescription class="">
                            How can people reach this organiser?
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="email" class=""
                                    >Email Address *</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        bind:value={formData.email}
                                        placeholder="e.g., info@techevents.com"
                                        class="pl-9 bg-gray-50/50"
                                        required
                                    />
                                    <Mail
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="phone" class="">Phone Number</Label>
                                <div class="relative">
                                    <Input
                                        id="phone"
                                        bind:value={formData.phone}
                                        placeholder="e.g., +1 555 123 4567"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Phone
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="website" class="">Website</Label>
                                <div class="relative">
                                    <Input
                                        id="website"
                                        bind:value={formData.website}
                                        placeholder="e.g., www.techevents.com"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Globe
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="location" class=""
                                    >Headquarters Location</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="location"
                                        bind:value={formData.location}
                                        placeholder="e.g., San Francisco, CA"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <MapPin
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Social Media -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <Globe class="h-5 w-5 text-primary" />
                            Social Media
                        </CardTitle>
                        <CardDescription class="">
                            Connect with their social profiles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <Label for="twitter" class="">Twitter / X</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="twitter"
                                        bind:value={formData.twitter}
                                        placeholder="@username"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Twitter
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="linkedin" class="">LinkedIn</Label>
                                <div class="relative">
                                    <Input
                                        id="linkedin"
                                        bind:value={formData.linkedin}
                                        placeholder="username"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Linkedin
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="instagram" class="">Instagram</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="instagram"
                                        bind:value={formData.instagram}
                                        placeholder="username"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Instagram
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Sticky Preview Sidebar -->
            <div class="lg:col-span-1">
                <div class="sticky top-24 space-y-6">
                    <div
                        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <h3
                            class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
                        >
                            Live Preview
                        </h3>

                        <!-- Preview Card -->
                        <div
                            class="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all dark:bg-gray-900 dark:ring-gray-800"
                        >
                            <!-- Cover Image Stub -->
                            <div
                                class="h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative"
                            ></div>

                            <div class="px-6 pb-6 flex-1 flex flex-col">
                                <!-- Logo/Image -->
                                <div class="relative -mt-10 mb-4">
                                    <div
                                        class="h-20 w-20 rounded-xl bg-white p-1 ring-4 ring-white shadow-sm dark:bg-gray-800 dark:ring-gray-900"
                                    >
                                        <div
                                            class="h-full w-full rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden"
                                        >
                                            {#if formData.name}
                                                <div
                                                    class="text-2xl font-bold text-gray-300"
                                                >
                                                    {formData.name.charAt(0)}
                                                </div>
                                            {:else}
                                                <Building2
                                                    class="h-8 w-8 text-gray-300"
                                                />
                                            {/if}
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <h3
                                        class="font-bold text-gray-900 text-lg mb-1 dark:text-gray-100"
                                    >
                                        {formData.name || "Company Name"}
                                    </h3>
                                    <p
                                        class="text-sm text-gray-500 line-clamp-2"
                                    >
                                        {formData.bio ||
                                            "Organiser bio will appear here..."}
                                    </p>
                                </div>

                                <div class="space-y-2 mb-6">
                                    <div
                                        class="flex items-center text-sm text-gray-600"
                                    >
                                        <MapPin
                                            class="h-4 w-4 mr-2 text-gray-400"
                                        />
                                        {formData.location || "Location"}
                                    </div>
                                    <div
                                        class="flex items-center text-sm text-gray-600"
                                    >
                                        <Globe
                                            class="h-4 w-4 mr-2 text-gray-400"
                                        />
                                        {formData.website || "website.com"}
                                    </div>
                                </div>

                                <div
                                    class="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800"
                                >
                                    <Badge
                                        variant="secondary"
                                        class="bg-gray-100 text-gray-600 border-0"
                                        >{formData.tag}</Badge
                                    >
                                    <Badge
                                        variant="secondary"
                                        class="bg-gray-100 text-gray-600 border-0"
                                        >New</Badge
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 space-y-4">
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                                >
                                    <span class="text-xs font-bold">1</span>
                                </div>
                                <p class="text-xs text-gray-500">
                                    Fill in comprehensive details to attract
                                    more attendees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
