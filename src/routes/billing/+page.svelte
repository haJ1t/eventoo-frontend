<script lang="ts">
  import { CreditCard, FileText, BadgeCheck, Sparkles } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
</script>

<svelte:head>
  <title>Billing - Evento</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 page-pad">
  <div class="w-full max-w-6xl space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <CreditCard class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Billing</h1>
          <p class="mt-1 text-gray-500 dark:text-gray-400">Manage your plan and invoices</p>
        </div>
      </div>
      <Button class="bg-primary text-primary-foreground hover:bg-primary/90" disabled={true}>Upgrade</Button>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Card.Header class="p-0 mb-6">
          <Card.Title class="text-lg">Current Plan</Card.Title>
          <Card.Description class="text-sm text-gray-500">Your subscription</Card.Description>
        </Card.Header>
        <Card.Content class="p-0 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BadgeCheck class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Plan</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">Starter</p>
            </div>
          </div>
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs uppercase tracking-wide text-gray-400">Renewal</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Next billing date: --</p>
          </div>
          <Button size="sm" variant="outline" disabled={true}>Manage Plan</Button>
        </Card.Content>
      </Card.Root>

      <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Card.Header class="p-0 mb-6">
          <Card.Title class="text-lg">Payment Method</Card.Title>
          <Card.Description class="text-sm text-gray-500">Default card</Card.Description>
        </Card.Header>
        <Card.Content class="p-0 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Card</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">No card on file</p>
            </div>
          </div>
          <Button size="sm" variant="outline" disabled={true}>Add Payment Method</Button>
        </Card.Content>
      </Card.Root>

      <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Card.Header class="p-0 mb-6">
          <Card.Title class="text-lg">Usage</Card.Title>
          <Card.Description class="text-sm text-gray-500">Current cycle</Card.Description>
        </Card.Header>
        <Card.Content class="p-0 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Events</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">-- / month</p>
            </div>
          </div>
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs uppercase tracking-wide text-gray-400">Status</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Within limits</p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>

    <Card.Root class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Card.Header class="p-0 mb-6">
        <Card.Title class="text-lg">Invoices</Card.Title>
        <Card.Description class="text-sm text-gray-500">Recent billing history</Card.Description>
      </Card.Header>
      <Card.Content class="p-0">
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>No invoices yet.</span>
          <Button size="sm" variant="outline" disabled={true}>
            <FileText class="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
