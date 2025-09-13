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
<Sidebar.Provider class="" style="">
	<!-- Full height layout -->
	<div class="flex min-h-screen w-full">
		<!-- Sidebar (full height) -->
		<AppSidebar />

		<!-- Main Content Area -->
		<div class="flex-1 flex flex-col">
			<!-- Header (now inside main content) -->
			<AppHeader />
			
			<!-- Page Content -->
			<main class="flex-1 p-4 pb-8">
				<slot />
			</main>
		</div>
	</div>
</Sidebar.Provider>
{:else}
	<slot />
{/if}
