<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { goto } from '$app/navigation';
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ArrowLeft, User, Bell, Shield, Palette, Save, RotateCcw } from "@lucide/svelte";

	// Settings state
	let userSettings = {
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		language: "en",
		theme: "light",
		notifications: {
			email: true,
			push: true,
			sms: false,
			marketing: false
		},
		privacy: {
			profileVisible: true,
			showEmail: false,
			showPhone: false
		}
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
				name: "John Doe",
				email: "john.doe@example.com",
				phone: "+1 (555) 123-4567",
				language: "en",
				theme: "light",
				notifications: {
					email: true,
					push: true,
					sms: false,
					marketing: false
				},
				privacy: {
					profileVisible: true,
					showEmail: false,
					showPhone: false
				}
			};
		}
	}

	// Language and theme options
	const languageOptions = [
		{ value: "en", label: "English" },
		{ value: "es", label: "Español" },
		{ value: "fr", label: "Français" },
		{ value: "de", label: "Deutsch" }
	];

	const themeOptions = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "system", label: "System" }
	];
</script>

<svelte:head>
	<title>Settings - Evento</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="sm" onclick={goBack} class="h-9 w-9 p-0" disabled={false}>
				<ArrowLeft class="w-4 h-4" />
			</Button>
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Settings</h1>
				<p class="text-muted-foreground">Manage your account settings and preferences</p>
			</div>
		</div>
		<Badge variant="secondary" class="hidden sm:inline-flex" href="#">Beta</Badge>
	</div>

	<!-- Profile Settings -->
	<Card.Root class="border-0 shadow-lg">
		<Card.Header class="pb-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-primary/10 rounded-lg">
					<User class="w-5 h-5 text-primary" />
				</div>
				<div>
					<Card.Title class="text-xl">Profile Settings</Card.Title>
					<Card.Description class="text-sm">Manage your personal information and profile details</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<Label for="name" class="text-sm font-medium">Full Name</Label>
					<Input id="name" bind:value={userSettings.name} placeholder="Enter your full name" class="h-11" type="text" />
				</div>
				<div class="space-y-2">
					<Label for="email" class="text-sm font-medium">Email Address</Label>
					<Input id="email" type="email" bind:value={userSettings.email} placeholder="Enter your email" class="h-11" />
				</div>
				<div class="space-y-2">
					<Label for="phone" class="text-sm font-medium">Phone Number</Label>
					<Input id="phone" bind:value={userSettings.phone} placeholder="Enter your phone number" class="h-11" type="text" />
				</div>
				<div class="space-y-2">
					<Label for="language" class="text-sm font-medium">Language</Label>
					<select 
						id="language" 
						bind:value={userSettings.language} 
						class="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#each languageOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

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

	<!-- Notification Settings -->
	<Card.Root class="">
		<Card.Header class="">
			<div class="flex items-center gap-2">
				<Bell class="w-5 h-5" />
				<Card.Title class="">Notifications</Card.Title>
			</div>
			<Card.Description class="">Configure how you want to receive notifications.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Email Notifications</Label>
					<p class="text-sm text-muted-foreground">Receive notifications via email</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.notifications.email} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
			<Separator class="" />
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Push Notifications</Label>
					<p class="text-sm text-muted-foreground">Receive push notifications in your browser</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.notifications.push} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
			<Separator class="" />
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">SMS Notifications</Label>
					<p class="text-sm text-muted-foreground">Receive notifications via SMS</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.notifications.sms} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
			<Separator class="" />
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Marketing Communications</Label>
					<p class="text-sm text-muted-foreground">Receive updates about new features and events</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.notifications.marketing} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Privacy Settings -->
	<Card.Root class="">
		<Card.Header class="">
			<div class="flex items-center gap-2">
				<Shield class="w-5 h-5" />
				<Card.Title class="">Privacy & Security</Card.Title>
			</div>
			<Card.Description class="">Control your privacy and security preferences.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Profile Visibility</Label>
					<p class="text-sm text-muted-foreground">Make your profile visible to other users</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.privacy.profileVisible} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
			<Separator class="" />
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Show Email Address</Label>
					<p class="text-sm text-muted-foreground">Display your email address on your profile</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.privacy.showEmail} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
			<Separator class="" />
			<div class="flex items-center justify-between">
				<div class="space-y-0.5">
					<Label class="">Show Phone Number</Label>
					<p class="text-sm text-muted-foreground">Display your phone number on your profile</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={userSettings.privacy.showPhone} class="sr-only peer" />
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
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