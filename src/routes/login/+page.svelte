<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { goto } from "$app/navigation";
	import { username } from "$lib/stores/accountStore";
	import { checkAuthenticationStatus } from "$lib/utils/checkAuthentication";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { TriangleAlert } from "lucide-svelte";

	let currentView = $state("login");
	let loading = $state(false);
	let acceptedTerms = $state(false);

	let email = $state("");
	let password = $state("");
	let userName = $state("");

	function resetForm() {
		email = "";
		password = "";
		userName = "";
		acceptedTerms = false;
		loading = false;
	}

	$effect(() => {
		if ($page.url.searchParams.get("token")) currentView = "set-new-password";
		if ($page.url.searchParams.get("reset")) currentView = "reset";
		if ($page.url.searchParams.get("signup")) currentView = "signup";
	});

	async function handleSubmit(event) {
		event.preventDefault();
		if (loading) return;

		if (currentView === "signup" && !acceptedTerms) {
			toast.error("Please accept the terms and privacy policy.");
			return;
		}

		loading = true;

		try {
			switch (currentView) {
				case "login": {
					const response = await fetchWithErrorHandling(`${$BASE_API_URL}/account/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					const data = await response.json();
					localStorage.setItem("bearer", data.bearerToken);
					localStorage.setItem("id", data.id);
					username.set(data.userName);
					checkAuthenticationStatus();
					toast.success("Successfully logged in!");
					goto("/dashboard");
					break;
				}

				case "signup": {
					await fetchWithErrorHandling(`${$BASE_API_URL}/account/register`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userName, email, password }),
					});
					toast.success("Registered successfully! Please log in.");
					currentView = "login";
					break;
				}

				case "reset": {
					await fetchWithErrorHandling(`${$BASE_API_URL}/account/reset-password-request`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email }),
					});
					toast.success("Reset instructions sent to your email!");
					currentView = "login";
					break;
				}

				case "set-new-password": {
					const token = $page.url.searchParams.get("token");
					await fetchWithErrorHandling(`${$BASE_API_URL}/account/reset-password`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ token, newPassword: password }),
					});
					toast.success("Password updated successfully!");
					currentView = "login";
					break;
				}
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="flex min-h-[90vh] items-center justify-center p-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>
				{#if currentView === "login"}
					Log in
				{:else if currentView === "signup"}
					Create an account
				{:else if currentView === "reset"}
					Reset password
				{:else}
					Set new password
				{/if}
			</CardTitle>
		</CardHeader>

		<form onsubmit={handleSubmit}>
			<CardContent class="min-w-80 space-y-4">
				{#if currentView === "signup"}
					<div class="bg-muted p-4">
						<p>
							<TriangleAlert class="mb-2" /> This signup form is for developers already participating in Playlight. If you
							haven't joined yet, please <a class="hover:underline" href="/join">apply first</a>.
						</p>
					</div>
					<div class="space-y-2">
						<Label for="userName">Full Name</Label>
						<Input
							type="text"
							id="userName"
							bind:value={userName}
							required
							disabled={loading}
							maxlength={50}
							minlength={3}
						/>
					</div>
				{/if}

				{#if currentView !== "set-new-password"}
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" bind:value={email} required disabled={loading} maxlength={100} />
					</div>
				{/if}

				{#if currentView === "login" || currentView === "signup" || currentView === "set-new-password"}
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input type="password" id="password" bind:value={password} required disabled={loading} minlength="8" />
					</div>
				{/if}

				{#if currentView === "signup"}
					<div class="flex items-center space-x-2">
						<Checkbox id="terms" bind:checked={acceptedTerms} disabled={loading} />
						<Label for="terms" class="text-sm">
							I agree to the <a href="/terms" class="text-primary hover:underline">Terms</a> and
							<a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>
						</Label>
					</div>
				{/if}
			</CardContent>

			<CardFooter class="flex flex-col space-y-4">
				<Button type="submit" class="w-full cursor-pointer" disabled={loading}>
					{#if loading}
						Please wait...
					{:else if currentView === "login"}
						Log in
					{:else if currentView === "signup"}
						Sign up
					{:else if currentView === "reset"}
						Send reset link
					{:else}
						Update password
					{/if}
				</Button>

				{#if currentView === "login"}
					<div class="flex flex-col items-center gap-2 text-sm">
						<button
							type="button"
							class="text-muted-foreground hover:text-primary cursor-pointer"
							onclick={() => {
								resetForm();
								currentView = "reset";
							}}
						>
							Forgot password?
						</button>
						<button
							type="button"
							class="text-muted-foreground hover:text-primary cursor-pointer"
							onclick={() => {
								resetForm();
								currentView = "signup";
							}}
						>
							Don't have an account?
						</button>
					</div>
				{:else if currentView !== "set-new-password"}
					<button
						type="button"
						class="text-muted-foreground hover:text-primary cursor-pointer text-sm"
						onclick={() => {
							resetForm();
							currentView = "login";
						}}
					>
						Back to login
					</button>
				{/if}
			</CardFooter>
		</form>
	</Card>
</div>
