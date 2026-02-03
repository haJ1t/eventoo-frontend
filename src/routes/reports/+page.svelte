<script lang="ts">
    import {
        BarChart3,
        TrendingUp,
        Users,
        Calendar,
        DollarSign,
        ArrowUpRight,
        ArrowDownRight,
        PieChart,
        Activity,
        Download,
        ArrowLeft,
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { fade } from "svelte/transition";
    import { goBack } from "$lib/utils/navigation";
    import { onMount } from "svelte";
    import { fetchReportsAnalytics, type ReportsAnalytics } from "$lib/services/api";

    type Metric = {
        label: string;
        value: string;
        change: string;
        trend: "up" | "down";
        icon: typeof DollarSign;
        color: string;
    };

    let metrics = $state<Metric[]>([]);
    let monthlyRevenue = $state<number[]>([]);
    let topCategories = $state<
        { name: string; count: number; percent: number; color: string }[]
    >([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    const categoryColors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-amber-500",
        "bg-emerald-500",
    ];

    function formatCurrency(value: number) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value || 0);
    }

    function formatNumber(value: number) {
        return new Intl.NumberFormat("en-US").format(value || 0);
    }

    function formatPercent(value: number) {
        const sign = value >= 0 ? "+" : "";
        return `${sign}${value.toFixed(1)}%`;
    }

    function buildMetrics(data: ReportsAnalytics) {
        return [
            {
                label: "Total Revenue",
                value: formatCurrency(data.metrics.total_revenue.value),
                change: formatPercent(data.metrics.total_revenue.change),
                trend: data.metrics.total_revenue.change >= 0 ? "up" : "down",
                icon: DollarSign,
                color: "text-green-600 bg-green-50",
            },
            {
                label: "Active Users",
                value: formatNumber(data.metrics.active_users.value),
                change: formatPercent(data.metrics.active_users.change),
                trend: data.metrics.active_users.change >= 0 ? "up" : "down",
                icon: Users,
                color: "text-blue-600 bg-blue-50",
            },
            {
                label: "Events Hosted",
                value: formatNumber(data.metrics.events_hosted.value),
                change: formatPercent(data.metrics.events_hosted.change),
                trend: data.metrics.events_hosted.change >= 0 ? "up" : "down",
                icon: Calendar,
                color: "text-purple-600 bg-purple-50",
            },
            {
                label: "Avg. Engagement",
                value: `${data.metrics.avg_engagement.value.toFixed(1)}%`,
                change: formatPercent(data.metrics.avg_engagement.change),
                trend: data.metrics.avg_engagement.change >= 0 ? "up" : "down",
                icon: Activity,
                color: "text-amber-600 bg-amber-50",
            },
        ];
    }

    onMount(async () => {
        try {
            const data = await fetchReportsAnalytics();
            metrics = buildMetrics(data);
            monthlyRevenue = data.monthly_revenue || [];
            topCategories = (data.top_categories || []).map((cat, index) => ({
                ...cat,
                color: categoryColors[index % categoryColors.length],
            }));
        } catch (err: any) {
            console.error("Failed to load reports:", err);
            error = err.message || "Failed to load reports.";
        } finally {
            loading = false;
        }
    });

    // Helper to get max value for chart scaling
    const maxRevenue = $derived.by(() =>
        Math.max(...(monthlyRevenue.length ? monthlyRevenue : [0])),
    );
</script>

<svelte:head><title>System Reports - Evento</title></svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 page-pad">
    <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div
            class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => goBack("/home")}
                    class="h-9 w-9 p-0"
                    disabled={false}
                >
                    <ArrowLeft class="w-4 h-4" />
                </Button>
                <div class="flex items-start gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
                    >
                        <BarChart3 class="h-5 w-5" />
                    </div>
                    <div>
                        <h1
                            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
                        >
                            Reports & Analytics
                        </h1>
                        <p class="mt-1 text-gray-500 dark:text-gray-400">
                            Insights into platform performance and user
                            engagement
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex gap-3">
                <Button variant="outline" class="bg-white" disabled={false}>
                    <Calendar class="mr-2 h-4 w-4" /> Last 30 Days
                </Button>
                <Button disabled={false}>
                    <Download class="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>
        </div>

        <!-- Key Metrics Grid -->
        <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {#if loading}
                {#each Array(4) as _}
                    <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 animate-pulse h-28"></div>
                {/each}
            {:else if error}
                <div class="col-span-full rounded-xl bg-white p-6 text-sm text-red-600 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                    {error}
                </div>
            {:else}
            {#each metrics as metric}
                <div
                    class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">
                                {metric.label}
                            </p>
                            <h3
                                class="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100"
                            >
                                {metric.value}
                            </h3>
                        </div>
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl {metric.color}"
                        >
                            <svelte:component
                                this={metric.icon}
                                class="h-6 w-6"
                            />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-1 text-sm">
                        {#if metric.trend === "up"}
                            <span
                                class="flex items-center font-medium text-emerald-600"
                            >
                                <ArrowUpRight class="mr-1 h-4 w-4" />
                                {metric.change}
                            </span>
                        {:else}
                            <span
                                class="flex items-center font-medium text-rose-600"
                            >
                                <ArrowDownRight class="mr-1 h-4 w-4" />
                                {metric.change}
                            </span>
                        {/if}
                        <span class="text-gray-500">vs last month</span>
                    </div>
                </div>
            {/each}
            {/if}
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Revenue Chart (CSS only) -->
            <div
                class="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
            >
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h3
                            class="text-lg font-bold text-gray-900 dark:text-white"
                        >
                            Revenue Overview
                        </h3>
                        <p class="text-sm text-gray-500">
                            Monthly revenue for the current year
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-gray-500"
                        >View Details</Button
                    >
                </div>

                <!-- Simple Bar Chart -->
                <div class="flex h-64 items-end justify-between gap-2 pt-4">
                    {#each monthlyRevenue as value, i}
                        <div
                            class="group relative flex w-full flex-col justify-end gap-2 h-full"
                        >
                            <!-- Tooltip -->
                            <div
                                class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity"
                            >
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0)}
                            </div>
                            <!-- Bar -->
                            <div
                                style="height: {maxRevenue === 0 ? 0 : (value / maxRevenue) * 100}%"
                                class="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                            ></div>
                            <!-- Label -->
                            <div class="text-center text-xs text-gray-400">
                                {[
                                    "J",
                                    "F",
                                    "M",
                                    "A",
                                    "M",
                                    "J",
                                    "J",
                                    "A",
                                    "S",
                                    "O",
                                    "N",
                                    "D",
                                ][i]}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Categories Distribution -->
            <div
                class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
            >
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                        Top Categories
                    </h3>
                    <p class="text-sm text-gray-500">
                        Event distribution by type
                    </p>
                </div>

                <div class="space-y-6">
                    {#if topCategories.length === 0}
                        <p class="text-sm text-gray-500">No category data yet.</p>
                    {:else}
                    {#each topCategories as cat}
                        <div>
                            <div class="mb-2 flex justify-between text-sm">
                                <span
                                    class="font-medium text-gray-700 dark:text-gray-300"
                                    >{cat.name}</span
                                >
                                <span class="text-gray-500">{cat.percent}%</span
                                >
                            </div>
                            <div
                                class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                            >
                                <div
                                    class="h-full rounded-full {cat.color}"
                                    style="width: {cat.percent}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                    {/if}
                </div>

                <div
                    class="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 text-center"
                >
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Want more detailed insights?
                    </p>
                    <Button
                        variant="outline"
                        class="w-full border-primary/20 text-primary hover:bg-primary/5"
                    >
                        Upgrade Plan
                    </Button>
                </div>
            </div>
        </div>
    </div>
</div>
