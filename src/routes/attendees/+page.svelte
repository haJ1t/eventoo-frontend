<script lang="ts">
	import { goto } from "$app/navigation";
	import {
		Users,
		Mail,
		Phone,
		MapPin,
		UserCheck,
		Clock,
		Plus,
		Download,
		Edit,
		LayoutGrid,
		List,
		MoreHorizontal,
		Ticket,
		TrendingUp,
		Search,
		ArrowUpRight,
		Sparkles,
	} from "lucide-svelte";

	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import { fade, fly } from "svelte/transition";
	import { flip } from "svelte/animate";

	import AppSearchBar from "$lib/components/app-search-bar.svelte";
	import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
	import {
		attendees as attendeesData,
		type Attendee,
	} from "$lib/data/attendees";

	// State
	let attendees = $state<Attendee[]>(attendeesData);
	let searchQuery = $state("");
	let selectedStatuses = $state<string[]>([]);
	let selectedTicketTypes = $state<string[]>([]);
	let activeDropdown = $state<string | null>(null);
	let viewMode = $state("grid");
	let currentPage = $state(1);
	let itemsPerPage = $state(8);

	// Modal state
	let showDetailsModal = $state(false);
	let selectedAttendee = $state<Attendee | null>(null);

	function openDetailsModal(attendee: Attendee) {
		selectedAttendee = attendee;
		showDetailsModal = true;
	}

	function closeDetailsModal() {
		showDetailsModal = false;
		selectedAttendee = null;
	}

	// Derived Values
	const uniqueStatuses = $derived.by(() => [
		...new Set(attendees.map((a) => a.status)),
	]);
	const uniqueTicketTypes = $derived.by(() => [
		...new Set(attendees.map((a) => a.ticketType)),
	]);

	const filteredAttendees = $derived.by(() => {
		let filtered = attendees;
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(a) =>
					a.name.toLowerCase().includes(query) ||
					a.email.toLowerCase().includes(query) ||
					a.company.toLowerCase().includes(query),
			);
		}
		if (selectedStatuses.length > 0) {
			filtered = filtered.filter((a) =>
				selectedStatuses.includes(a.status),
			);
		}
		if (selectedTicketTypes.length > 0) {
			filtered = filtered.filter((a) =>
				selectedTicketTypes.includes(a.ticketType),
			);
		}
		return filtered;
	});

	const paginatedAttendees = $derived.by(() =>
		filteredAttendees.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		),
	);

	const stats = $derived.by(() => ({
		total: attendees.length,
		confirmed: attendees.filter((a) => a.status === "confirmed").length,
		pending: attendees.filter((a) => a.status === "pending").length,
		checkedIn: attendees.filter((a) => a.checkedIn).length,
	}));

	$effect(() => {
		searchQuery;
		selectedStatuses;
		selectedTicketTypes;
		currentPage = 1;
	});

	function handleDropdownToggle(type: string) {
		activeDropdown = activeDropdown === type ? null : type;
	}
	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest(".dropdown-container")) {
			activeDropdown = null;
		}
	}
	function clearFilters() {
		searchQuery = "";
		selectedStatuses = [];
		selectedTicketTypes = [];
	}
	function getStatusStyles(status: string) {
		switch (status) {
			case "confirmed":
				return {
					bg: "bg-emerald-500/10",
					text: "text-emerald-600",
					dot: "bg-emerald-500",
				};
			case "pending":
				return {
					bg: "bg-amber-500/10",
					text: "text-amber-600",
					dot: "bg-amber-500",
				};
			case "cancelled":
				return {
					bg: "bg-rose-500/10",
					text: "text-rose-600",
					dot: "bg-rose-500",
				};
			default:
				return {
					bg: "bg-gray-500/10",
					text: "text-gray-600",
					dot: "bg-gray-500",
				};
		}
	}
</script>

<svelte:head><title>Attendees - Evento</title></svelte:head>
<svelte:window onclick={handleClickOutside} />

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div
			class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
		>
			<div>
				<div class="flex items-center gap-3 mb-2">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
					>
						<Users class="h-5 w-5 text-white" />
					</div>
					<h1
						class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
					>
						Attendees
					</h1>
				</div>
				<p class="text-gray-500 dark:text-gray-400 ml-[52px]">
					Manage your guest list, track RSVPs and check-ins
				</p>
			</div>
			<div class="flex gap-3">
				<Button
					variant="outline"
					class="border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
					disabled={false}
				>
					<Download class="mr-2 h-4 w-4" /> Export CSV
				</Button>
				<Button
					onclick={() => goto("/attendees/create")}
					class="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-0"
					disabled={false}
				>
					<Plus class="mr-2 h-4 w-4" /> Add Attendee
				</Button>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Total Guests
						</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.total}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
					>
						<Users class="h-6 w-6 text-gray-600" />
					</div>
				</div>
			</div>

			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Confirmed
						</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.confirmed}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20"
					>
						<UserCheck class="h-6 w-6 text-green-600" />
					</div>
				</div>
			</div>

			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">Pending</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.pending}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20"
					>
						<Clock class="h-6 w-6 text-amber-600" />
					</div>
				</div>
			</div>

			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Checked In
						</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.checkedIn}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
					>
						<Sparkles class="h-6 w-6 text-gray-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Search & Filters -->
		<div
			class="relative z-50 mb-8 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm dark:bg-gray-900/80 dark:ring-gray-800"
		>
			<div
				class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
			>
				<div class="relative flex-1 max-w-md">
					<Search
						class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search attendees..."
						class="w-full rounded-xl border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:ring-gray-700"
					/>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<div class="dropdown-container z-30">
						<AppFilterDropdown
							bind:selectedValues={selectedStatuses}
							options={uniqueStatuses}
							allOptions={uniqueStatuses}
							label="Status"
							icon={UserCheck}
							isOpen={activeDropdown === "status"}
							onToggle={() => handleDropdownToggle("status")}
						/>
					</div>
					<div class="dropdown-container z-20">
						<AppFilterDropdown
							bind:selectedValues={selectedTicketTypes}
							options={uniqueTicketTypes}
							allOptions={uniqueTicketTypes}
							label="Ticket"
							icon={Ticket}
							isOpen={activeDropdown === "ticket"}
							onToggle={() => handleDropdownToggle("ticket")}
						/>
					</div>
					{#if searchQuery || selectedStatuses.length || selectedTicketTypes.length}
						<button
							onclick={clearFilters}
							class="text-sm font-medium text-gray-600 hover:text-gray-900"
							>Clear all</button
						>
					{/if}
					<div
						class="ml-auto flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
					>
						<button
							onclick={() => (viewMode = "grid")}
							class="rounded-md p-2 transition-colors {viewMode ===
							'grid'
								? 'bg-white shadow-sm dark:bg-gray-700'
								: 'text-gray-500 hover:text-gray-900'}"
						>
							<LayoutGrid class="h-4 w-4" />
						</button>
						<button
							onclick={() => (viewMode = "list")}
							class="rounded-md p-2 transition-colors {viewMode ===
							'list'
								? 'bg-white shadow-sm dark:bg-gray-700'
								: 'text-gray-500 hover:text-gray-900'}"
						>
							<List class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Content -->
		<div
			class="mb-4 flex items-center justify-between text-sm text-gray-500"
		>
			<span
				>Showing <span class="font-medium text-gray-900"
					>{paginatedAttendees.length}</span
				>
				of
				<span class="font-medium text-gray-900"
					>{filteredAttendees.length}</span
				> attendees</span
			>
		</div>

		{#if viewMode === "grid"}
			<div
				class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each paginatedAttendees as attendee (attendee.id)}
					<div
						animate:flip={{ duration: 300 }}
						in:fade={{ duration: 200 }}
					>
						<div
							class="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
						>
							<!-- Top gradient bar -->
							<div class="h-1 w-full bg-primary"></div>

							<div class="p-6">
								<!-- Avatar & Status -->
								<div
									class="mb-5 flex items-start justify-between"
								>
									<div class="relative">
										<div
											class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary ring-4 ring-white shadow-sm dark:ring-gray-900"
										>
											{attendee.avatar ||
												attendee.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
										</div>
										{#if attendee.checkedIn}
											<div
												class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
											>
												<UserCheck
													class="h-3 w-3 text-white"
												/>
											</div>
										{/if}
									</div>
									<div
										class="flex items-center gap-1.5 rounded-full {getStatusStyles(
											attendee.status,
										).bg} px-3 py-1"
									>
										<span
											class="h-1.5 w-1.5 rounded-full {getStatusStyles(
												attendee.status,
											).dot}"
										></span>
										<span
											class="text-xs font-medium capitalize {getStatusStyles(
												attendee.status,
											).text}">{attendee.status}</span
										>
									</div>
								</div>

								<!-- Info -->
								<div class="mb-5">
									<h3
										class="text-lg font-semibold text-gray-900 dark:text-white"
									>
										{attendee.name}
									</h3>
									<p class="mt-0.5 text-sm text-gray-500">
										{attendee.position}
									</p>
									<p
										class="mt-0.5 text-xs font-medium uppercase tracking-wider text-primary"
									>
										{attendee.company}
									</p>
								</div>

								<!-- Contact -->
								<div
									class="space-y-2.5 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50"
								>
									<div
										class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
									>
										<Mail class="h-4 w-4 text-gray-400" />
										<span class="truncate"
											>{attendee.email}</span
										>
									</div>
									<div
										class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
									>
										<MapPin class="h-4 w-4 text-gray-400" />
										<span class="truncate"
											>{attendee.location}</span
										>
									</div>
								</div>

								<!-- Footer -->
								<div
									class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800"
								>
									<Badge
										href="#"
										class="border-0 {attendee.ticketType ===
										'VIP'
											? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
											: 'bg-gray-100 text-gray-700'}"
									>
										{attendee.ticketType}
									</Badge>
									<button
										onclick={() =>
											openDetailsModal(attendee)}
										class="flex items-center gap-1 text-sm font-medium text-gray-900 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-700"
									>
										View <ArrowUpRight class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- List View -->
			<div
				class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
			>
				<table class="w-full">
					<thead
						class="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50"
					>
						<tr>
							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
								>Attendee</th
							>
							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
								>Contact</th
							>
							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
								>Company</th
							>
							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
								>Status</th
							>
							<th
								class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
								>Actions</th
							>
						</tr>
					</thead>
					<tbody
						class="divide-y divide-gray-100 dark:divide-gray-800"
					>
						{#each paginatedAttendees as attendee (attendee.id)}
							<tr
								class="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
							>
								<td class="px-6 py-4">
									<div class="flex items-center gap-4">
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 font-semibold text-violet-700"
										>
											{attendee.avatar ||
												attendee.name.charAt(0)}
										</div>
										<div>
											<p
												class="font-semibold text-gray-900 dark:text-white"
											>
												{attendee.name}
											</p>
											<p class="text-xs text-gray-500">
												{attendee.location}
											</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<p
										class="text-sm text-gray-700 dark:text-gray-300"
									>
										{attendee.email}
									</p>
									<p class="text-xs text-gray-400">
										{attendee.phone}
									</p>
								</td>
								<td class="px-6 py-4">
									<p
										class="font-medium text-gray-900 dark:text-white"
									>
										{attendee.company}
									</p>
									<p class="text-xs text-gray-500">
										{attendee.position}
									</p>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<span
											class="flex items-center gap-1.5 rounded-full {getStatusStyles(
												attendee.status,
											).bg} px-2.5 py-1"
										>
											<span
												class="h-1.5 w-1.5 rounded-full {getStatusStyles(
													attendee.status,
												).dot}"
											></span>
											<span
												class="text-xs font-medium capitalize {getStatusStyles(
													attendee.status,
												).text}">{attendee.status}</span
											>
										</span>
										<Badge
											href="#"
											class="border-0 text-[10px] {attendee.ticketType ===
											'VIP'
												? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
												: 'bg-gray-100 text-gray-600'}"
										>
											{attendee.ticketType}
										</Badge>
									</div>
								</td>
								<td class="px-6 py-4 text-right">
									<Button
										variant="ghost"
										size="sm"
										class="opacity-0 group-hover:opacity-100"
										disabled={false}
									>
										<Edit class="h-4 w-4" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Pagination -->
		{#if filteredAttendees.length > itemsPerPage}
			<div class="mt-8 flex justify-center">
				<Pagination.Root
					count={filteredAttendees.length}
					perPage={itemsPerPage}
					bind:page={currentPage}
					class=""
				>
					{#snippet children({ pages, currentPage: pageCurrent })}
						<Pagination.Content class="">
							<Pagination.Item class=""
								><Pagination.PrevButton
									children={null}
									class=""
								/></Pagination.Item
							>
							{#each pages as page (page.key)}
								{#if page.type === "ellipsis"}
									<Pagination.Item class=""
										><Pagination.Ellipsis
											class=""
										/></Pagination.Item
									>
								{:else}
									<Pagination.Item class=""
										><Pagination.Link
											{page}
											isActive={pageCurrent ===
												page.value}
											class=""
											>{page.value}</Pagination.Link
										></Pagination.Item
									>
								{/if}
							{/each}
							<Pagination.Item class=""
								><Pagination.NextButton
									children={null}
									class=""
								/></Pagination.Item
							>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			</div>
		{/if}
	</div>
</div>

<!-- Attendee Details Modal -->
<Dialog.Root bind:open={showDetailsModal}>
	<Dialog.Content class="sm:max-w-lg" portalProps={{}}>
		<Dialog.Header class="">
			<Dialog.Title class="">Attendee Details</Dialog.Title>
			<Dialog.Description class=""
				>Complete information about this attendee</Dialog.Description
			>
		</Dialog.Header>

		{#if selectedAttendee}
			<div class="space-y-6 py-4">
				<!-- Avatar and Name -->
				<div class="flex items-center gap-4">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary"
					>
						{selectedAttendee.avatar ||
							selectedAttendee.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							{selectedAttendee.name}
						</h3>
						<p class="text-sm text-gray-500">
							{selectedAttendee.position} at {selectedAttendee.company}
						</p>
					</div>
				</div>

				<!-- Status -->
				<div class="flex items-center gap-2">
					<span
						class="flex items-center gap-1.5 rounded-full {getStatusStyles(
							selectedAttendee.status,
						).bg} px-3 py-1"
					>
						<span
							class="h-1.5 w-1.5 rounded-full {getStatusStyles(
								selectedAttendee.status,
							).dot}"
						></span>
						<span
							class="text-xs font-medium capitalize {getStatusStyles(
								selectedAttendee.status,
							).text}">{selectedAttendee.status}</span
						>
					</span>
					<Badge
						href="#"
						class="border-0 {selectedAttendee.ticketType === 'VIP'
							? 'bg-amber-100 text-amber-700'
							: 'bg-gray-100 text-gray-700'}"
					>
						{selectedAttendee.ticketType}
					</Badge>
					{#if selectedAttendee.checkedIn}
						<Badge
							href="#"
							class="bg-green-100 text-green-700 border-0"
						>
							<UserCheck class="mr-1 h-3 w-3" /> Checked In
						</Badge>
					{/if}
				</div>

				<!-- Contact Info -->
				<div
					class="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
				>
					<h4
						class="text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						Contact Information
					</h4>
					<div class="space-y-2">
						<div
							class="flex items-center gap-3 text-sm text-gray-600"
						>
							<Mail class="h-4 w-4 text-gray-400" />
							<span>{selectedAttendee.email}</span>
						</div>
						<div
							class="flex items-center gap-3 text-sm text-gray-600"
						>
							<Phone class="h-4 w-4 text-gray-400" />
							<span>{selectedAttendee.phone}</span>
						</div>
						<div
							class="flex items-center gap-3 text-sm text-gray-600"
						>
							<MapPin class="h-4 w-4 text-gray-400" />
							<span>{selectedAttendee.location}</span>
						</div>
					</div>
				</div>

				<!-- Company Info -->
				<div class="space-y-2">
					<h4
						class="text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						Professional
					</h4>
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span class="text-gray-500">Company</span>
							<p class="font-medium text-gray-900">
								{selectedAttendee.company}
							</p>
						</div>
						<div>
							<span class="text-gray-500">Position</span>
							<p class="font-medium text-gray-900">
								{selectedAttendee.position}
							</p>
						</div>
					</div>
				</div>
			</div>

			<Dialog.Footer class="">
				<Button
					variant="outline"
					onclick={closeDetailsModal}
					disabled={false}
					class="">Close</Button
				>
				<Button disabled={false} class="">Send Message</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
