<script lang="ts">
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import AppHeader from "$lib/components/app-header.svelte";
	import ToastContainer from "$lib/components/toast-container.svelte";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getSession } from "$lib/services/api";

	// Check if we are on the login page
	const isLoginPage = derived(
		page,
		($page) =>
			$page.url.pathname === "/login" ||
			$page.url.pathname === "/register",
	);

	onMount(() => {
		const checkAuth = async (path: string) => {
			const isAuthPage =
				path === "/login" || path === "/register" || path === "/reset-password";
			const session = await getSession().catch(() => null);
			if (!session && !isAuthPage) {
				goto("/login");
				return;
			}
			if (session && isAuthPage) {
				goto("/home");
			}
		};

		void checkAuth(window.location.pathname);
		const unsubscribe = page.subscribe(($page) => {
			void checkAuth($page.url.pathname);
		});
		return unsubscribe;
	});
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
				<main class="flex-1">
					{#key $page.url.pathname}
						<slot />
					{/key}
				</main>
			</div>
		</div>
	</Sidebar.Provider>
{:else}
	<slot />
{/if}

<!-- Global Toast Notifications -->
<ToastContainer />
