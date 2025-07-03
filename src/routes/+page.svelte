<script>
  import { onMount } from 'svelte';
  import api from '$lib/api';
  import "../tailwind.css";

  //shadcn component testing------------------------
  import { Button } from '$lib/components/ui/button';
  //------------------------------------------------

  let eventStatus = '';
  let userStatus = '';
  let events = [];

  onMount(async () => {
    // ✅ Test Event API (GET /events/)
    try {
      const res = await api.get('events/');
      events = res.data;
      eventStatus = '✅ Event API is working';
    } catch (err) {
      eventStatus = '❌ Event API not working';
      console.error('Error fetching events:', err);
    }

    // ✅ Test User API (GET /users/)
    try {
      const res = await api.get('users/');
      if (Array.isArray(res.data)) {
        userStatus = '✅ User API is working';
      } else {
        userStatus = '⚠️ User API returned unexpected data';
      }
    } catch (err) {
      userStatus = '❌ User API not working';
      console.error('Error fetching users:', err);
    }
  });
</script>

<h1>API Status Checks</h1>
<ul>
  <li>Event API: {eventStatus}</li>
  <li>User API: {userStatus}</li>
</ul>

<h2>Events</h2>
{#if events.length > 0}
  <ul>
    {#each events as event}
      <li>
        <strong>{event.title}</strong><br />
        {event.date} at {event.location}<br />
        {event.description}
      </li>
    {/each}
  </ul>
{:else}
  <p>No events available.</p>
{/if}


<h1 class="text-2xl font-bold mb-4">Hello, Tailwind + shadcn!</h1>

<Button variant="default">Click Me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>