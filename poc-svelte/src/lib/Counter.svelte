<script lang="ts">
  // Svelte is a COMPILER, not a runtime framework. The .svelte file is compiled
  // at build time into surgical DOM updates — no virtual DOM, no diffing.
  //
  // Svelte 5 introduced "RUNES" — explicit reactive primitives that work the
  // same way inside .svelte files AND in plain .ts modules.
  //
  //   $state(initial)   — reactive state (replaces `let x = 0`)
  //   $derived(expr)    — computed from other state (replaces `$:`)
  //   $effect(fn)       — runs when its dependencies change
  //   $props()          — declare component props

  // $state turns a normal variable into reactive state.
  // Reads and writes look exactly like a regular let — no setter function.
  let count = $state(0);

  // $derived auto-tracks which $state values it reads.
  // Recomputes only when those values change.
  const doubled = $derived(count * 2);

  // $effect runs after each render where its dependencies changed.
  $effect(() => {
    console.log(`count is now ${count}`);
  });
</script>

<section style="margin-bottom: 2rem;">
  <h2>Runes ($state, $derived, $effect)</h2>
  <p>Count: <strong>{count}</strong> · Doubled: <strong>{doubled}</strong></p>
  <!-- onclick directive — handlers are written inline -->
  <button onclick={() => count += 1}>+1</button>
  <button onclick={() => count -= 1}>−1</button>
</section>
