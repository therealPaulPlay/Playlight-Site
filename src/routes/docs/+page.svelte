<script>
	import { Button } from "$lib/components/ui/button";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Copy, Check, Code2, Sliders, Rocket, ExternalLink } from "lucide-svelte";
	import { onMount } from "svelte";
	import Prism from "prismjs";
	import "prism-themes/themes/prism-vsc-dark-plus.css";
	import "prismjs/components/prism-markup";
	import "prismjs/components/prism-javascript";

	// Code examples stored as arrays of lines to avoid template parsing issues
	const esModuleExampleLines = [
		"<!-- ES Module Import (Modern) -->",
		`<link rel="stylesheet" href="https://sdk.playlight.dev/playlight-sdk.css">`,
		'<script type="module">',
		"  try {",
		'    const module = await import("https://sdk.playlight.dev/playlight-sdk.es.js");',
		"    const playlightSDK = module.default;",
		"    await playlightSDK.init();",
		"  } catch (error) {",
		'    console.error("Error loading the Playlight SDK:", error);',
		"  }",
		"<\/script>",
	];

	const iifeExampleLines = [
		"<!-- IIFE Import (Legacy) -->",
		'<link rel="stylesheet" href="https://sdk.playlight.dev/playlight-sdk.css">',
		'<script src="https://sdk.playlight.dev/playlight-sdk.iife.js"><\/script>',
		"<script>",
		"  try {",
		"    window.playlightSDK.init();",
		"  } catch (error) {",
		"    console.error('Error initializing the Playlight SDK:', error);",
		"  }",
		"<\/script>",
	];

	const configExampleLines = [
		"<script>",
		"  // ...After loading the SDK and CSS",
		"  await playlightSDK.init({",
		"    button: {",
		"      position: 'bottom-right',",
		"      visible: true",
		"    },",
		"    exitIntent: {",
		"      enabled: true",
		"    }",
		"  });",
		"<\/script>",
	];

	// Function to copy code to clipboard
	function copyCode(event) {
		const button = event.currentTarget;
		const codeBlock = button.closest(".code-block");
		const code = codeBlock.querySelector("pre").textContent;

		navigator.clipboard.writeText(code);

		const checkIcon = button.querySelector(".check-icon");
		const copyIcon = button.querySelector(".copy-icon");

		checkIcon.classList.remove("hidden");
		copyIcon.classList.add("hidden");

		setTimeout(() => {
			checkIcon.classList.add("hidden");
			copyIcon.classList.remove("hidden");
		}, 2000);
	}

	// Apply syntax highlighting
	onMount(() => {
		// Get all code blocks and add appropriate class
		document.querySelectorAll("pre").forEach((pre) => {
			// Add language class
			pre.classList.add("language-markup");

			// Wrap content in code tag if not already
			if (!pre.querySelector("code")) {
				const code = document.createElement("code");
				code.classList.add("language-markup");
				code.innerHTML = pre.innerHTML;
				pre.innerHTML = "";
				pre.appendChild(code);
			}
		});

		// Trigger Prism highlighting
		Prism.highlightAll();
	});
</script>

<svelte:head>
	<title>Documentation</title>
</svelte:head>

<main class="flex min-h-screen w-full flex-col">
	<!-- Hero Section -->
	<section
		class="from-background to-muted/50 relative flex min-h-52 w-full items-center overflow-hidden bg-gradient-to-br px-6 py-10 text-center"
	>
		<div class="mx-auto max-w-2xl">
			<h1 class="mb-4 text-3xl font-bold md:text-4xl">SDK Documentation</h1>
		</div>
	</section>

	<!-- Main Content -->
	<div class="container max-w-4xl px-4 py-8">
		<!-- Getting Started -->
		<section class="mb-12">
			<div class="mb-4 flex items-center gap-2">
				<Rocket class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Getting started</h2>
			</div>
			<p class="text-muted-foreground mb-6">
				Integrating Playlight into your game is simple. Just include the SDK script and initialize it with your
				configuration.
			</p>

			<!-- Quick Start Card -->
			<Card>
				<CardHeader>
					<CardTitle>Quick start</CardTitle>
					<CardDescription>Choose your preferred method to add Playlight to your project.</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value="esmodule" class="mb-6">
						<TabsList class="mb-6">
							<TabsTrigger value="esmodule">ES Module (Modern)</TabsTrigger>
							<TabsTrigger value="iife">IIFE (Legacy)</TabsTrigger>
						</TabsList>

						<TabsContent value="esmodule">
							<div class="code-block bg-muted relative overflow-hidden rounded-md">
								<button class="absolute top-2 right-2 cursor-pointer rounded-md p-1" onclick={copyCode}>
									<Copy class="copy-icon text-muted-foreground hover:text-foreground h-4 w-4" />
									<Check class="check-icon hidden h-4 w-4 text-green-500" />
								</button>
								<pre class="overflow-x-auto p-4 text-sm">{esModuleExampleLines.join("\n")}</pre>
							</div>
							<div class="mt-4">
								<p class="text-muted-foreground text-sm">
									The modern ES module approach is recommended for new projects and frameworks. This method supports
									tree-shaking and more efficient bundling.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="iife">
							<div class="code-block bg-muted relative overflow-hidden rounded-md">
								<button class="absolute top-2 right-2 cursor-pointer rounded-md p-1" onclick={copyCode}>
									<Copy class="copy-icon text-muted-foreground hover:text-foreground h-4 w-4" />
									<Check class="check-icon hidden h-4 w-4 text-green-500" />
								</button>
								<pre class="overflow-x-auto p-4 text-sm">{iifeExampleLines.join("\n")}</pre>
							</div>
							<div class="mt-4">
								<p class="text-muted-foreground text-sm">
									The IIFE approach works well for legacy projects or when broader browser compatibility is needed.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
			<div class="bg-muted text-muted-foreground mb-8 p-4">
				<p>Congrats! This is all you need to integrate Playlight with its default settings.</p>
			</div>
		</section>

		<!-- Configuration Options -->
		<section class="mb-12">
			<div class="mb-4 flex items-center gap-2">
				<Sliders class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Configuration</h2>
			</div>
			<p class="text-muted-foreground mb-6">Customize the behavior and appearance of the Playlight integration.</p>

			<Tabs value="configuration" class="mb-8">
				<TabsList class="mb-6">
					<TabsTrigger value="configuration">Object</TabsTrigger>
					<TabsTrigger value="button">Button</TabsTrigger>
					<TabsTrigger value="exitIntent">Exit Intent</TabsTrigger>
				</TabsList>

				<TabsContent value="configuration">
					<Card>
						<CardHeader>
							<CardTitle>Configuration object</CardTitle>
							<CardDescription>The SDK can be initialized with an optional configuration object.</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="code-block bg-muted relative overflow-hidden rounded-md">
								<button class="absolute top-2 right-2 cursor-pointer rounded-md p-1" onclick={copyCode}>
									<Copy class="copy-icon text-muted-foreground hover:text-foreground h-4 w-4" />
									<Check class="check-icon hidden h-4 w-4 text-green-500" />
								</button>
								<pre class="overflow-x-auto p-4 text-sm">{configExampleLines.join("\n")}</pre>
							</div>

							<div class="mt-6 space-y-3">
								<div class="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
									<h4 class="mb-1 text-sm font-medium">Note</h4>
									<p class="text-muted-foreground text-sm">
										Make sure to call <code class="text-primary">init()</code> after the script is loaded. When using
										<code class="text-primary">async</code>, you may need to add an event listener to ensure the SDK is
										ready.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="button">
					<Card>
						<CardHeader>
							<CardTitle>Button options</CardTitle>
							<CardDescription>Configure the position and visibility of the Playlight button.</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								<div class="grid gap-2">
									<h4 class="text-sm font-medium">position</h4>
									<p class="text-muted-foreground text-sm">
										Controls the position of the Playlight button. Options are <code class="text-primary"
											>bottom-right</code
										>
										(default) or
										<code class="text-primary">bottom-left</code>.
									</p>
								</div>

								<div class="grid gap-2">
									<h4 class="text-sm font-medium">visible</h4>
									<p class="text-muted-foreground text-sm">
										Controls whether the button is visible. Default is <code class="text-primary">true</code>. Set to
										<code class="text-primary">false</code> if you want to trigger the discovery UI programmatically.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="exitIntent">
					<Card>
						<CardHeader>
							<CardTitle>Exit intent</CardTitle>
							<CardDescription>
								Configure the exit intent feature, which shows the discovery UI when users are about to leave.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								<div class="grid gap-2">
									<h4 class="text-sm font-medium">enabled</h4>
									<p class="text-muted-foreground text-sm">
										Controls whether the discovery UI opens automatically when users move their mouse towards the
										browser toolbar (indicating they might leave). Default is <code class="text-primary">true</code>.
									</p>
								</div>

								<div class="mt-4 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
									<h4 class="mb-1 text-sm font-medium">Note</h4>
									<p class="text-muted-foreground text-sm">
										The exit intent setting in the config will override any settings changed in the discovery UI itself.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</section>

		<!-- API Reference -->
		<section class="mb-12">
			<div class="mb-4 flex items-center gap-2">
				<Code2 class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">API reference</h2>
			</div>
			<p class="text-muted-foreground mb-6">Control the Playlight discovery UI programmatically with these methods.</p>

			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Methods</CardTitle>
					<CardDescription>Available methods to control the Playlight discovery UI.</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-6">
						<div>
							<h3 class="mb-2 text-lg font-semibold">init(config?)</h3>
							<p class="text-muted-foreground mb-2">Initializes the Playlight SDK with the provided configuration.</p>
							<Card>
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">config</code> - Configuration
										object
									</p>
								</CardContent>
							</Card>
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold">setDiscovery(visible?)</h3>
							<p class="text-muted-foreground mb-2">Programmatically show or hide the discovery UI.</p>
							<Card>
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">visible</code> - Boolean to show or hide the discovery UI (defaults to true)
									</p>
								</CardContent>
							</Card>
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold">setConfig(config?)</h3>
							<p class="text-muted-foreground mb-2">Change the configuration at any point.</p>
							<Card>
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">config</code> - Configuration object
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>

		<!-- Best Practices -->
		<section class="mb-12">
			<h2 class="mb-4 text-2xl font-bold">Best practices</h2>
			<div class="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle class="text-base">Loading the SDK</CardTitle>
					</CardHeader>
					<CardContent>
						<ul class="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
							<li>
								For modern projects, the ES Module approach is recommended for better code organization and
								tree-shaking.
							</li>
							<li>
								For legacy support, use the IIFE approach with <code class="text-primary">defer</code> instead of
								<code class="text-primary">async</code> if you experience issues with race conditions.
							</li>
							<li>For frameworks, consider loading the script dynamically and awaiting it.</li>
							<li>Make sure to initialize the SDK after the script is fully loaded.</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle class="text-base">Exit intent</CardTitle>
					</CardHeader>
					<CardContent>
						<ul class="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
							<li>Use exit intent for the best user retention.</li>
							<li>Config settings will override any changes made in the discovery UI.</li>
							<li>Test exit intent behavior with different browser configurations.</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle class="text-base">Button placement</CardTitle>
					</CardHeader>
					<CardContent>
						<ul class="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
							<li>Consider your game's UI when choosing button position.</li>
							<li>You can hide the button and control discovery programmatically.</li>
							<li>Ensure the button doesn't interfere with critical game elements.</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- Found an Issue Section -->
		<section class="mb-12">
			<Card class="bg-muted">
				<CardHeader>
					<CardTitle>Found an issue?</CardTitle>
					<CardDescription>Report bugs or suggest improvements to the Playlight SDK.</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="flex items-center">
						<Button
							variant="outline"
							class="flex items-center gap-2"
							target="_blank"
							href="https://github.com/therealPaulPlay/Playlight-SDK/issues"
						>
							Github Issues <ExternalLink />
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	</div>
</main>

<style>
	pre {
		max-height: 400px;
		margin: 0;
	}

	code {
		font-family: "JetBrains Mono", monospace;
		border-radius: 0.25rem;
		padding: 0.125rem 0.25rem;
		background-color: hsl(var(--muted));
		font-size: 0.875rem;
	}

	:global(pre code) {
		padding: 0;
		background-color: transparent;
	}
</style>
