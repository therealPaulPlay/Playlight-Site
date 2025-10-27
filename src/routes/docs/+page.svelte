<script>
	import { Button } from "$lib/components/ui/button";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import {
		Copy,
		Check,
		Code2,
		Sliders,
		Rocket,
		ExternalLink,
		LayoutGrid,
		X,
		CircleX,
		CircleCheck,
		Asterisk,
	} from "lucide-svelte";
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
		"  // Only include the keys with non-default values!",
		"  await playlightSDK.init({",
		"    exitIntent: {",
		"      enabled: true | false,",
		"      immediate: true | false",
		"    },",
		"    sidebar: {",
		"      enableBeta: true | false,",
		"      forceVisible: true | false",
		"    }",
		"  });",
		"<\/script>",
	];

	const carouselExampleLines = [
		"<!-- Carousel Widget, width of min. 500px is recommended -->",
		'<div class="playlight-widget-carousel"',
		'     style="height: 330px; width: 750px;">',
		"<\/div>",
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
			<div class="mb-2 flex items-center gap-2">
				<Rocket class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Getting started</h2>
			</div>
			<p class="text-muted-foreground mb-6">
				Integrating Playlight into your game is simple. Just include the script and initialize it with your config.
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
							<div class="code-block bg-muted relative overflow-hidden">
								<button class="absolute top-2 right-2 cursor-pointer p-1" onclick={copyCode}>
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
							<div class="code-block bg-muted relative overflow-hidden">
								<button class="absolute top-2 right-2 cursor-pointer p-1" onclick={copyCode}>
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
			<div class="bg-muted text-muted-foreground mb-8 p-4 text-sm">
				<p>Congrats! This is all you need to integrate Playlight with its default settings.</p>
			</div>
		</section>

		<!-- Configuration Options -->
		<section class="mb-12">
			<div class="mb-2 flex items-center gap-2">
				<Sliders class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Configuration</h2>
			</div>
			<p class="text-muted-foreground mb-6">Customize the behavior and appearance of the Playlight integration.</p>

			<Tabs value="configuration" class="mb-8">
				<TabsList class="mb-6">
					<TabsTrigger value="configuration">Object</TabsTrigger>
					<TabsTrigger value="exitIntent">Exit intent</TabsTrigger>
					<TabsTrigger value="sidebar">Sidebar (beta)</TabsTrigger>
				</TabsList>

				<TabsContent value="configuration">
					<Card>
						<CardHeader>
							<CardTitle>Configuration object</CardTitle>
							<CardDescription>The SDK can be initialized with an optional configuration object.</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="code-block bg-muted relative overflow-hidden">
								<button class="absolute top-2 right-2 cursor-pointer p-1" onclick={copyCode}>
									<Copy class="copy-icon text-muted-foreground hover:text-foreground h-4 w-4" />
									<Check class="check-icon hidden h-4 w-4 text-green-500" />
								</button>
								<pre class="overflow-x-auto p-4 text-sm">{configExampleLines.join("\n")}</pre>
							</div>

							<div class="mt-6 space-y-3">
								<div class="border border-yellow-500/20 bg-yellow-500/10 p-4">
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

				<TabsContent value="exitIntent">
					<Card>
						<CardHeader>
							<CardTitle>Exit intent</CardTitle>
							<CardDescription>
								Configure the exit intent feature, which shows the Discovery when users are about to leave.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								<div class="grid gap-2">
									<h4 class="text-sm font-medium">
										enabled <code class="text-primary">boolean</code> <code class="text-primary">true</code>
									</h4>
									<p class="text-muted-foreground text-sm">
										Whether to show a notification-like bar – which prompts the user to open the Discovery – when they
										move their mouse towards the browser toolbar (indicating they might leave).
									</p>
								</div>

								<div class="grid gap-2">
									<h4 class="text-sm font-medium">
										immediate <code class="text-primary">boolean</code> <code class="text-primary">false</code>
									</h4>
									<p class="text-muted-foreground text-sm">
										Instead of showing a notification-like bar, immediately open the Discovery.
									</p>
								</div>

								<div class="mt-4 border border-yellow-500/20 bg-yellow-500/10 p-4">
									<h4 class="mb-1 text-sm font-medium">Note</h4>
									<p class="text-muted-foreground text-sm">
										You can give the user the option to configure this via your game's settings.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="sidebar">
					<Card>
						<CardHeader>
							<CardTitle>Sidebar</CardTitle>
							<CardDescription>Configure how the sidebar should be displayed.</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								<div class="grid gap-2">
									<h4 class="text-sm font-medium">
										enableBeta <code class="text-primary">boolean</code> <code class="text-primary">false</code>
									</h4>
									<p class="text-muted-foreground text-sm">
										The sidebar is currently in beta. Set this to true to enable it.
									</p>
								</div>

								<div class="grid gap-2">
									<h4 class="text-sm font-medium">
										forceVisible <code class="text-primary">boolean</code> <code class="text-primary">false</code>
									</h4>
									<p class="text-muted-foreground text-sm">
										Set this to true to show the sidebar to everyone and not only visitors from Playlight (great for
										testing).
									</p>
								</div>

								<div class="mt-4 border border-yellow-500/20 bg-yellow-500/10 p-4">
									<h4 class="mb-1 text-sm font-medium">Note</h4>
									<p class="text-muted-foreground text-sm">
										Please thoroughly test this with <code class="text-primary">forceVisible: true</code> in your local
										environment to ensure all styles work correctly. Units like
										<code class="text-primary">vw, dvw, svw, lvw</code> don't factor in the sidebar width. Rely on fixed
										or absolute positioning instead.
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
			<div class="mb-2 flex items-center gap-2">
				<Code2 class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">API reference</h2>
			</div>
			<p class="text-muted-foreground mb-6">Control the Playlight Discovery UI programmatically with these methods.</p>

			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Methods</CardTitle>
					<CardDescription>Available methods to control Playlight.</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-6">
						<div>
							<h3 class="mb-2 text-lg font-semibold">init(config?)</h3>
							<p class="text-muted-foreground mb-2">Initializes the Playlight SDK with the provided configuration.</p>
							<Card class="border-0 py-0">
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
							<p class="text-muted-foreground mb-2">Programmatically show or hide the Discovery.</p>
							<Card class="border-0 py-0">
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">visible</code> - Boolean to show
										or hide the Discovery UI (defaults to true)
									</p>
								</CardContent>
							</Card>
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold">setConfig(config?)</h3>
							<p class="text-muted-foreground mb-2">Change the configuration at any point.</p>
							<Card class="border-0 py-0">
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">config</code> - Configuration
										object
									</p>
								</CardContent>
							</Card>
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold">onEvent(event, callback)</h3>
							<p class="text-muted-foreground mb-2">Register an event callback.</p>
							<Card class="border-0 py-0">
								<CardContent class="border p-4">
									<p class="text-sm">
										<span class="font-medium">Parameters:</span> <code class="text-primary">event</code> - Event name
										(discoveryOpen, discoveryClose or exitIntent) | <code class="text-primary">callback</code> - Function
										to call
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>

		<!-- Widgets Section -->
		<section class="mb-12">
			<div class="mb-2 flex items-center gap-2">
				<LayoutGrid class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Widgets</h2>
			</div>
			<p class="text-muted-foreground mb-6">Add an interactive Playlight widget to your game UI.</p>

			<Card>
				<CardHeader>
					<CardTitle>Carousel widget</CardTitle>
					<CardDescription>Display a dynamic content carousel in your game.</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="code-block bg-muted relative overflow-hidden">
							<button class="absolute top-2 right-2 cursor-pointer p-1" onclick={copyCode}>
								<Copy class="copy-icon text-muted-foreground hover:text-foreground h-4 w-4" />
								<Check class="check-icon hidden h-4 w-4 text-green-500" />
							</button>
							<pre class="overflow-x-auto p-4 text-sm">{carouselExampleLines.join("\n")}</pre>
						</div>

						<div class="grid gap-2">
							<p class="text-muted-foreground text-sm">
								Add a carousel widget by creating a container with the class as seen above.
							</p>
							<ul class="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
								<li>Recommended dimensions: 330px height, min. 500px width</li>
								<li>Widget is transparent – add background, padding etc. as you wish</li>
								<li>Loads dynamically – ideal for death screens and mode selection UIs</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>

		<!-- Dos and Don'ts Section -->
		<section class="mb-12">
			<div class="mb-2 flex items-center gap-2">
				<Asterisk class="text-primary h-6 w-6" />
				<h2 class="text-2xl font-bold">Dos and Don'ts</h2>
			</div>

			<p class="text-muted-foreground mb-6">What you should and shouldn't do when integrating Playlight.</p>

			<!-- Dos Card -->
			<Card class="mb-6 pt-0">
				<CardHeader class="border-b border-green-500/20 bg-green-500/10 py-4! pt-6!">
					<CardTitle>Do</CardTitle>
				</CardHeader>
				<CardContent class="pt-4">
					<ul class="space-y-3">
						<li class="flex items-center gap-3">
							<CircleCheck class="h-4 w-4 flex-shrink-0 text-green-500" />
							<p class="text-sm">Use the ES module to allow for tree shaking and load it async</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleCheck class="h-4 w-4 flex-shrink-0 text-green-500" />
							<p class="text-sm">
								Use <code class="text-primary">.setConfig()</code> to dynamically adjust the exit intent and built-in button
								depending on the game state
							</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleCheck class="h-4 w-4 flex-shrink-0 text-green-500" />
							<p class="text-sm">
								Create your own custom Discovery button using the <code class="text-primary">.setDiscovery()</code> method
							</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleCheck class="h-4 w-4 flex-shrink-0 text-green-500" />
							<p class="text-sm">Ensure that it nicely integrates into your game UI and behaves predictably</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleCheck class="h-4 w-4 flex-shrink-0 text-green-500" />
							<p class="text-sm">Use a widget in areas where players select game modes, maps or adjust settings</p>
						</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Don'ts Card -->
			<Card class="pt-0">
				<CardHeader class="border-b border-red-500/20 bg-red-500/10 py-4! pt-6!">
					<CardTitle>Don't</CardTitle>
				</CardHeader>
				<CardContent class="pt-4">
					<ul class="space-y-3">
						<li class="flex items-center gap-3">
							<CircleX class="h-4 w-4 flex-shrink-0 text-red-500" />
							<p class="text-sm">Overwrite SDK styles with custom CSS</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleX class="h-4 w-4 flex-shrink-0 text-red-500" />
							<p class="text-sm">Make it difficult for players to bring up the Discovery</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleX class="h-4 w-4 flex-shrink-0 text-red-500" />
							<p class="text-sm">Only load the SDK on some of the site's pages or after interactions</p>
						</li>
						<li class="flex items-center gap-3">
							<CircleX class="h-4 w-4 flex-shrink-0 text-red-500" />
							<p class="text-sm">Place two widgets on the same page</p>
						</li>
					</ul>
				</CardContent>
			</Card>
		</section>

		<!-- Found an Issue Section -->
		<section class="mb-12">
			<Card>
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
