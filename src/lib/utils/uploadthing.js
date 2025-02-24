import { generateSvelteHelpers } from "@uploadthing/svelte";
import { get } from "svelte/store";
import { BASE_API_URL } from "$lib/stores/configStore";

export const { createUploader } = generateSvelteHelpers();