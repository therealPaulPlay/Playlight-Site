import { toast } from "svelte-sonner";

export function formatDomain(domain) {
    try {
        const url = new URL(domain);
        return url.hostname; // Extracts only the hostname (e.g., "example.com")
    } catch (error) {
        toast.error("Domain validation failed!");
    }
}
