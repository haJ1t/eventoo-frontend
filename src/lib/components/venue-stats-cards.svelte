<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Building2, Users, Star, Calendar } from "lucide-svelte";
  
    export let stats: {
      totalVenues: number;
      totalCapacity: number;
      averageRating: number;
      totalBookings: number;
    };
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Total Venues -->
    <Card class="">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Venues</CardTitle>
        <Building2 class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent class="">
        <div class="text-2xl font-bold">{stats.totalVenues}</div>
        <p class="text-xs text-muted-foreground">Active venues</p>
      </CardContent>
    </Card>
  
    <!-- Total Capacity -->
    <Card class="">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Capacity</CardTitle>
        <Users class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent class="">
        <div class="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</div>
        <p class="text-xs text-muted-foreground">People capacity</p>
      </CardContent>
    </Card>
  
    <!-- Average Rating -->
    <Card class="">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Average Rating</CardTitle>
        <Star class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent class="">
        <div class="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
        <p class="text-xs text-muted-foreground">Out of 5.0</p>
      </CardContent>
    </Card>
  
    <!-- Total Bookings -->
    <Card class="">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Bookings</CardTitle>
        <Calendar class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent class="">
        <div class="text-2xl font-bold">{stats.totalBookings}</div>
        <p class="text-xs text-muted-foreground">All time bookings</p>
      </CardContent>
    </Card>
  </div>
  