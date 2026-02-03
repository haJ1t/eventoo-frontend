<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { goto } from '$app/navigation';
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ArrowLeft, Palette, Save, RotateCcw, Settings } from "@lucide/svelte";

	// Settings state
	let userSettings = {
		theme: "light",
	};

	function goBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}

	function saveSettings() {
		console.log('Settings saved:', userSettings);
		alert('Settings saved successfully!');
	}

	function resetSettings() {
		if (confirm('Are you sure you want to reset all settings to default?')) {
			userSettings = {
				theme: "light",
			};
		}
	}

	const themeOptions = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "system", label: "System" }
	];
</script>

<svelte:head>
	<title>Settings - Evento</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8 page-pad">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="sm" onclick={goBack} class="h-9 w-9 p-0" disabled={false}>
				<ArrowLeft class="w-4 h-4" />
			</Button>
			<div class="flex items-start gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
					<Settings class="h-5 w-5" />
				</div>
				<div>
					<h1 class="text-3xl font-bold tracking-tight">Settings</h1>
					<p class="text-muted-foreground">Manage your account settings and preferences</p>
				</div>
			</div>
		</div>
		<Badge variant="secondary" class="hidden sm:inline-flex" href="#">Beta</Badge>
	</div>

	<!-- Appearance Settings -->
	<Card.Root class="border-0 shadow-lg">
		<Card.Header class="pb-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
					<Palette class="w-5 h-5 text-purple-600 dark:text-purple-400" />
				</div>
				<div>
					<Card.Title class="text-xl">Appearance</Card.Title>
					<Card.Description class="text-sm">Customize the look and feel of your application</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-6">
			<div class="space-y-2">
				<Label for="theme" class="text-sm font-medium">Theme Preference</Label>
				<select 
					id="theme" 
					bind:value={userSettings.theme} 
					class="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#each themeOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<p class="text-xs text-muted-foreground mt-1">Choose how the interface appears to you</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Action Buttons -->
	<div class="flex flex-col sm:flex-row gap-4 pt-6">
		<Button on:click={saveSettings} class="flex-1" disabled={false}>
			Save Changes
		</Button>
		<Button variant="outline" on:click={resetSettings} class="flex-1" disabled={false}>
			Reset to Default
		</Button>
	</div>
</div>
