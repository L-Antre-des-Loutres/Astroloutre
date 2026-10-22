import {OAPI_DISCORD_STATS_ROUTE, OAPI_URL} from "../constantes.ts";
import type {GlobalDiscordActivityType} from "../../types/DiscordActivityType.ts";

/**
 * Client OAPI réservé au serveur / à la compilation.
 * La clé de service donne les droits administrateur : ne jamais importer ce module
 * dans un composant hydraté ou un script navigateur, ni préfixer la clé par PUBLIC_.
 */
export class OapiFetcher {
    // Promesse partagée : un seul appel par build (quota OAPI de 10 appels/min/route)
    private static discordStats?: Promise<GlobalDiscordActivityType | null>;

    private static async request<T>(route: string, retry = true): Promise<T | null> {
        const key = import.meta.env.OAPI_SERVICE_API_KEY;
        if (!key) {
            console.warn(`OapiFetcher: OAPI_SERVICE_API_KEY manquante, ${route} ignorée.`);
            return null;
        }

        try {
            const response = await fetch(new URL(route, OAPI_URL), {
                headers: {Authorization: `Bearer ${key}`},
                signal: AbortSignal.timeout(30_000),
                redirect: 'error',
                cache: 'no-store',
            });

            // Quota dépassé : on attend le délai indiqué puis on réessaie une fois
            if (response.status === 429 && retry) {
                const retryAfter = Number(response.headers.get('Retry-After')) || 60;
                console.warn(`OapiFetcher: quota atteint sur ${route}, nouvel essai dans ${retryAfter}s.`);
                await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
                return this.request<T>(route, false);
            }

            if (!response.ok) {
                console.error(`OapiFetcher: ${route} a répondu ${response.status}.`);
                return null;
            }

            return await response.json() as T;
        } catch (error) {
            console.error(`OapiFetcher: échec de l'appel à ${route}:`, error);
            return null;
        }
    }

    /**
     * Statistiques Discord globales et détaillées par joueur (salons préférés, records, compagnon vocal...).
     * @returns null si l'API est indisponible ou la clé absente
     */
    static getDiscordStats(): Promise<GlobalDiscordActivityType | null> {
        this.discordStats ??= this.request<GlobalDiscordActivityType>(OAPI_DISCORD_STATS_ROUTE);
        return this.discordStats;
    }
}
