<script lang="ts">
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
  
    export let title: string;
    export let date: string;
    export let location: string;
    export let attendees: string;
    export let status: string;
    export let image: string;
  </script>
  
  <Card class="rounded-2xl shadow-md overflow-hidden max-w-sm bg-white">
    <div class="relative">
      <!-- Event Image -->
      <img src={image} alt={title} class="w-full h-48 object-cover" />
  
      <!-- Status Badge -->
      <div
        class="absolute top-2 left-2 px-2 py-1 text-xs rounded-full font-medium"
        class:bg-green-100={status === 'Scheduled'}
        class:text-green-800={status === 'Scheduled'}
        class:bg-yellow-100={status === 'Pending'}
        class:text-yellow-800={status === 'Pending'}
        class:bg-red-100={status === 'Cancelled'}
        class:text-red-800={status === 'Cancelled'}
      >
        {status}
      </div>
    </div>
  
    <CardContent class="p-4 space-y-2">
      <!-- Title -->
      <h2 class="text-lg font-semibold">{title}</h2>
  
      <!-- Date & Location -->
      <p class="text-sm text-muted-foreground">{date} · {location}</p>
  
      <!-- Attendees -->
      <p class="text-sm text-muted-foreground">{attendees}</p>
  
      <!-- Optional: Details Button -->
      <div class="pt-2">
        <Button class="w-full text-sm">View Details</Button>
      </div>
    </CardContent>
  </Card>
  
  <style>
    img {
      border-bottom: 1px solid #e5e7eb;
    }
  </style>
  