<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent } from "$lib/components/ui/card";
    import { FileX } from "lucide-svelte";
    
    export let title: string;
    export let description: string;
    export let actionText: string = '';
    export let actionHref: string = '';
  </script>
  
  <Card class="border-dashed">
    <CardContent class="flex flex-col items-center justify-center py-12 text-center">
      <FileX class="h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">{title}</h3>
      <p class="text-muted-foreground mb-6 max-w-sm">{description}</p>
      
      {#if actionText && actionHref}
        <Button variant="default" href={actionHref} class="" disabled={false}>
          {actionText}
        </Button>
      {/if}
      
      {#if actionText && !actionHref}
        <Button class="" disabled={false}>
          {actionText}
        </Button>
      {/if}
    </CardContent>
  </Card>
  