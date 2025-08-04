<script>
	import { Search, Users, Mail, Phone, MapPin, Calendar, Filter } from 'lucide-svelte';
	
	let searchQuery = $state("");
	let selectedFilter = $state("all");
	let selectedAttendee = $state(null);
	let showModal = $state(false);

	// Sample attendees data
	const attendees = [
		{
			id: 1,
			name: "John Smith",
			email: "john.smith@email.com",
			phone: "+1 (555) 123-4567",
			company: "Tech Corp",
			position: "Software Engineer",
			location: "San Francisco, CA",
			registrationDate: "2024-01-15",
			status: "confirmed",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			events: ["Tech Conference 2024", "Business Summit"],
			ticketType: "VIP"
		},
		{
			id: 2,
			name: "Sarah Johnson",
			email: "sarah.j@email.com",
			phone: "+1 (555) 987-6543",
			company: "Design Studio",
			position: "UX Designer",
			location: "New York, NY",
			registrationDate: "2024-01-20",
			status: "confirmed",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
			events: ["Tech Conference 2024"],
			ticketType: "Standard"
		},
		{
			id: 3,
			name: "Michael Brown",
			email: "m.brown@email.com",
			phone: "+1 (555) 456-7890",
			company: "Marketing Inc",
			position: "Marketing Manager",
			location: "Los Angeles, CA",
			registrationDate: "2024-02-01",
			status: "pending",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			events: ["Music Festival Summer"],
			ticketType: "Standard"
		},
		{
			id: 4,
			name: "Emily Davis",
			email: "emily.davis@email.com",
			phone: "+1 (555) 321-0987",
			company: "Startup Hub",
			position: "Product Manager",
			location: "Austin, TX",
			registrationDate: "2024-02-10",
			status: "confirmed",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			events: ["Tech Conference 2024", "Business Summit"],
			ticketType: "VIP"
		},
		{
			id: 5,
			name: "David Wilson",
			email: "d.wilson@email.com",
			phone: "+1 (555) 654-3210",
			company: "Finance Co",
			position: "Financial Analyst",
			location: "Chicago, IL",
			registrationDate: "2024-02-15",
			status: "cancelled",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
			events: ["Business Summit"],
			ticketType: "Standard"
		},
		{
			id: 6,
			name: "Lisa Anderson",
			email: "lisa.a@email.com",
			phone: "+1 (555) 789-0123",
			company: "Creative Agency",
			position: "Art Director",
			location: "Seattle, WA",
			registrationDate: "2024-02-20",
			status: "confirmed",
			avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
			events: ["Art Exhibition Opening"],
			ticketType: "VIP"
		}
	];

	// Filtered attendees based on search and filter
	const filteredAttendees = $derived(
		attendees.filter(attendee => {
			const matchesSearch = 
				attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				attendee.company.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesFilter = selectedFilter === "all" || attendee.status === selectedFilter;
			
			return matchesSearch && matchesFilter;
		})
	);

	// Stats
	const stats = $derived({
		total: attendees.length,
		confirmed: attendees.filter(a => a.status === 'confirmed').length,
		pending: attendees.filter(a => a.status === 'pending').length,
		cancelled: attendees.filter(a => a.status === 'cancelled').length
	});

	function getStatusColor(status) {
		switch(status) {
			case 'confirmed': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'cancelled': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function getTicketTypeColor(type) {
		return type === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
	}

	function viewAttendeeDetails(attendee) {
		selectedAttendee = attendee;
		showModal = true;
	}
</script>

<div class="max-w-7xl mx-auto p-6">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-gray-800 mb-2">Attendees Management</h1>
		<p class="text-gray-600">Manage and view all event attendees</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
		<div class="bg-white p-6 rounded-lg shadow-sm border">
			<div class="flex items-center">
				<Users class="h-8 w-8 text-blue-500" />
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Total Attendees</p>
					<p class="text-2xl font-bold text-gray-900">{stats.total}</p>
				</div>
			</div>
		</div>
		<div class="bg-white p-6 rounded-lg shadow-sm border">
			<div class="flex items-center">
				<div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
					<div class="h-4 w-4 bg-green-500 rounded-full"></div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Confirmed</p>
					<p class="text-2xl font-bold text-green-600">{stats.confirmed}</p>
				</div>
			</div>
		</div>
		<div class="bg-white p-6 rounded-lg shadow-sm border">
			<div class="flex items-center">
				<div class="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
					<div class="h-4 w-4 bg-yellow-500 rounded-full"></div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Pending</p>
					<p class="text-2xl font-bold text-yellow-600">{stats.pending}</p>
				</div>
			</div>
		</div>
		<div class="bg-white p-6 rounded-lg shadow-sm border">
			<div class="flex items-center">
				<div class="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
					<div class="h-4 w-4 bg-red-500 rounded-full"></div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Cancelled</p>
					<p class="text-2xl font-bold text-red-600">{stats.cancelled}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Search and Filter -->
	<div class="bg-white p-6 rounded-lg shadow-sm border mb-6">
		<div class="flex flex-col md:flex-row gap-4">
			<!-- Search -->
			<div class="flex-1 relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search attendees by name, email, or company..."
					class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			
			<!-- Filter -->
			<div class="flex items-center gap-2">
				<Filter class="text-gray-400 h-5 w-5" />
				<select 
					bind:value={selectedFilter}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="all">All Status</option>
					<option value="confirmed">Confirmed</option>
					<option value="pending">Pending</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Attendees Table -->
	<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Attendee
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Contact
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Company
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Ticket Type
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Registration Date
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredAttendees as attendee}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<img class="h-10 w-10 rounded-full" src={attendee.avatar} alt={attendee.name} />
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{attendee.name}</div>
										<div class="text-sm text-gray-500 flex items-center">
											<MapPin class="h-4 w-4 mr-1" />
											{attendee.location}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 flex items-center">
									<Mail class="h-4 w-4 mr-2 text-gray-400" />
									{attendee.email}
								</div>
								<div class="text-sm text-gray-500 flex items-center mt-1">
									<Phone class="h-4 w-4 mr-2 text-gray-400" />
									{attendee.phone}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{attendee.company}</div>
								<div class="text-sm text-gray-500">{attendee.position}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusColor(attendee.status)}">
									{attendee.status}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getTicketTypeColor(attendee.ticketType)}">
									{attendee.ticketType}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<div class="flex items-center">
									<Calendar class="h-4 w-4 mr-2 text-gray-400" />
									{new Date(attendee.registrationDate).toLocaleDateString()}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button
									onclick={() => viewAttendeeDetails(attendee)}
									class="text-blue-600 hover:text-blue-900"
								>
									View Details
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		{#if filteredAttendees.length === 0}
			<div class="text-center py-8">
				<Users class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">No attendees found</h3>
				<p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
			</div>
		{/if}
	</div>
</div>

<!-- Attendee Details Modal -->
{#if showModal && selectedAttendee}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium text-gray-900">Attendee Details</h3>
					<button
						onclick={() => showModal = false}
						aria-label="Close modal"
						class="text-gray-400 hover:text-gray-600"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				
				<!-- ... rest of the modal content ... -->
				
				<div class="mt-6 flex justify-end">
					<button
						onclick={() => showModal = false}
						class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

