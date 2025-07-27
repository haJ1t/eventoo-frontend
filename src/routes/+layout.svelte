<script lang="ts">
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import AppHeader from "$lib/components/app-header.svelte";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	// Check if we are on the login page
	const isLoginPage = derived(page, ($page) => $page.url.pathname === "/login" || $page.url.pathname === "/register");
</script>

{#if !$isLoginPage}
<Sidebar.Provider>
	<!-- Fixed Header (z-index ensures it stays on top) -->
	<div class="fixed top-0 left-0 right-0 z-50">
		<AppHeader />
	</div>

	<!-- Horizontal layout below header -->
	<div class="pt-[60px] flex h-[calc(100vh-60px)] w-full overflow-hidden">
		<!-- Sidebar (shadcn handles sizing) -->
		<AppSidebar />

		<!-- Main Content Area -->
		<main class="flex-1 overflow-y-auto p-4">
			<slot />
		</main>
	</div>
</Sidebar.Provider>
{:else}
	<slot />
{/if}
