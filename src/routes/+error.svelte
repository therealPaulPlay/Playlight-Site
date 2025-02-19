<script>
	import { page } from "$app/state";
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<div class="w-full h-full flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-9xl font-bold text-center mb-2">{page.status}</h1>
	<h3 class="text-lg text-center">{page.error.message}</h3>
</div>