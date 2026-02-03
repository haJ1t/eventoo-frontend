<script lang="ts">
  import { onMount } from "svelte";
  import {
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    ShieldCheck,
    Shield,
    KeyRound,
    Globe,
    BadgeCheck,
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import { fetchMe, updateUser, uploadAvatar, changePassword, resolveApiImage } from "$lib/services/api";

  let user = $state<any>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let saveError = $state<string | null>(null);
  let saveSuccess = $state<string | null>(null);
  let isSaving = $state(false);
  let localTimezone = $state("UTC");
  let avatarUploading = $state(false);
  let avatarError = $state<string | null>(null);
  let passwordError = $state<string | null>(null);
  let passwordSuccess = $state<string | null>(null);

  let passwordForm = $state({
    current: "",
    next: "",
    confirm: "",
  });

  let preferences = $state({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
  });

  let profileForm = $state({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    language: "en",
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  function hydrateForm(data: any) {
    const fullName =
      data?.full_name ||
      `${data?.first_name || ""} ${data?.last_name || ""}`.trim();
    profileForm = {
      fullName: fullName || "User",
      email: data?.email || "",
      phone: data?.phone || "",
      organization: data?.organization_name || "",
      language: profileForm.language || "en",
    };
  }

  function parseName(fullName: string) {
    const parts = fullName.trim().split(" ").filter(Boolean);
    return {
      first_name: parts[0] || "User",
      last_name: parts.slice(1).join(" ") || "User",
    };
  }

  async function handleSaveProfile() {
    if (!user?.id) return;
    isSaving = true;
    saveError = null;
    saveSuccess = null;
    try {
      const nameParts = parseName(profileForm.fullName);
      const updated = await updateUser(user.id, {
        ...nameParts,
        email: profileForm.email,
        phone: profileForm.phone || undefined,
        organization_name: profileForm.organization || undefined,
      });
      user = updated;
      hydrateForm(updated);
      saveSuccess = "Profile updated successfully.";
    } catch (err: any) {
      saveError = err.message || "Failed to update profile.";
    } finally {
      isSaving = false;
    }
  }

  async function handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    avatarUploading = true;
    avatarError = null;
    try {
      const url = await uploadAvatar(input.files[0]);
      user = { ...user, profile_image: url };
    } catch (err: any) {
      avatarError = err.message || "Failed to upload avatar.";
    } finally {
      avatarUploading = false;
      input.value = "";
    }
  }

  async function handleChangePassword() {
    passwordError = null;
    passwordSuccess = null;
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      passwordError = "Please fill in all password fields.";
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      passwordError = "New passwords do not match.";
      return;
    }
    try {
      await changePassword(passwordForm.current, passwordForm.next);
      passwordSuccess = "Password updated successfully.";
      passwordForm = { current: "", next: "", confirm: "" };
    } catch (err: any) {
      passwordError = err.message || "Failed to change password.";
    }
  }

  function handleReset() {
    if (user) hydrateForm(user);
  }

  onMount(async () => {
    try {
      localTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      user = await fetchMe();
      hydrateForm(user);
    } catch (err: any) {
      error = err.message || "Failed to load profile.";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Profile - Evento</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 page-pad">
  <div class="w-full max-w-6xl space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <User class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Profile</h1>
          <p class="mt-1 text-gray-500 dark:text-gray-400">Manage your account information</p>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 animate-pulse h-40"></div>
    {:else if error}
      <div class="rounded-xl bg-white p-6 text-sm text-red-600 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        {error}
      </div>
    {:else if user}
      <!-- Profile Summary -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Account</Card.Title>
            <Card.Description class="text-sm text-gray-500">Signed-in user</Card.Description>
          </Card.Header>
          <Card.Content class="p-0">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center text-xl font-bold">
                {#if user.profile_image}
                  <img src={resolveApiImage(user.profile_image)} alt={user.full_name} class="h-full w-full rounded-2xl object-cover" />
                {:else}
                  {getInitials(user.full_name || "User")}
                {/if}
              </div>
              <div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.full_name || "User"}</p>
                <p class="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
                <input type="file" accept="image/*" class="hidden" on:change={handleAvatarChange} />
                <span class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Upload Avatar</span>
              </label>
              {#if avatarUploading}
                <span class="text-xs text-gray-500">Uploading...</span>
              {/if}
              {#if avatarError}
                <span class="text-xs text-red-600">{avatarError}</span>
              {/if}
            </div>
            <div class="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <ShieldCheck class="h-4 w-4 text-green-600" />
                <span>Authenticated</span>
              </div>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-gray-400" />
                <span>Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</span>
              </div>
              <div class="flex items-center gap-2">
                <BadgeCheck class="h-4 w-4 text-blue-500" />
                <span>{user.organization_name ? "Organizer account" : "Attendee account"}</span>
              </div>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Contact Details</Card.Title>
            <Card.Description class="text-sm text-gray-500">Your primary account information</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <Mail class="h-4 w-4 text-gray-500" />
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-400">Email</p>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <Phone class="h-4 w-4 text-gray-500" />
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-400">Phone</p>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{user.phone || "-"}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 sm:col-span-2">
              <Building2 class="h-4 w-4 text-gray-500" />
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-400">Organization</p>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{user.organization_name || "Individual"}</p>
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <!-- Profile Settings + Overview -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Profile Settings</Card.Title>
            <Card.Description class="text-sm text-gray-500">Update your personal details</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="fullName">Full Name</Label>
                <Input id="fullName" bind:value={profileForm.fullName} type="text" class="h-11" />
              </div>
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" bind:value={profileForm.email} type="email" class="h-11" />
              </div>
              <div class="space-y-2">
                <Label for="phone">Phone</Label>
                <Input id="phone" bind:value={profileForm.phone} type="text" class="h-11" />
              </div>
              <div class="space-y-2">
                <Label for="organization">Organization</Label>
                <Input id="organization" bind:value={profileForm.organization} type="text" class="h-11" />
              </div>
              <div class="space-y-2 md:col-span-2">
                <Label for="language">Language</Label>
                <select
                  id="language"
                  bind:value={profileForm.language}
                  class="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <Button onclick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onclick={handleReset} disabled={isSaving}>
                Reset
              </Button>
              {#if saveSuccess}
                <span class="text-sm text-green-600">{saveSuccess}</span>
              {/if}
              {#if saveError}
                <span class="text-sm text-red-600">{saveError}</span>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Account Overview</Card.Title>
            <Card.Description class="text-sm text-gray-500">Key account details</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p class="text-xs uppercase tracking-wide text-gray-400">Account Type</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{user.organization_name ? "Organizer" : "Attendee"}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p class="text-xs uppercase tracking-wide text-gray-400">User ID</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">#{user.id}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p class="text-xs uppercase tracking-wide text-gray-400">Timezone</p>
              <div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Globe class="h-4 w-4 text-gray-500" />
                <span class="text-sm font-medium">{localTimezone}</span>
              </div>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p class="text-xs uppercase tracking-wide text-gray-400">Status</p>
              <p class="text-sm font-medium text-emerald-600">Active</p>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <!-- Preferences -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Notifications</Card.Title>
            <Card.Description class="text-sm text-gray-500">Control how you receive updates</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 space-y-4">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Email Notifications</Label>
                <p class="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.notifications.email} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Push Notifications</Label>
                <p class="text-xs text-gray-500">Receive browser notifications</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.notifications.push} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p class="text-xs text-gray-500">Receive SMS updates</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.notifications.sms} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Marketing</Label>
                <p class="text-xs text-gray-500">Product updates and offers</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.notifications.marketing} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Privacy</Card.Title>
            <Card.Description class="text-sm text-gray-500">Control profile visibility</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 space-y-4">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p class="text-xs text-gray-500">Make profile visible to others</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.privacy.profileVisible} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Show Email</Label>
                <p class="text-xs text-gray-500">Display email on profile</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.privacy.showEmail} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Show Phone</Label>
                <p class="text-xs text-gray-500">Display phone on profile</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" bind:checked={preferences.privacy.showPhone} class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Password</Card.Title>
            <Card.Description class="text-sm text-gray-500">Update your password</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="space-y-2">
                <Label for="currentPassword">Current</Label>
                <Input id="currentPassword" type="password" bind:value={passwordForm.current} class="h-11" />
              </div>
              <div class="space-y-2">
                <Label for="newPassword">New</Label>
                <Input id="newPassword" type="password" bind:value={passwordForm.next} class="h-11" />
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm</Label>
                <Input id="confirmPassword" type="password" bind:value={passwordForm.confirm} class="h-11" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Button onclick={handleChangePassword} disabled={false}>Change Password</Button>
              {#if passwordSuccess}
                <span class="text-sm text-green-600">{passwordSuccess}</span>
              {/if}
              {#if passwordError}
                <span class="text-sm text-red-600">{passwordError}</span>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Card.Header class="p-0 mb-6">
            <Card.Title class="text-lg">Security</Card.Title>
            <Card.Description class="text-sm text-gray-500">Protect your account</Card.Description>
          </Card.Header>
          <Card.Content class="p-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
              <div class="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Shield class="h-4 w-4" />
                <span class="text-sm font-medium">Two-factor authentication</span>
              </div>
              <p class="mt-2 text-xs text-gray-500">Not enabled</p>
              <Button class="mt-3" size="sm" disabled={true}>Enable</Button>
            </div>
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
              <div class="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <KeyRound class="h-4 w-4" />
                <span class="text-sm font-medium">Password</span>
              </div>
              <p class="mt-2 text-xs text-gray-500">Last updated recently</p>
              <Button class="mt-3" size="sm" disabled={true}>Change</Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    {/if}
  </div>
</div>
