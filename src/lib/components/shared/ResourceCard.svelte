<script lang="ts">
  import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    MapPin,
    Calendar,
    Users,
    ArrowRight,
  } from "lucide-svelte";

  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Card } from "$lib/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";

  // Props
  export let image: string;
  export let title: string;
  export let status: string | undefined = undefined;
  export let subtitle: string | undefined = undefined; // e.g. Location
  export let description: string | undefined = undefined;
  export let price: string | number | undefined = undefined; // displayed in footer
  export let type: string | undefined = undefined; // Badge in footer

  // Stats array: { icon: Component, value: string|number, label?: string }
  export let stats: Array<{
    icon: any;
    value: string | number;
    label?: string;
    color?: string;
  }> = [];

  // Actions
  export let onView: () => void;
  export let onEdit: (() => void) | undefined = undefined;
  export let onDelete: (() => void) | undefined = undefined;

  function getStatusColor(s: string) {
    if (!s) return "bg-gray-100 text-gray-800";
    const lower = s.toLowerCase();
    if (lower === "active" || lower === "scheduled" || lower === "confirmed")
      return "bg-green-100 text-green-700 border-green-200";
    if (lower === "inactive" || lower === "cancelled")
      return "bg-red-100 text-red-700 border-red-200";
    if (lower === "planning" || lower === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
</script>

<Card
  class="group relative flex flex-col h-full overflow-hidden border border-gray-100 bg-white dark:bg-gray-900 duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 rounded-2xl"
>
  <!-- Image Section -->
  <div class="relative aspect-video w-full overflow-hidden">
    <button
      type="button"
      class="h-full w-full cursor-pointer bg-gray-100 dark:bg-gray-800"
      onclick={onView}
    >
      <img
        src={image || "/api/placeholder/600/300"}
        alt={title}
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </button>

    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"
    ></div>

    <!-- Status Badge -->
    {#if status}
      <div class="absolute left-4 top-4">
        <Badge
          class="{getStatusColor(status)} shadow-sm backdrop-blur-md"
          variant="secondary"
          href={undefined}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    {/if}

    <!-- Actions Menu -->
    <div
      class="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="secondary"
            size="sm"
            disabled={false}
            class="h-8 w-8 rounded-full bg-white/90 p-0 shadow-sm backdrop-blur-md hover:bg-white"
          >
            <MoreHorizontal class="h-4 w-4 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48" portalProps={undefined}>
          <DropdownMenuItem
            onclick={onView}
            class="cursor-pointer"
            inset={undefined}
          >
            <Eye class="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {#if onEdit}
            <DropdownMenuItem
              onclick={onEdit}
              class="cursor-pointer"
              inset={undefined}
            >
              <Edit class="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          {/if}
          {#if onDelete}
            <DropdownMenuSeparator class="" />
            <DropdownMenuItem
              onclick={onDelete}
              class="cursor-pointer text-red-600 focus:text-red-600"
              inset={undefined}
            >
              <Trash2 class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          {/if}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Category Badge (Bottom Left of Image) -->
    {#if type}
      <div class="absolute bottom-4 left-4">
        <Badge
          variant="secondary"
          class="bg-white/90 text-gray-900 backdrop-blur-md hover:bg-white"
          href={undefined}
        >
          {type}
        </Badge>
      </div>
    {/if}
  </div>

  <!-- Content Section -->
  <div class="flex flex-1 flex-col p-5">
    <div class="mb-4">
      <div class="mb-2 flex items-start justify-between gap-2">
        <h3
          class="line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-primary dark:text-gray-100"
        >
          <button type="button" onclick={onView} class="text-left">
            {title}
          </button>
        </h3>
      </div>

      {#if subtitle}
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          <span class="line-clamp-1">{subtitle}</span>
        </div>
      {/if}
    </div>

    <!-- Stats Grid -->
    {#if stats.length > 0}
      <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
        {#each stats.slice(0, 2) as stat}
          <div
            class="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-800"
            title={stat.label}
          >
            <svelte:component
              this={stat.icon}
              class="h-4 w-4 {stat.color || 'text-primary'}"
            />
            <span class="truncate font-medium text-gray-700 dark:text-gray-300"
              >{stat.value}</span
            >
          </div>
        {/each}
      </div>
    {/if}

    <!-- Description -->
    {#if description}
      <p
        class="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
      >
        {description}
      </p>
    {:else}
      <div class="mb-6 flex-1"></div>
    {/if}

    <!-- Footer Actions -->
    <div
      class="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800"
    >
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Starting from</span>
        <span class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {#if price}
            {typeof price === "number"
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(price)
              : price}
          {:else}
            Free
          {/if}
        </span>
      </div>

      <Button
        onclick={onView}
        size="sm"
        disabled={false}
        class="group/btn gap-2 rounded-full font-semibold"
      >
        View Full Event
        <ArrowRight
          class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      </Button>
    </div>
  </div>
</Card>
