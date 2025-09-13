<script>
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button";
  import { browser } from '$app/environment';
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
  import { ArrowLeft, Save, Plus, X, MapPin, Users, Building } from "lucide-svelte";
  import FileUpload from '$lib/components/file-upload.svelte';

  // Form data
  let formData = {
    name: '',
    location: '',
    capacity: '',
    type: '',
    description: '',
    amenities: [],
    pricePerHour: '',
    contactEmail: '',
    contactPhone: '',
    images: []
  };

  let newAmenity = '';

  // Available venue types
  const venueTypes = [
    'Conference Hall',
    'Wedding Venue',
    'Party Hall',
    'Corporate Space',
    'Concert Hall',
    'Exhibition Center',
    'Outdoor Venue',
    'Restaurant',
    'Hotel Ballroom',
    'Community Center'
  ];

  // Common amenities suggestions
  const commonAmenities = [
    'WiFi', 'Parking', 'Air Conditioning', 'Sound System', 
    'Projector', 'Stage', 'Kitchen', 'Bar', 'Dance Floor',
    'Outdoor Space', 'Wheelchair Access', 'Security'
  ];

  // Event handlers
  const handleBackClick = () => {
    console.log('Back button clicked');
    goto('/venues');
  };

  const handleCancelClick = () => {
    console.log('Cancel button clicked');
    const hasChanges = Object.values(formData).some(value => 
      Array.isArray(value) ? value.length > 0 : value.trim() !== ''
    );
    
    if (hasChanges && !confirm('Are you sure you want to cancel? All changes will be lost.')) {
      return;
    }
    
    goto('/venues');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('venue_draft', JSON.stringify(formData));
    alert('Draft saved!');
  };

  // Add image upload handler
  function handleImageUpload(event) {
    const { files } = event.detail;
    if (files) {
      if (Array.isArray(files)) {
        formData.images = [...formData.images, ...files];
      } else {
        formData.images = [...formData.images, files];
      }
      console.log('Images selected:', formData.images);
    }
  }

  // Add amenity
  function addAmenity() {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      formData.amenities = [...formData.amenities, newAmenity.trim()];
      newAmenity = '';
    }
  }

  // Add suggested amenity
  function addSuggestedAmenity(amenity) {
    if (!formData.amenities.includes(amenity)) {
      formData.amenities = [...formData.amenities, amenity];
    }
  }

  // Remove amenity
  function removeAmenity(amenity) {
    formData.amenities = formData.amenities.filter(a => a !== amenity);
  }

  // Form validation
  function validateForm() {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Venue name is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.capacity || formData.capacity < 1) errors.push('Valid capacity is required');
    if (!formData.type) errors.push('Venue type is required');
    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      errors.push('Valid email is required');
    }
    
    return errors;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Handle form submission
  function handleSubmit() {
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    console.log('Venue data:', formData);
    
    // Here you would normally send to API
    alert('Venue created successfully!');
    goto('/venues');
  }

  // Load draft on component mount
  function loadDraft() {
    const draft = localStorage.getItem('venue_draft');
    if (draft && confirm('Load saved draft?')) {
      formData = JSON.parse(draft);
    }
  }

  // Load draft when component mounts
  import { onMount } from 'svelte';
  onMount(() => {
    loadDraft();
  });
</script>

<svelte:head>
  <title>Add New Venue - Evento</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-6xl">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-4">
      <!-- CUSTOM BUTTON - HTML ile yapılmış -->
      <Button variant="ghost" size="sm" onclick={handleBackClick} class="h-9 w-9 p-0" disabled={false}>
				<ArrowLeft class="w-4 h-4" />
			</Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Add New Venue</h1>
        <p class="text-muted-foreground mt-1">
          Create a new venue for hosting events
        </p>
      </div>
    </div>
    <button 
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      on:click={handleSaveDraft}
    >
      Save Draft
    </button>
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Building class="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the essential details about your venue
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Venue Name *</Label>
                <Input
                  id="name"
                  bind:value={formData.name}
                  placeholder="e.g., Grand Ballroom"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="type">Venue Type *</Label>
                <select
                  id="type"
                  bind:value={formData.type}
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select venue type</option>
                  {#each venueTypes as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="location" class="flex items-center gap-1">
                  <MapPin class="h-4 w-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  bind:value={formData.location}
                  placeholder="e.g., Istanbul, Besiktas"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="capacity" class="flex items-center gap-1">
                  <Users class="h-4 w-4" />
                  Capacity *
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  bind:value={formData.capacity}
                  placeholder="Maximum number of guests"
                  min="1"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                bind:value={formData.description}
                placeholder="Describe your venue, its atmosphere, and what makes it special..."
                rows="4"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>

            <div class="space-y-2">
              <Label>Venue Images</Label>
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                placeholder="Drag and drop venue images here, or click to browse"
                multiple={true}
                on:change={handleImageUpload}
              />
              <p class="text-sm text-muted-foreground">Upload high-quality images to showcase your venue</p>
            </div>
          </CardContent>
        </Card>

        <!-- Contact & Pricing -->
        <Card>
          <CardHeader>
            <CardTitle>Contact & Pricing</CardTitle>
            <CardDescription>
              How can clients reach you and what are your rates?
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  bind:value={formData.contactEmail}
                  placeholder="venue@example.com"
                />
              </div>
              <div class="space-y-2">
                <Label for="phone">Contact Phone</Label>
                <Input
                  id="phone"
                  bind:value={formData.contactPhone}
                  placeholder="+90 555 123 4567"
                />
              </div>
              <div class="space-y-2">
                <Label for="price">Price per Hour (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  bind:value={formData.pricePerHour}
                  placeholder="1000"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Amenities -->
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
            <CardDescription>
              What facilities and services does your venue offer?
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Add custom amenity -->
            <div class="flex gap-2">
              <Input
                bind:value={newAmenity}
                placeholder="Add custom amenity..."
                on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <button 
                type="button" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                on:click={addAmenity}
              >
                <Plus class="h-4 w-4 mr-2" />
                Add
              </button>
            </div>

            <!-- Suggested amenities -->
            <div>
              <Label class="text-sm font-medium">Quick Add:</Label>
              <div class="flex flex-wrap gap-2 mt-2">
                {#each commonAmenities as amenity}
                  {#if !formData.amenities.includes(amenity)}
                    <button
                      type="button"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                      on:click={() => addSuggestedAmenity(amenity)}
                    >
                      <Plus class="h-3 w-3 mr-1" />
                      {amenity}
                    </button>
                  {/if}
                {/each}
              </div>
            </div>

            <!-- Selected amenities -->
            {#if formData.amenities.length > 0}
              <div>
                <Label class="text-sm font-medium">Selected Amenities:</Label>
                <div class="flex flex-wrap gap-2 mt-2">
                  {#each formData.amenities as amenity}
                    <Badge variant="secondary" class="flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        on:click={() => removeAmenity(amenity)}
                        class="ml-1 hover:bg-muted rounded-full p-0.5"
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

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <button 
              type="submit" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              <Save class="h-4 w-4 mr-2" />
              Create Venue
            </button>
            <button 
              type="button" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
              on:click={handleCancelClick}
            >
              Cancel
            </button>
          </CardContent>
        </Card>

        <!-- Live Preview -->
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="border rounded-lg p-4 space-y-2">
              <div class="font-semibold text-lg">
                {formData.name || 'Venue Name'}
              </div>
              
              {#if formData.location}
                <div class="flex items-center text-sm text-muted-foreground">
                  <MapPin class="h-4 w-4 mr-1" />
                  {formData.location}
                </div>
              {/if}
              
              {#if formData.capacity}
                <div class="flex items-center text-sm text-muted-foreground">
                  <Users class="h-4 w-4 mr-1" />
                  Up to {formData.capacity} guests
                </div>
              {/if}
              
              {#if formData.type}
                <Badge variant="outline" class="mt-2">
                  {formData.type}
                </Badge>
              {/if}
              
              {#if formData.pricePerHour}
                <div class="text-lg font-semibold text-green-600 mt-2">
                  ₺{formData.pricePerHour}/hour
                </div>
              {/if}
              
              {#if formData.description}
                <p class="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {formData.description}
                </p>
              {/if}
              
              {#if formData.amenities.length > 0}
                <div class="mt-3">
                  <div class="text-sm font-medium mb-1">Amenities:</div>
                  <div class="flex flex-wrap gap-1">
                    {#each formData.amenities.slice(0, 3) as amenity}
                      <Badge variant="secondary" class="text-xs">
                        {amenity}
                      </Badge>
                    {/each}
                    {#if formData.amenities.length > 3}
                      <Badge variant="secondary" class="text-xs">
                        +{formData.amenities.length - 3} more
                      </Badge>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>

        <!-- Tips -->
        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-2">
            <div class="flex items-start gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>Add high-quality photos to attract more bookings</p>
            </div>
            <div class="flex items-start gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>Be detailed in your description to set clear expectations</p>
            </div>
            <div class="flex items-start gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>List all amenities to showcase your venue's value</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </form>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3;
  }
</style>
