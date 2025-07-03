<script>
    export let event;
</script>

<div class="bg-white rounded-lg overflow-hidden shadow">
    <img 
        alt={event.title} 
        class="w-full h-48 object-cover" 
        src={event.image} 
    />
    <div class="p-4">
        <h3 class="font-bold text-lg mb-1">{event.title}</h3>
        <p class="text-gray-600 text-sm">
            {event.date} · {event.venue} · {event.attendees} Attendees
        </p>
        <span class="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 mt-2 rounded-full">
            {event.status}
        </span>
    </div>
</div>
