<script lang="ts">
    import * as Pagination from "$lib/components/ui/pagination/index.js";
</script>

<Pagination.Root class="flex justify-center" count={100} perPage={10}>
    {#snippet children({ pages, currentPage })}
        <Pagination.Content class="flex items-center gap-2">
        <Pagination.Item>
        <Pagination.PrevButton class="px-2 py-1" children={null}/>
        </Pagination.Item>
        {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
        <Pagination.Item>
            <Pagination.Ellipsis class="px-2 py-1" />
        </Pagination.Item>
        {:else}
        <Pagination.Item>
            <Pagination.Link class="px-2 py-1" {page} isActive={currentPage === page.value}>
            {page.value}
            </Pagination.Link>
        </Pagination.Item>
        {/if}
        {/each}
        <Pagination.Item>
        <Pagination.NextButton class="" children={null}/>
        </Pagination.Item>
        </Pagination.Content>
    {/snippet}
</Pagination.Root>