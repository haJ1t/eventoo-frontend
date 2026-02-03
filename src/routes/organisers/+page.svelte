<script lang="ts">
	import { goto } from "$app/navigation";
	import {
		Briefcase,
		MapPin,
		Search,
		Filter,
		LayoutGrid,
		List,
		Plus,
		Download,
		TrendingUp,
		Users,
		Star,
		Award,
		Building2,
		Globe,
		Mail,
		Phone,
		ArrowUpRight,
		Tag,
		Edit,
		Trash2,
	} from "lucide-svelte";

	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";

	import AppSearchBar from "$lib/components/app-search-bar.svelte";
	import AppFilterDropdown from "$lib/components/app-filter-dropdown.svelte";
	import AppOrganiserDetailsModal from "$lib/components/app-organiser-details-modal.svelte";
	import { fetchOrganizers, updateOrganizer, deleteOrganizer, type Organizer } from "$lib/services/api";
	import { onMount } from "svelte";

	let organisers = $state<Organizer[]>([]);
	let isLoading = $state(true);

	// Edit modal state
	let editModalOpen = $state(false);
	let editingOrganiser = $state<Organizer | null>(null);
	let editFormData = $state({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		organization_name: "",
	});
	let isUpdating = $state(false);

	// Delete dialog state
	let deleteDialogOpen = $state(false);
	let deletingOrganiser = $state<Organizer | null>(null);
	let isDeleting = $state(false);

	async function loadOrganisers() {
		try {
			const data = await fetchOrganizers();
			organisers = data.map((o) => ({
				...o,
				name: o.organization_name,
				image: o.profile_image || "",
				rating: 4.8,
				eventsCount: 12,
				bio: "Experienced event organizer.",
				location: "Unknown",
				tags: ["Professional", "Corporate"],
				featured: false,
				contact: { email: o.email, phone: o.phone },
				socialMedia: {
					twitter: "eventoo",
					linkedin: "eventoo",
					website: "eventoo.com",
				},
			}));
		} catch (e) {
			console.error(e);
		}
	}

	onMount(async () => {
		try {
			await loadOrganisers();
		} catch (e) {
			console.error(e);
		} finally {
			isLoading = false;
		}
	});

	// Edit functions
	function openEditModal(organiser: Organizer) {
		editingOrganiser = organiser;
		editFormData = {
			first_name: organiser.first_name || organiser.organization_name || '',
			last_name: organiser.last_name || '',
			email: organiser.email,
			phone: organiser.phone || '',
			organization_name: organiser.organization_name || organiser.name || '',
		};
		editModalOpen = true;
	}

	async function handleUpdate() {
		if (!editingOrganiser) return;
		isUpdating = true;

		try {
			await updateOrganizer(editingOrganiser.id, editFormData);
			await loadOrganisers();
			editModalOpen = false;
			editingOrganiser = null;
		} catch (err: any) {
			console.error("Failed to update organiser:", err);
			alert("Failed to update organiser: " + err.message);
		} finally {
			isUpdating = false;
		}
	}

	// Delete functions
	function openDeleteDialog(organiser: Organizer) {
		deletingOrganiser = organiser;
		deleteDialogOpen = true;
	}

	async function confirmDelete() {
		if (!deletingOrganiser) return;
		isDeleting = true;

		try {
			await deleteOrganizer(deletingOrganiser.id);
			organisers = organisers.filter(o => o.id !== deletingOrganiser!.id);
			deleteDialogOpen = false;
			deletingOrganiser = null;
		} catch (err: any) {
			console.error("Failed to delete organiser:", err);
			alert("Failed to delete organiser: " + err.message);
		} finally {
			isDeleting = false;
		}
	}

	// State
	let searchQuery = $state("");
	let selectedTags = $state([]);
	let selectedLocations = $state([]);
	let activeDropdown = $state(null);
	let viewMode = $state("grid"); // 'grid' | 'list'
	let currentPage = $state(1);
	let itemsPerPage = $state(9);

	// Modal state
	let selectedOrganiser = $state<Organizer | null>(null);
	let isModalOpen = $state(false);

	// Derived Values
	const uniqueTags = $derived.by(() => [
		...new Set(organisers.flatMap((o) => o.tags || [])),
	]);
	const uniqueLocations = $derived.by(() => [
		...new Set(organisers.map((o) => o.location)),
	]);

	const filteredOrganisers = $derived.by(() => {
		let filtered = organisers;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(o) =>
					o.name?.toLowerCase().includes(query) ||
					o.location?.toLowerCase().includes(query) ||
					o.tags?.some((t) => t.toLowerCase().includes(query)),
			);
		}

		if (selectedTags.length > 0) {
			filtered = filtered.filter((o) =>
				selectedTags.some((tag) => o.tags.includes(tag)),
			);
		}

		if (selectedLocations.length > 0) {
			filtered = filtered.filter((o) =>
				selectedLocations.some((loc) => o.location.includes(loc)),
			);
		}

		return [...filtered].sort(
			(a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
		);
	});

	const paginatedOrganisers = $derived.by(() =>
		filteredOrganisers.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		),
	);

	const stats = $derived.by(() => ({
		total: organisers.length,
		featured: organisers.filter((o) => o.featured).length,
		avgRating: (
			organisers.reduce((acc, o) => acc + o.rating, 0) / organisers.length
		).toFixed(1),
	}));

	// Effects
	$effect(() => {
		searchQuery;
		selectedTags;
		selectedLocations;
		viewMode;
		currentPage = 1;
	});

	// Functions
	function handleDropdownToggle(dropdownType) {
		if (activeDropdown === dropdownType) {
			activeDropdown = null;
		} else {
			activeDropdown = dropdownType;
		}
	}

	function handleClickOutside(event) {
		if (!event.target.closest(".dropdown-container")) {
			activeDropdown = null;
		}
	}

	function clearFilters() {
		searchQuery = "";
		selectedTags = [];
		selectedLocations = [];
		activeDropdown = null;
	}

	function handleViewDetails(organiser: Organizer) {
		selectedOrganiser = organiser;
		isModalOpen = true;
	}
</script>

<svelte:head>
	<title>Organisers - Evento</title>
</svelte:head>

<svelte:window onclick={handleClickOutside} />

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 page-pad">
	<div class="w-full max-w-full space-y-8">
		<!-- Header Section -->
		<div
			class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-start gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
				>
					<Building2 class="h-5 w-5" />
				</div>
				<div>
					<h1
						class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
					>
						Organisers
					</h1>
					<p class="mt-1 text-gray-500 dark:text-gray-400">
						Discover top event planners and agencies
					</p>
				</div>
			</div>
			<div class="flex gap-3">
				<Button
					variant="outline"
					class="hidden sm:flex"
					disabled={false}
				>
					<Download class="mr-2 h-4 w-4" />
					Export
				</Button>
				<Button
					onclick={() => goto("/organisers/create")}
					disabled={false}
					class="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
				>
					<Plus class="mr-2 h-4 w-4" />
					Add Organiser
				</Button>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Total Partners
						</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.total}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
					>
						<Building2 class="h-6 w-6 text-gray-600" />
					</div>
				</div>
			</div>

			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Featured Organisers
						</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{stats.featured}
						</p>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20"
					>
						<Award class="h-6 w-6 text-amber-600" />
					</div>
				</div>
			</div>

			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">
							Avg. Rating
						</p>
						<div class="mt-2 flex items-baseline gap-2">
							<p class="text-3xl font-bold text-gray-900">
								{stats.avgRating}
							</p>
							<div class="flex text-amber-400">
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current opacity-50" />
							</div>
						</div>
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20"
					>
						<TrendingUp class="h-6 w-6 text-blue-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Search & Filter Section -->
		<div
			class="relative z-40 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
		>
			<div class="space-y-4">
				<div class="relative">
					<AppSearchBar
						bind:value={searchQuery}
						placeholder="Search by name, location, or tag..."
						showIcon={true}
					/>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex flex-wrap gap-3">
						<div class="relative dropdown-container z-30">
							<AppFilterDropdown
								bind:selectedValues={selectedLocations}
								options={uniqueLocations}
								allOptions={uniqueLocations}
								label="Location"
								icon={MapPin}
								isOpen={activeDropdown === "location"}
								onToggle={() =>
									handleDropdownToggle("location")}
							/>
						</div>

						<div class="relative dropdown-container z-20">
							<AppFilterDropdown
								bind:selectedValues={selectedTags}
								options={uniqueTags}
								allOptions={uniqueTags}
								label="Tags"
								icon={Tag}
								isOpen={activeDropdown === "tags"}
								onToggle={() => handleDropdownToggle("tags")}
							/>
						</div>

						{#if searchQuery || selectedTags.length > 0 || selectedLocations.length > 0}
							<Button
								variant="ghost"
								disabled={false}
								onclick={clearFilters}
								class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
							>
								Clear Filters
							</Button>
						{/if}
					</div>

					<div
						class="flex items-center gap-2 border-l pl-4 border-gray-200"
					>
						<span class="text-sm text-gray-500 mr-1">View:</span>
						<Button
							variant={viewMode === "grid"
								? "secondary"
								: "ghost"}
							size="icon"
							onclick={() => (viewMode = "grid")}
							class="h-9 w-9"
							title="Grid View"
						>
							<LayoutGrid class="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "list"
								? "secondary"
								: "ghost"}
							size="icon"
							onclick={() => (viewMode = "list")}
							class="h-9 w-9"
							title="List View"
						>
							<List class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Content -->
		<div class="space-y-6">
			<div
				class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
			>
				<span
					>Showing {paginatedOrganisers.length} of {filteredOrganisers.length}
					organisers</span
				>
				<span
					>Page {currentPage} of {Math.ceil(
						filteredOrganisers.length / itemsPerPage,
					)}</span
				>
			</div>

			{#if viewMode === "grid"}
				<!-- Grid View -->
				<div
					class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{#each paginatedOrganisers as organiser (organiser.id)}
						<div
							animate:flip={{ duration: 400 }}
							in:fade={{ duration: 300 }}
						>
							<div
								class="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900 dark:ring-gray-800 h-full"
							>
								<!-- Cover Image Stub -->
								<div
									class="h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative"
								>
									{#if organiser.featured}
										<div
											class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-amber-600 flex items-center shadow-sm"
										>
											<Award
												class="w-3 h-3 mr-1 fill-amber-600"
											/> Featured
										</div>
									{/if}
								</div>

								<div class="px-6 pb-6 flex-1 flex flex-col">
									<!-- Logo/Image -->
									<div class="relative -mt-10 mb-4">
										<div
											class="h-20 w-20 rounded-xl bg-white p-1 ring-4 ring-white shadow-sm dark:bg-gray-800 dark:ring-gray-900"
										>
											<div
												class="h-full w-full rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden"
											>
												{#if organiser.image && !organiser.image.includes("Company")}
													<img
														src={organiser.image}
														alt={organiser.name}
														class="h-full w-full object-cover"
													/>
												{:else}
													<Building2
														class="h-8 w-8 text-gray-300"
													/>
												{/if}
											</div>
										</div>
									</div>

									<div class="mb-4">
										<h3
											class="font-bold text-gray-900 text-lg mb-1 dark:text-gray-100"
										>
											{organiser.name}
										</h3>
										<p
											class="text-sm text-gray-500 line-clamp-2"
										>
											{organiser.bio}
										</p>
									</div>

									<div class="space-y-2 mb-6 flex-1">
										<div
											class="flex items-center text-sm text-gray-600"
										>
											<MapPin
												class="h-4 w-4 mr-2 text-gray-400"
											/>
											{organiser.location}
										</div>
										<div
											class="flex items-center text-sm text-gray-600"
										>
											<Briefcase
												class="h-4 w-4 mr-2 text-gray-400"
											/>
											{organiser.eventsCount}
										</div>
									</div>

									<div
										class="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800"
									>
										{#each organiser.tags.slice(0, 3) as tag}
											<Badge
												variant="secondary"
												class="bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
												>{tag}</Badge
											>
										{/each}
									</div>

									<div
										class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between dark:border-gray-800"
									>
										<div
											class="flex items-center text-sm font-medium text-gray-900"
										>
											<Star
												class="h-4 w-4 text-amber-400 fill-amber-400 mr-1"
											/>
											{organiser.rating}
										</div>

										<div class="flex items-center gap-2">
											<button
												onclick={() => openEditModal(organiser)}
												class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<Edit class="h-4 w-4" />
											</button>
											<button
												onclick={() => openDeleteDialog(organiser)}
												class="p-1.5 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<Trash2 class="h-4 w-4" />
											</button>
											<button
												onclick={() =>
													handleViewDetails(organiser)}
												class="text-sm font-semibold text-gray-900 hover:text-gray-700 flex items-center gap-1 group-hover/btn:underline"
											>
												View Profile <ArrowUpRight
													class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
												/>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- List View -->
				<div
					class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
				>
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm">
							<thead
								class="bg-gray-50 text-gray-500 font-medium dark:bg-gray-800/50"
							>
								<tr>
									<th class="px-6 py-4">Organiser</th>
									<th class="px-6 py-4">Location</th>
									<th class="px-6 py-4">Events</th>
									<th class="px-6 py-4">Tags</th>
									<th class="px-6 py-4">Rating</th>
									<th class="px-6 py-4 text-right">Action</th>
								</tr>
							</thead>
							<tbody
								class="divide-y divide-gray-100 dark:divide-gray-800"
							>
								{#each paginatedOrganisers as organiser (organiser.id)}
									<tr
										class="hover:bg-gray-50/50 transition-colors group"
									>
										<td class="px-6 py-4">
											<div
												class="flex items-center gap-3"
											>
												<div
													class="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 overflow-hidden"
												>
													{#if organiser.image && !organiser.image.includes("Company")}
														<img
															src={organiser.image}
															alt={organiser.name}
															class="h-full w-full object-cover"
														/>
													{:else}
														<Building2
															class="h-5 w-5 text-gray-400"
														/>
													{/if}
												</div>
												<div>
													<p
														class="font-medium text-gray-900 flex items-center gap-2"
													>
														{organiser.name}
														{#if organiser.featured}
															<Award
																class="h-3 w-3 text-amber-500"
															/>
														{/if}
													</p>
													<p
														class="text-xs text-gray-500 truncate max-w-[200px]"
													>
														{organiser.contact
															.email}
													</p>
												</div>
											</div>
										</td>
										<td class="px-6 py-4 text-gray-600"
											>{organiser.location}</td
										>
										<td class="px-6 py-4 text-gray-600"
											>{organiser.eventsCount}</td
										>
										<td class="px-6 py-4">
											<div class="flex gap-1 flex-wrap">
												{#each organiser.tags.slice(0, 2) as tag}
													<Badge
														variant="outline"
														class="text-[10px] px-1 py-0 h-5 border-gray-200 text-gray-500"
														>{tag}</Badge
													>
												{/each}
											</div>
										</td>
										<td class="px-6 py-4">
											<div
												class="flex items-center text-gray-900 font-medium"
											>
												<Star
													class="h-3 w-3 text-amber-400 fill-amber-400 mr-1"
												/>
												{organiser.rating}
											</div>
										</td>
										<td class="px-6 py-4 text-right">
											<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
												<Button
													variant="ghost"
													size="sm"
													onclick={() => openEditModal(organiser)}
												>
													<Edit class="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onclick={() => openDeleteDialog(organiser)}
													class="hover:text-red-600 hover:bg-red-50"
												>
													<Trash2 class="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onclick={() =>
														handleViewDetails(
															organiser,
														)}
												>
													View
												</Button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Pagination -->
			{#if filteredOrganisers.length > 0}
				<div class="flex justify-center pt-8">
					<Pagination.Root
						count={filteredOrganisers.length}
						perPage={itemsPerPage}
						bind:page={currentPage}
						class=""
					>
						{#snippet children({
							pages,
							currentPage: paginationCurrentPage,
						})}
							<Pagination.Content class="">
								<Pagination.Item class="">
									<Pagination.PrevButton
										children={null}
										class=""
									/>
								</Pagination.Item>
								{#each pages as page (page.key)}
									{#if page.type === "ellipsis"}
										<Pagination.Item class="">
											<Pagination.Ellipsis class="" />
										</Pagination.Item>
									{:else}
										<Pagination.Item class="">
											<Pagination.Link
												{page}
												isActive={paginationCurrentPage ===
													page.value}
												class=""
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item class="">
									<Pagination.NextButton
										children={null}
										class=""
									/>
								</Pagination.Item>
							</Pagination.Content>
						{/snippet}
					</Pagination.Root>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Organiser Details Modal -->
{#if selectedOrganiser}
	<AppOrganiserDetailsModal
		organiser={selectedOrganiser}
		bind:open={isModalOpen}
	/>
{/if}

<!-- Edit Organiser Modal -->
<Dialog.Root bind:open={editModalOpen}>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Edit Organiser</Dialog.Title>
			<Dialog.Description>
				Update organiser information below.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="space-y-2">
				<Label for="edit-org-name">Organization Name</Label>
				<Input
					id="edit-org-name"
					bind:value={editFormData.organization_name}
					placeholder="Organization name"
					type="text"
				/>
			</div>
			<div class="space-y-2">
				<Label for="edit-email">Email</Label>
				<Input
					id="edit-email"
					bind:value={editFormData.email}
					placeholder="Email address"
					type="email"
				/>
			</div>
			<div class="space-y-2">
				<Label for="edit-phone">Phone</Label>
				<Input
					id="edit-phone"
					bind:value={editFormData.phone}
					placeholder="Phone number"
					type="text"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => editModalOpen = false} disabled={isUpdating}>
				Cancel
			</Button>
			<Button onclick={handleUpdate} disabled={isUpdating}>
				{isUpdating ? "Saving..." : "Save Changes"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Organiser?</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete "{deletingOrganiser?.name}"? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isDeleting}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={confirmDelete}
				class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
				disabled={isDeleting}
			>
				{isDeleting ? "Deleting..." : "Delete"}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
