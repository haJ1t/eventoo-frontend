<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import {
    Bell,
    X,
    Check,
    Trash2,
    Clock,
    User,
    Calendar,
    MessageSquare,
    Receipt,
    Sparkles,
    RefreshCcw
  } from 'lucide-svelte';
  import {
    fetchNotifications,
    markNotificationRead,
    deleteNotification,
    markAllNotificationsRead,
    clearAllNotifications,
    type Notification
  } from '$lib/services/api';

  const dispatch = createEventDispatcher();

  // Props
  export let isOpen = false;
  export let unreadCount = 0;
  export let userId: number | null = null;

  let notifications: Notification[] = [];
  let filteredNotifications: Notification[] = [];
  let loading = false;
  let error: string | null = null;
  let activeTab: 'all' | 'unread' = 'all';
  let isMutating = false;

  const iconMap = {
    registration: User,
    update: Calendar,
    payment: Receipt,
    reminder: Clock,
    message: MessageSquare,
    system: Bell
  } as const;

  const colorMap: Record<string, string> = {
    registration: 'bg-blue-50 text-blue-700 ring-blue-100',
    update: 'bg-amber-50 text-amber-700 ring-amber-100',
    payment: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    reminder: 'bg-violet-50 text-violet-700 ring-violet-100',
    message: 'bg-pink-50 text-pink-700 ring-pink-100',
    system: 'bg-gray-50 text-gray-700 ring-gray-100'
  };

  async function loadNotifications({ silent = false } = {}) {
    if (loading) return;
    loading = !silent;
    error = null;
    try {
      const data = await fetchNotifications(userId ?? undefined);
      notifications = data || [];
      updateUnreadCount();
    } catch (err: any) {
      error = err?.message || 'Failed to load notifications.';
    } finally {
      loading = false;
    }
  }

  function updateUnreadCount() {
    unreadCount = notifications.filter(n => !n.read).length;
    dispatch('unreadChange', { count: unreadCount });
  }

  function toggleNotification() {
    isOpen = !isOpen;
    dispatch('toggle', { isOpen });
  }

  function closeNotifications() {
    isOpen = false;
    dispatch('close');
  }

  function getNotificationIcon(type: string) {
    return iconMap[type as keyof typeof iconMap] || Bell;
  }

  function getNotificationColor(type: string) {
    return colorMap[type] || colorMap.system;
  }

  function formatRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.round(diffMs / 60000);

    if (Number.isNaN(diffMinutes)) return '';
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  async function handleMarkRead(notification: Notification) {
    if (notification.read) return;
    isMutating = true;
    try {
      const updated = await markNotificationRead(notification.id, true);
      notifications = notifications.map(n =>
        n.id === updated.id ? updated : n
      );
      updateUnreadCount();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    } finally {
      isMutating = false;
    }
  }

  async function handleDelete(notification: Notification) {
    isMutating = true;
    try {
      await deleteNotification(notification.id);
      notifications = notifications.filter(n => n.id !== notification.id);
      updateUnreadCount();
    } catch (err) {
      console.error('Failed to delete notification', err);
    } finally {
      isMutating = false;
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    isMutating = true;
    try {
      await markAllNotificationsRead(userId ?? undefined);
      notifications = notifications.map(n => ({ ...n, read: true }));
      updateUnreadCount();
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    } finally {
      isMutating = false;
    }
  }

  async function handleClearAll() {
    if (notifications.length === 0) return;
    isMutating = true;
    try {
      await clearAllNotifications(userId ?? undefined);
      notifications = [];
      updateUnreadCount();
    } catch (err) {
      console.error('Failed to clear notifications', err);
    } finally {
      isMutating = false;
    }
  }

  // Initialize
  onMount(() => {
    loadNotifications();
  });

  // Refresh on open
  $: if (isOpen) {
    loadNotifications({ silent: true });
  }

  // Close on Escape
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      closeNotifications();
    }
  }

  $: filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications;
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Notification Bell Button -->
<div class="relative">
  <button
    on:click={toggleNotification}
    class="relative rounded-xl p-2 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
    aria-label="Open notifications"
  >
    <Bell class="h-6 w-6 text-gray-700" />

    {#if unreadCount > 0}
      <span
        class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white shadow"
        in:fly={{ y: -6, duration: 200 }}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    {/if}
  </button>
</div>

<!-- Overlay Backdrop -->
{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
    on:click={closeNotifications}
    in:fade={{ duration: 150 }}
    out:fade={{ duration: 150 }}
  ></div>
{/if}

<!-- Notifications Panel -->
{#if isOpen}
  <div
    class="fixed right-0 top-0 z-[60] flex h-full w-[420px] max-w-[92vw] flex-col border-l border-gray-200 bg-white shadow-2xl"
    in:fly={{ x: 420, duration: 280, opacity: 1 }}
    out:fly={{ x: 420, duration: 240, opacity: 1 }}
  >
    <!-- Header -->
    <div class="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 px-6 pt-6 pb-4">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Sparkles class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
              <p class="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'}
              </p>
            </div>
          </div>
        </div>
        <button
          on:click={closeNotifications}
          class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Tabs + Actions -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex rounded-lg bg-gray-100 p-1 text-xs font-medium text-gray-600">
          <button
            class="rounded-md px-3 py-1.5 transition {activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}"
            on:click={() => (activeTab = 'all')}
          >
            All
          </button>
          <button
            class="rounded-md px-3 py-1.5 transition {activeTab === 'unread' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}"
            on:click={() => (activeTab = 'unread')}
          >
            Unread
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            on:click={() => loadNotifications({ silent: false })}
            disabled={loading}
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCcw class="h-4 w-4 {loading ? 'animate-spin' : ''}" />
          </button>
          <button
            class="text-xs font-medium text-gray-600 transition hover:text-gray-900"
            on:click={handleMarkAllRead}
            disabled={unreadCount === 0 || isMutating}
          >
            Mark all read
          </button>
          <span class="h-4 w-px bg-gray-200"></span>
          <button
            class="text-xs font-medium text-red-600 transition hover:text-red-700"
            on:click={handleClearAll}
            disabled={notifications.length === 0 || isMutating}
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      {#if loading}
        <div class="p-6 space-y-4">
          {#each Array(4) as _, i}
            <div class="h-20 rounded-xl bg-gray-100 animate-pulse"></div>
          {/each}
        </div>
      {:else if error}
        <div class="p-6 text-sm text-red-600">
          {error}
        </div>
      {:else if filteredNotifications.length === 0}
        <div class="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
          <Bell class="h-10 w-10 opacity-50" />
          <p class="text-sm font-medium">No notifications</p>
          <p class="text-xs text-gray-400">We’ll let you know when something arrives.</p>
        </div>
      {:else}
        <div class="divide-y divide-gray-100">
          {#each filteredNotifications as notification (notification.id)}
            <div
              class="group relative px-6 py-4 transition hover:bg-gray-50"
            >
              {#if !notification.read}
                <span class="absolute left-0 top-0 h-full w-1 bg-primary"></span>
              {/if}
              <div class="flex items-start gap-3">
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 {getNotificationColor(notification.type)}"
                >
                  <svelte:component
                    this={getNotificationIcon(notification.type)}
                    class="h-5 w-5"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <span class="text-xs text-gray-400">
                        {formatRelativeTime(notification.created_at)}
                      </span>
                      <div class="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        {#if !notification.read}
                          <button
                            class="rounded-md p-1 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Mark as read"
                            on:click={() => handleMarkRead(notification)}
                            disabled={isMutating}
                          >
                            <Check class="h-4 w-4" />
                          </button>
                        {/if}
                        <button
                          class="rounded-md p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                          on:click={() => handleDelete(notification)}
                          disabled={isMutating}
                        >
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-100 bg-white px-6 py-4">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>Synced with server</span>
        <button
          class="text-xs font-medium text-primary hover:text-primary/80"
          on:click={() => loadNotifications({ silent: false })}
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
