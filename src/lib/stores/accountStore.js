import { writable } from "svelte/store";

export const username = writable("Guest");
export const isAuthenticated = writable(false);