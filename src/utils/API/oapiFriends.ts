import {OAPI_FRIENDS_ROUTE, OAPI_URL} from "../constantes.ts";
import {clearOapiSessionCache} from "./oapiAuth.ts";

/**
 * Gestion des amis via OAPI, utilisable côté navigateur.
 * Comme oapiAuth, tout repose sur le cookie de session HttpOnly "auth_token" : aucune clé n'est manipulée ici.
 */
export type FriendStatus = "pending" | "accepted";

export type FriendProfile = {
    id: string;
    username?: string | null;
    discord_id?: string | null;
    discord_tag?: string | null;
    avatar_url?: string | null;
}

export type Friendship = {
    friendship_id: string;
    user: FriendProfile;
    status: FriendStatus;
    since: string;
}

export type FriendList = {
    friends: Friendship[];
    incoming: Friendship[];
    outgoing: Friendship[];
}

export type FriendRequestResult = {
    friendship_id: string;
    status: FriendStatus;
}

const MEMBER_ID = /^[a-zA-Z0-9]{1,64}$/;
const DISCORD_TAG = /^[a-z0-9._]{2,32}$/;

const MESSAGES: Record<number, string> = {
    400: "Vérifie le tag Discord. Tu ne peux pas t'ajouter toi-même.",
    401: "Ta session a expiré. Reconnecte-toi avec Discord.",
    403: "OAPI refuse cet accès pour le moment.",
    404: "Compte ou demande introuvable. Actualise la liste et réessaie.",
    409: "Vous êtes déjà amis ou une demande a déjà été envoyée.",
    429: "Trop de demandes. Patiente avant de réessayer.",
    502: "La gestion des amis est temporairement indisponible. Réessaie plus tard.",
};

export class OapiFriendsError extends Error {
    status: number;
    retryAfter: number;

    constructor(status: number, message = MESSAGES[status] ?? "OAPI est indisponible. Réessaie plus tard.", retryAfter = 0) {
        super(message);
        this.name = "OapiFriendsError";
        this.status = status;
        this.retryAfter = retryAfter;
    }
}

// Quota OAPI atteint : plus aucun appel avant cette date (partagé par toute la page)
let retryAt = 0;

/**
 * @returns la date (ms) avant laquelle OAPI refusera les appels, 0 si aucun quota n'est atteint
 */
export function friendsRetryAt(): number {
    return retryAt;
}

async function call(path: string, method = "GET"): Promise<unknown> {
    if (Date.now() < retryAt) {
        throw new OapiFriendsError(429, undefined, Math.ceil((retryAt - Date.now()) / 1000));
    }

    let response: Response;
    try {
        response = await fetch(new URL(OAPI_FRIENDS_ROUTE + path, OAPI_URL), {
            method,
            credentials: "include",
            cache: "no-store",
            signal: AbortSignal.timeout(15_000),
        });
    } catch {
        throw new OapiFriendsError(0, "Impossible de joindre OAPI. Vérifie ta connexion puis réessaie.");
    }

    if (!response.ok) {
        if (response.status === 429) {
            // En cross-origin, Retry-After peut être masqué : on attend alors une fenêtre de quota complète
            const wait = Number(response.headers.get("Retry-After")) || 60;
            retryAt = Date.now() + wait * 1000;
            throw new OapiFriendsError(429, undefined, wait);
        }
        // Cookie expiré : la session en cache n'est plus valable
        if (response.status === 401) clearOapiSessionCache();
        throw new OapiFriendsError(response.status);
    }

    if (response.status === 204) return undefined;
    try {
        return await response.json();
    } catch {
        throw new OapiFriendsError(0, "La réponse d'OAPI est illisible. Réessaie plus tard.");
    }
}

function isFriendship(value: unknown): value is Friendship {
    if (!value || typeof value !== "object") return false;
    const entry = value as Friendship;
    const user = entry.user as Record<string, unknown> | undefined;
    return typeof entry.friendship_id === "string"
        && !!user && typeof user.id === "string" && MEMBER_ID.test(user.id)
        && ["username", "discord_id", "discord_tag", "avatar_url"].every((key) => user[key] == null || typeof user[key] === "string")
        && (entry.status === "pending" || entry.status === "accepted")
        && typeof entry.since === "string";
}

/**
 * Amis, demandes reçues et demandes envoyées de l'utilisateur connecté.
 */
export async function getFriends(): Promise<FriendList> {
    const data = await call("") as FriendList | null;
    const valid = !!data && (["friends", "incoming", "outgoing"] as const)
        .every((kind) => Array.isArray(data[kind]) && data[kind].every(isFriendship));
    if (!valid) throw new OapiFriendsError(0, "La liste d'amis renvoyée par OAPI est illisible. Réessaie plus tard.");
    return data;
}

/**
 * Envoie une demande d'ami (acceptée directement si l'autre membre en avait déjà envoyé une).
 * @param value tag Discord, avec ou sans @
 */
export async function requestFriendByTag(value: string): Promise<FriendRequestResult> {
    const tag = value.trim().replace(/^@/, "").toLowerCase();
    if (!DISCORD_TAG.test(tag) || tag.includes("..")) {
        throw new OapiFriendsError(400, "Tag Discord invalide : 2 à 32 lettres, chiffres, points ou underscores, sans espaces.");
    }
    try {
        return await call(`/${encodeURIComponent(tag)}/request`, "POST") as FriendRequestResult;
    } catch (error) {
        if (error instanceof OapiFriendsError && error.status === 404) {
            throw new OapiFriendsError(404, "Aucun membre ne correspond à ce tag Discord. Vérifie son nom d'utilisateur exact.");
        }
        throw error;
    }
}

function memberAction(id: string, action: "accept" | "remove") {
    if (!MEMBER_ID.test(id)) throw new OapiFriendsError(400, "Identifiant de membre invalide.");
    return call(`/${encodeURIComponent(id)}/${action}`, "POST");
}

/**
 * Accepte la demande reçue du membre.
 * @param id identifiant OAPI du membre (FriendProfile.id)
 */
export async function acceptFriend(id: string): Promise<void> {
    await memberAction(id, "accept");
}

/**
 * Retire un ami, refuse sa demande ou annule la demande envoyée.
 * @param id identifiant OAPI du membre (FriendProfile.id)
 */
export async function removeFriend(id: string): Promise<void> {
    await memberAction(id, "remove");
}
