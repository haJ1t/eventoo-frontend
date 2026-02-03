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
    Plus,
    X,
    MapPin,
    Users,
    Building,
    CheckCircle2,
    DollarSign,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { createVenue } from "$lib/services/api";

  let error = $state<string | null>(null);

  // Form data
  let formData = $state({
    name: "",
    location: "",
    capacity: "",
    type: "",
    description: "",
    amenities: [],
    pricePerHour: "",
    contactEmail: "",
    contactPhone: "",
    image: "", // Placeholder for image logic
  });

  let newAmenity = $state("");
  let isSubmitting = $state(false);

  // Available venue types
  const venueTypes = [
    "Conference Hall",
    "Wedding Venue",
    "Party Hall",
    "Corporate Space",
    "Concert Hall",
    "Exhibition Center",
    "Outdoor Venue",
    "Restaurant",
    "Hotel Ballroom",
    "Community Center",
  ];

  // Common amenities suggestions
  const commonAmenities = [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "Sound System",
    "Projector",
    "Stage",
    "Kitchen",
    "Bar",
    "Dance Floor",
    "Outdoor Space",
    "Wheelchair Access",
    "Security",
  ];

  function handleBackClick() {
    goto("/venues");
  }

  function handleCancelClick() {
    if (
      Object.values(formData).some((v) =>
        Array.isArray(v) ? v.length > 0 : v !== "",
      )
    ) {
      if (
        !confirm("Are you sure you want to cancel? All changes will be lost.")
      )
        return;
    }
    goto("/venues");
  }

  function addAmenity() {
    const trimmed = newAmenity.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      formData.amenities = [...formData.amenities, trimmed];
      newAmenity = "";
    }
  }

  function addSuggestedAmenity(amenity: string) {
    if (!formData.amenities.includes(amenity)) {
      formData.amenities = [...formData.amenities, amenity];
    }
  }

  function removeAmenity(amenity: string) {
    formData.amenities = formData.amenities.filter((a) => a !== amenity);
  }

  async function handleSubmit() {
    isSubmitting = true;
    error = null;

    try {
      // Form validation
      if (!formData.name || !formData.location || !formData.type) {
        alert("Please fill in all required fields (Name, Location, Type)");
        isSubmitting = false;
        return;
      }

      // Parse location into city and address
      // Assuming format "City, Address" or just "City"
      const locationParts = formData.location.split(',').map(s => s.trim());
      const city = locationParts[0] || formData.location;
      const address = locationParts.length > 1 ? locationParts.slice(1).join(', ') : formData.location;

      // Build API payload
      const venueData = {
        name: formData.name,
        address: address,
        city: city,
        capacity: parseInt(formData.capacity) || 100,
        price_per_hour: parseFloat(formData.pricePerHour) || 0,
        venue_type: formData.type,
      };

      await createVenue(venueData);

      // Redirect back to venues page on success
      goto("/venues");
    } catch (err: any) {
      console.error("Error creating venue:", err);
      error = err.message || "Error creating venue. Please try again.";
      alert(error);
    } finally {
      isSubmitting = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  }
</script>

<svelte:head>
  <title>Add New Venue - Evento</title>
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
            <Building class="h-5 w-5" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Add New Venue
            </h1>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Create a new venue listing for hosting events
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
            Creating...
          {:else}
            <Save class="mr-2 h-4 w-4" />
            Save Venue
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
              <Building class="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription class="">
              Enter the essential details about your venue.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name" class="">Venue Name</Label>
                <Input
                  id="name"
                  bind:value={formData.name}
                  placeholder="e.g., Grand Ballroom"
                  class="bg-gray-50/50"
                  required
                  type="text"
                />
              </div>
              <div class="space-y-2">
                <Label for="type" class="">Venue Type</Label>
                <select
                  id="type"
                  bind:value={formData.type}
                  class="flex h-10 w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select venue type</option>
                  {#each venueTypes as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="location" class="">Location</Label>
                <div class="relative">
                  <Input
                    id="location"
                    bind:value={formData.location}
                    placeholder="e.g., Istanbul, Besiktas"
                    class="pl-9 bg-gray-50/50"
                    required
                    type="text"
                  />
                  <MapPin class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="capacity" class="">Capacity</Label>
                <div class="relative">
                  <Input
                    id="capacity"
                    type="number"
                    bind:value={formData.capacity}
                    placeholder="Max guests"
                    min="1"
                    class="pl-9 bg-gray-50/50"
                    required
                  />
                  <Users class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description" class="">Description</Label>
              <textarea
                id="description"
                bind:value={formData.description}
                placeholder="Describe your venue, its atmosphere, and what makes it special..."
                rows="5"
                class="flex w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
              ></textarea>
            </div>
          </CardContent>
        </Card>

        <!-- Contact & Pricing -->
        <Card
          class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
        >
          <CardHeader class="">
            <CardTitle class="text-xl">Contact & Pricing</CardTitle>
            <CardDescription class="">
              How can clients reach you and what are your rates?
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <Label for="email" class="">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  bind:value={formData.contactEmail}
                  placeholder="venue@example.com"
                  class="bg-gray-50/50"
                />
              </div>
              <div class="space-y-2">
                <Label for="phone" class="">Contact Phone</Label>
                <Input
                  id="phone"
                  bind:value={formData.contactPhone}
                  placeholder="+90 555 123 4567"
                  class="bg-gray-50/50"
                  type="text"
                />
              </div>
              <div class="space-y-2">
                <Label for="price" class="">Price per Hour (₺)</Label>
                <div class="relative">
                  <Input
                    id="price"
                    type="number"
                    bind:value={formData.pricePerHour}
                    placeholder="1000"
                    min="0"
                    class="pl-9 bg-gray-50/50"
                  />
                  <span class="absolute left-3 top-2.5 text-gray-400 font-bold"
                    >₺</span
                  >
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Amenities -->
        <Card
          class="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
        >
          <CardHeader class="">
            <CardTitle class="text-xl">Amenities & Features</CardTitle>
            <CardDescription class="">
              Select all that apply to showcase your venue's value.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Suggested -->
            <div class="space-y-3">
              <span class="text-sm font-medium text-gray-600"
                >Popular Amenities</span
              >
              <div class="flex flex-wrap gap-2">
                {#each commonAmenities as amenity}
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    {formData.amenities.includes(amenity)
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                      : 'border-gray-200 bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}"
                    onclick={() =>
                      formData.amenities.includes(amenity)
                        ? removeAmenity(amenity)
                        : addSuggestedAmenity(amenity)}
                  >
                    {#if formData.amenities.includes(amenity)}
                      <CheckCircle2 class="mr-1.5 h-3 w-3" />
                    {:else}
                      <Plus class="mr-1.5 h-3 w-3" />
                    {/if}
                    {amenity}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Custom -->
            <div class="space-y-3">
              <span class="text-sm font-medium text-gray-600">Add Custom</span>
              <div class="flex gap-2">
                <Input
                  bind:value={newAmenity}
                  placeholder="e.g., Valet Parking"
                  class="bg-gray-50/50"
                  onkeydown={handleKeydown}
                  type="text"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onclick={addAmenity}
                  disabled={!newAmenity.trim()}
                  class=""
                >
                  Add
                </Button>
              </div>
            </div>

            <!-- Selected List -->
            {#if formData.amenities.length > 0}
              <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <div class="mb-2 text-xs font-semibold uppercase text-gray-500">
                  Selected Amenities
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each formData.amenities as amenity}
                    <Badge
                      variant="secondary"
                      class="pl-2 pr-1 py-1 flex items-center gap-1 bg-white border border-gray-200 text-gray-700"
                      href="#"
                    >
                      {amenity}
                      <button
                        type="button"
                        onclick={() => removeAmenity(amenity)}
                        class="ml-1 rounded-full p-0.5 hover:bg-gray-200 hover:text-red-500 transition-colors"
                      >
                        <X class="h-3 w-3" />
                      </button>
                    </Badge>
                  {/each}
                </div>
              </div>
            {/if}
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
              <div
                class="aspect-video w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"
              >
                {#if formData.image}
                  <img
                    src={formData.image}
                    alt="Preview"
                    class="h-full w-full object-cover"
                  />
                {:else}
                  <Building class="h-10 w-10 opacity-20" />
                {/if}
              </div>
              <div class="p-4">
                <div class="mb-2">
                  <h4 class="font-bold text-gray-900 line-clamp-1">
                    {formData.name || "Venue Name"}
                  </h4>
                  <p class="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin class="mr-1 h-3 w-3" />
                    <span class="line-clamp-1"
                      >{formData.location || "Location"}</span
                    >
                  </p>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                  {#if formData.type}
                    <Badge
                      variant="secondary"
                      class="text-[10px] px-1.5 py-0 h-5"
                      href="#">{formData.type}</Badge
                    >
                  {/if}
                  <Badge
                    variant="outline"
                    class="text-[10px] px-1.5 py-0 h-5 border-gray-200 text-gray-500"
                    href="#"
                  >
                    <Users class="mr-1 h-3 w-3" />
                    {formData.capacity || 0}
                  </Badge>
                </div>

                <div
                  class="flex items-center justify-between border-t border-gray-100 pt-3 mt-3"
                >
                  <div class="text-xs text-gray-500">Starting from</div>
                  <div class="font-bold text-primary">
                    {formData.pricePerHour
                      ? `₺${formData.pricePerHour}/hr`
                      : "Price not set"}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-4">
              <div class="flex items-start gap-3">
                <div
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <span class="text-xs font-bold">1</span>
                </div>
                <p class="text-xs text-gray-500">
                  Fill in all details carefully. The more information you
                  provide, the better.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <span class="text-xs font-bold">2</span>
                </div>
                <p class="text-xs text-gray-500">
                  Upload high-quality images to increase booking rates by up to
                  40%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
