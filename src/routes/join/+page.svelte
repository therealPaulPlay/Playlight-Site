<script>
	import { blur } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Loader2, Rocket } from "lucide-svelte";
	import { enhance } from "$app/forms";

	let isSubmitting = $state(false);
	let formData = $state({
		email: "",
		website: "",
		message: "",
	});

	// Basic form validation
	let isValid = $derived(formData.email && formData.website && formData.message);

	// Form submission handler
	async function handleSubmit(event) {
		if (!isValid) return;
		event.preventDefault();

		isSubmitting = true;

		// You can add your form submission logic here
		// Example:
		// await fetch('/api/submit', {
		//   method: 'POST',
		//   body: JSON.stringify(formData)
		// });

		// Simulate submission delay
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isSubmitting = false;
	}
</script>

<svelte:head>
	<title>Join Playlight</title>
</svelte:head>

<main class="flex min-h-screen w-full items-center justify-center px-4 py-16">
	<div in:blur={{ duration: 400 }} class="w-full max-w-xl">
		<Card class="border-2">
			<CardHeader>
				<CardTitle class="text-3xl font-bold uppercase">Join Playlight.</CardTitle>
				<CardDescription>
					Take the first step towards better game discovery. Fill out the form below and we'll get back to you shortly.
					Let's connect!
				</CardDescription>
			</CardHeader>

			<form onsubmit={handleSubmit}>
				<CardContent class="space-y-6">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" placeholder="you@yourstudio.com" bind:value={formData.email} required />
					</div>

					<div class="space-y-2">
						<Label for="website">Game Website</Label>
						<Input type="url" id="website" placeholder="https://yourgame.com" bind:value={formData.website} required />
					</div>

					<div class="space-y-2">
						<Label for="message">Tell us about your game</Label>
						<Textarea
							id="message"
							placeholder="What makes your browser game special?"
							class="min-h-[120px]"
							bind:value={formData.message}
							required
						/>
					</div>
				</CardContent>

				<CardFooter>
					<Button type="submit" class="w-full" disabled={!isValid || isSubmitting} style="cursor: pointer">
						{#if isSubmitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Sending...
						{:else}
							Submit<Rocket />
						{/if}
					</Button>
				</CardFooter>
			</form>
		</Card>

		<p class="text-muted-foreground mt-4 text-center text-sm">
			By submitting this form, you agree to our TOS and Privacy Policy.
		</p>
	</div>
</main>
