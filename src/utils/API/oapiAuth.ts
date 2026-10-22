import {OAPI_AUTH_LOGIN_ROUTE, OAPI_AUTH_LOGOUT_ROUTE, OAPI_AUTH_ME_ROUTE, OAPI_BADGES_REFRESH_ROUTE, OAPI_URL} from "../constantes.ts";
import type {OapiSessionType} from "../../types/OapiSessionType.ts";

/**
 * Connexion Discord via OAPI, utilisable côté navigateur.
 * La session repose sur le cookie HttpOnly "auth_token" posé par OAPI : aucune clé ni jeton
 * n'est manipulé ici. Ne jamais importer OapiFetcher (clé de service) depuis ce module.
 */
const SESSION_CACHE_KEY = "oapi-session";
// OAPI limite /api/auth/me à 10 appels/min : on garde la session en cache pendant la navigation
const SESSION_CACHE_TTL = 5 * 60 * 1000;

function oapiUrl(route: string, returnTo?: string): string {
    const url = new URL(route, OAPI_URL);
    if (returnTo) url.searchParams.set("return_to", returnTo);
    return url.href;
}

/**
 * URL de connexion Discord OAPI, avec retour sur la page indiquée une fois connecté.
 * @param returnTo chemin du site (ex. "/classements/discord"), OAPI refuse les URL complètes
 */
export function getOapiLoginUrl(returnTo?: string): string {
    return oapiUrl(OAPI_AUTH_LOGIN_ROUTE, returnTo);
}

/**
 * URL de déconnexion OAPI (supprime le cookie de session).
 * @param returnTo chemin du site vers lequel revenir
 */
export function getOapiLogoutUrl(returnTo?: string): string {
    return oapiUrl(OAPI_AUTH_LOGOUT_ROUTE, returnTo);
}

/**
 * Oublie la session en cache, à appeler avant une connexion ou une déconnexion.
 */
export function clearOapiSessionCache() {
    try {
        sessionStorage.removeItem(SESSION_CACHE_KEY);
    } catch {
        // Stockage indisponible (navigation privée...) : rien à oublier
    }
}

/**
 * @param allowExpired renvoie aussi une session expirée (repli quand OAPI refuse la requête)
 */
function readCachedSession(allowExpired = false): OapiSessionType | null {
    try {
        const cached = JSON.parse(sessionStorage.getItem(SESSION_CACHE_KEY) ?? "null");
        if (cached && (allowExpired || Date.now() - cached.savedAt < SESSION_CACHE_TTL)) return cached.session;
    } catch {
        // Cache illisible : on redemande la session à OAPI
    }
    return null;
}

function cacheSession(session: OapiSessionType) {
    try {
        sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({session, savedAt: Date.now()}));
    } catch {
        // Stockage indisponible : la session sera simplement redemandée
    }
}

// Appel en cours partagé : le header et la page profil demandent la session en même temps
let pendingSession: Promise<OapiSessionType | null> | null = null;

async function fetchOapiSession(): Promise<OapiSessionType | null> {
    try {
        const response = await fetch(oapiUrl(OAPI_AUTH_ME_ROUTE), {
            credentials: "include",
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            if (response.status !== 429) console.error(`OAPI: ${OAPI_AUTH_ME_ROUTE} a répondu ${response.status}.`);
            // Quota atteint ou erreur passagère : on garde la dernière session connue plutôt que de déconnecter
            return readCachedSession(true);
        }

        const session = await response.json() as OapiSessionType;
        // Seule une session connectée est mise en cache : une connexion faite entre-temps
        // (autre onglet, retour d'OAPI) doit être vue dès la page suivante
        if (session.authenticated) cacheSession(session);
        else clearOapiSessionCache();
        return session;
    } catch (error) {
        console.error("OAPI: impossible de récupérer la session Discord:", error);
        return readCachedSession(true);
    }
}

/**
 * Récupère l'utilisateur Discord connecté via le cookie de session OAPI.
 * @returns null si OAPI est injoignable ou refuse la requête (quota, CORS...) et qu'aucune session n'est connue
 */
export function getOapiSession(): Promise<OapiSessionType | null> {
    const cached = readCachedSession();
    if (cached) return Promise.resolve(cached);

    pendingSession ??= fetchOapiSession().finally(() => {
        pendingSession = null;
    });
    return pendingSession;
}

/**
 * Demande à OAPI de recalculer les badges de l'utilisateur connecté.
 * @returns le statut HTTP de la réponse, ou null si OAPI est injoignable
 */
export async function refreshOapiBadges(): Promise<number | null> {
    try {
        const response = await fetch(oapiUrl(OAPI_BADGES_REFRESH_ROUTE), {
            method: "POST",
            credentials: "include",
            cache: "no-store",
            signal: AbortSignal.timeout(30_000),
        });

        if (!response.ok) console.error(`OAPI: ${OAPI_BADGES_REFRESH_ROUTE} a répondu ${response.status}.`);
        // Cookie expiré : la session en cache n'est plus valable
        if (response.status === 401) clearOapiSessionCache();
        return response.status;
    } catch (error) {
        console.error("OAPI: impossible de rafraîchir les badges:", error);
        return null;
    }
}
