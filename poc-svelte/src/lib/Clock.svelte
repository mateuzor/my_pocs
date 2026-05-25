<script lang="ts">
  // $effect can return a cleanup function — runs when the effect re-runs
  // or when the component unmounts.
  let now = $state(new Date());

  $effect(() => {
    const id = setInterval(() => (now = new Date()), 1000);
    // return cleanup, same pattern as React's useEffect
    return () => clearInterval(id);
  });
</script>

<section style="margin-top: 2rem;">
  <h2>Effect cleanup</h2>
  <p style="font-variant-numeric: tabular-nums;">
    Current time: <strong>{now.toLocaleTimeString()}</strong>
  </p>
  <p style="color: #555; font-size: 0.9rem;">
    The returned function from $effect clears the interval on unmount.
  </p>
</section>
