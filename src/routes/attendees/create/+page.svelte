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
        User,
        UserPlus,
        Mail,
        Phone,
        MapPin,
        Building,
        Briefcase,
        Ticket,
        UserCheck,
    } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { createUser } from "$lib/services/api";

    // Form data
    let formData = $state({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        location: "",
        status: "pending",
        ticketType: "Standard",
    });

    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    const statusOptions = ["confirmed", "pending", "cancelled"];
    const ticketOptions = ["VIP", "Standard"];

    function handleBackClick() {
        goto("/attendees");
    }

    function handleCancelClick() {
        if (
            Object.values(formData).some(
                (v) => v !== "" && v !== "pending" && v !== "Standard",
            )
        ) {
            if (
                !confirm(
                    "Are you sure you want to cancel? All changes will be lost.",
                )
            )
                return;
        }
        goto("/attendees");
    }

    async function handleSubmit() {
        isSubmitting = true;
        error = null;

        try {
            // Form validation
            if (!formData.name || !formData.email) {
                alert("Please fill in all required fields (Name and Email)");
                isSubmitting = false;
                return;
            }

            // Parse name into first_name and last_name
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Build API payload
            const userData = {
                first_name: firstName,
                last_name: lastName,
                email: formData.email,
                phone: formData.phone || undefined,
            };

            await createUser(userData);

            // Redirect back to attendees page on success
            goto("/attendees");
        } catch (err: any) {
            console.error("Error creating attendee:", err);
            error = err.message || "Error creating attendee. Please try again.";
            alert(error);
        } finally {
            isSubmitting = false;
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-amber-100 text-amber-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }
</script>

<svelte:head>
    <title>Add New Attendee - Evento</title>
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
                        <UserPlus class="h-5 w-5" />
                    </div>
                    <div>
                        <h1
                            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
                        >
                            Add New Attendee
                        </h1>
                        <p class="mt-1 text-gray-500 dark:text-gray-400">
                            Register a new guest for your event
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
                        Save Attendee
                    {/if}
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Personal Information -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <User class="h-5 w-5 text-primary" />
                            Personal Information
                        </CardTitle>
                        <CardDescription class="">
                            Enter the attendee's personal details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="name" class="">Full Name *</Label>
                                <div class="relative">
                                    <Input
                                        id="name"
                                        bind:value={formData.name}
                                        placeholder="e.g., John Smith"
                                        class="pl-9 bg-gray-50/50"
                                        required
                                        type="text"
                                    />
                                    <User
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="email" class=""
                                    >Email Address *</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        bind:value={formData.email}
                                        placeholder="e.g., john@example.com"
                                        class="pl-9 bg-gray-50/50"
                                        required
                                    />
                                    <Mail
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div class="space-y-2">
                                <Label for="location" class="">Location</Label>
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

                <!-- Professional Information -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <Briefcase class="h-5 w-5 text-primary" />
                            Professional Information
                        </CardTitle>
                        <CardDescription class="">
                            Enter company and role details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="company" class="">Company</Label>
                                <div class="relative">
                                    <Input
                                        id="company"
                                        bind:value={formData.company}
                                        placeholder="e.g., Tech Corp"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Building
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="position" class=""
                                    >Position / Title</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="position"
                                        bind:value={formData.position}
                                        placeholder="e.g., Software Engineer"
                                        class="pl-9 bg-gray-50/50"
                                        type="text"
                                    />
                                    <Briefcase
                                        class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Ticket & Status -->
                <Card
                    class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <CardHeader class="">
                        <CardTitle class="flex items-center gap-2 text-xl">
                            <Ticket class="h-5 w-5 text-primary" />
                            Ticket & Status
                        </CardTitle>
                        <CardDescription class="">
                            Set the attendee's ticket type and registration
                            status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="ticketType" class=""
                                    >Ticket Type</Label
                                >
                                <select
                                    id="ticketType"
                                    bind:value={formData.ticketType}
                                    class="flex h-10 w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {#each ticketOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <Label for="status" class=""
                                    >Registration Status</Label
                                >
                                <select
                                    id="status"
                                    bind:value={formData.status}
                                    class="flex h-10 w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {#each statusOptions as option}
                                        <option
                                            value={option}
                                            class="capitalize">{option}</option
                                        >
                                    {/each}
                                </select>
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
                            class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div class="p-6">
                                <!-- Avatar & Name -->
                                <div class="flex items-center gap-4 mb-4">
                                    <div
                                        class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary"
                                    >
                                        {#if formData.name}
                                            {formData.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        {:else}
                                            <User class="h-6 w-6 opacity-40" />
                                        {/if}
                                    </div>
                                    <div>
                                        <h4
                                            class="font-bold text-gray-900 line-clamp-1"
                                        >
                                            {formData.name || "Full Name"}
                                        </h4>
                                        <p class="text-sm text-gray-500">
                                            {formData.position || "Position"}
                                        </p>
                                        <p
                                            class="text-xs text-primary font-medium uppercase"
                                        >
                                            {formData.company || "Company"}
                                        </p>
                                    </div>
                                </div>

                                <!-- Badges -->
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <Badge
                                        href="#"
                                        class={`border-0 capitalize ${getStatusColor(formData.status)}`}
                                    >
                                        {formData.status}
                                    </Badge>
                                    <Badge
                                        href="#"
                                        class={`border-0 ${formData.ticketType === "VIP" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                                    >
                                        {formData.ticketType}
                                    </Badge>
                                </div>

                                <!-- Contact Info -->
                                <div
                                    class="space-y-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"
                                >
                                    <div
                                        class="flex items-center gap-2 text-gray-600"
                                    >
                                        <Mail class="h-4 w-4 text-gray-400" />
                                        <span class="truncate"
                                            >{formData.email ||
                                                "email@example.com"}</span
                                        >
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-gray-600"
                                    >
                                        <Phone class="h-4 w-4 text-gray-400" />
                                        <span
                                            >{formData.phone ||
                                                "Phone number"}</span
                                        >
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-gray-600"
                                    >
                                        <MapPin class="h-4 w-4 text-gray-400" />
                                        <span class="truncate"
                                            >{formData.location ||
                                                "Location"}</span
                                        >
                                    </div>
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
                                    Name and email are required fields.
                                </p>
                            </div>
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                                >
                                    <span class="text-xs font-bold">2</span>
                                </div>
                                <p class="text-xs text-gray-500">
                                    VIP tickets include premium benefits and
                                    seating.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
