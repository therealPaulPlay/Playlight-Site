import { isAdmin, isAuthenticated, username } from "$lib/stores/accountStore";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { BASE_API_URL } from "$lib/stores/configStore";
import { get } from "svelte/store";
import { toast } from "svelte-sonner";
import { goto } from "$app/navigation";

export async function getUser() {
    try {
        const userId = localStorage.getItem("id") || "-1";
        const response = await fetchWithErrorHandling(`${get(BASE_API_URL)}/account/user/` + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("bearer")}`,
            },
        });

        const data = await response.json();

        if (data) {
            username.set(data.user?.user_name);
            isAdmin.set(data.user?.is_admin);
        }

        return data;
    } catch (error) {
        console.error("Error occurred while fetching the user: ", error);
    }
};

// Global function that changes everything to logged in or signed out (all other sign-in functions are related to this)
export async function checkAuthenticationStatus() {
    let bearerToken = localStorage.getItem("bearer");

    if (bearerToken && localStorage.getItem("id") && !isTokenExpired(bearerToken)) {
        // Set store data
        isAuthenticated.set(true);

        // Load basic details
        const data = await getUser();
    } else {
        isAuthenticated.set(false);
    }
}

export function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("bearer");
    username.set("Guest");
    isAuthenticated.set(false);
}

function isTokenExpired(token) {
    let expired;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );

        // If the token cannot be parsed, it is invalid and will be counted as expired
        const { exp } = JSON.parse(jsonPayload);
        expired = Date.now() >= exp * 1000;
    } catch {
        expired = true;
    }
    if (expired) {
        signOut();
        toast.warning("Your session has expired. Please log in again.");
    }
    return expired;
}