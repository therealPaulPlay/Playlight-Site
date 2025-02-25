import { toast } from "svelte-sonner";

export function formatDomain(domain) {
    return domain.toLowerCase().replace("https://", "").replace("http://", "").replace("www.", "");
}