<script lang="ts">
    import { cn } from "$lib/utils";
  
    let className: string | undefined = undefined;
    export { className as class };
    export let value: string = '';
    export let placeholder: string = '';
    export let rows: number = 3;
    export let disabled: boolean = false;
    export let readonly: boolean = false;
    export let required: boolean = false;
    export let name: string = '';
    export let id: string = '';
  
    $: classes = cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    );
  </script>
  
  <textarea
    bind:value
    {placeholder}
    {rows}
    {disabled}
    {readonly}
    {required}
    {name}
    {id}
    class={classes}
    {...$$restProps}
    on:blur
    on:change
    on:click
    on:focus
    on:input
    on:keydown
    on:keypress
    on:keyup
    on:mouseenter
    on:mouseleave
    on:mouseover
    on:paste
  ></textarea>
  