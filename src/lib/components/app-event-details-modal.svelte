<script lang="ts">
	// Props - Svelte 5 style (düzeltilmiş)
	let { 
	  isOpen = $bindable(false), 
	  event = $bindable(null) 
	} = $props();
  
	// State
	let isLiked = $state(false);
  
	// Functions
	function closeModal() {
	  isOpen = false;
	}
  
	function handleBackdropClick() {
	  closeModal();
	}
  
	function handleModalClick(e) {
	  e.stopPropagation();
	}
  
	function handleKeydown(e) {
	  if (e.key === 'Escape') {
		closeModal();
	  }
	}
  
	function toggleLike() {
	  isLiked = !isLiked;
	}
  
	function shareEvent() {
	  if (navigator.share && event) {
		navigator.share({
		  title: event.title,
		  text: event.description,
		  url: window.location.href
		});
	  }
	}
  
	function registerForEvent() {
	  console.log('Register clicked for:', event?.title);
	  // Registration logic here
	}
  
	function viewFullDetails() {
	  console.log('View details clicked for:', event?.id);
	  if (event?.id) {
		closeModal();
		// Navigate to event details page
		window.location.href = `/events/${event.id}`;
	  }
	}
  </script>
  
  <!-- Modal -->
  {#if isOpen && event}
	<div 
	  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
	  onclick={handleBackdropClick}
	  onkeydown={handleKeydown}
	  role="button"
	  tabindex="0"
	  aria-label="Close modal"
	>
	  <!-- Modal Content -->
	  <div 
		class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
		onclick={handleModalClick}
		role="dialog"
		aria-modal="true"
	  >
		<!-- Header Image -->
		<div class="relative">
		  <img 
			src={event.image || '/api/placeholder/600/300'} 
			alt={event.title}
			class="w-full h-48 object-cover rounded-t-lg"
		  />
		  
		  <!-- Close Button -->
		  <button
			type="button"
			class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
			onclick={closeModal}
		  >
			✕
		  </button>
  
		  <!-- Tags -->
		  {#if event.tags && event.tags.length > 0}
			<div class="absolute bottom-4 left-4">
			  <div class="flex flex-wrap gap-2">
				{#each event.tags as tag}
				  <span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
					{tag}
				  </span>
				{/each}
			  </div>
			</div>
		  {/if}
		</div>
  
		<!-- Content -->
		<div class="p-6">
		  <!-- Title and Actions -->
		  <div class="flex justify-between items-start mb-4">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
			  {event.title}
			</h2>
			
			<div class="flex gap-2 ml-4">
			  <!-- Like Button -->
			  <button
				type="button"
				class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
				onclick={toggleLike}
			  >
				{#if isLiked}
				  ❤️
				{:else}
				  🤍
				{/if}
			  </button>
  
			  <!-- Share Button -->
			  <button
				type="button"
				class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
				onclick={shareEvent}
			  >
				📤
			  </button>
			</div>
		  </div>
  
		  <!-- Event Info Grid -->
		  <div class="grid grid-cols-2 gap-4 mb-6">
			<!-- Date -->
			<div class="flex items-center gap-3">
			  <span class="text-2xl">📅</span>
			  <div>
				<p class="font-medium text-gray-900 dark:text-white">
				  {event.date || 'Date TBD'}
				</p>
				<p class="text-sm text-gray-500">
				  {event.time || 'Time TBD'}
				</p>
			  </div>
			</div>
  
			<!-- Location -->
			<div class="flex items-center gap-3">
			  <span class="text-2xl">📍</span>
			  <div>
				<p class="font-medium text-gray-900 dark:text-white">
				  {event.location || 'Location TBD'}
				</p>
				<p class="text-sm text-gray-500">Venue</p>
			  </div>
			</div>
  
			<!-- Attendees -->
			<div class="flex items-center gap-3">
			  <span class="text-2xl">👥</span>
			  <div>
				<p class="font-medium text-gray-900 dark:text-white">
				  {event.attendees || '0'}
				</p>
				<p class="text-sm text-gray-500">Attendees</p>
			  </div>
			</div>
  
			<!-- Price -->
			<div class="flex items-center gap-3">
			  <span class="text-2xl">💰</span>
			  <div>
				<p class="font-medium text-gray-900 dark:text-white">
				  {event.price || 'Free'}
				</p>
				<p class="text-sm text-gray-500">Price</p>
			  </div>
			</div>
		  </div>
  
		  <!-- Description -->
		  <div class="mb-6">
			<h3 class="font-semibold text-gray-900 dark:text-white mb-2">
			  About This Event
			</h3>
			<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
			  {event.description || 'No description available.'}
			</p>
		  </div>
  
		  <!-- Action Buttons -->
		  <div class="flex gap-3">
			<button
			  type="button"
			  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
			  onclick={registerForEvent}
			>
			  Register Now
			</button>
			
			<button
			  type="button"
			  class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
			  onclick={viewFullDetails}
			>
			  View Full Details
			</button>
		  </div>
		</div>
	  </div>
	</div>
  {/if}
  
  <!-- Global Keyboard Handler -->
  <svelte:window onkeydown={handleKeydown} />
  