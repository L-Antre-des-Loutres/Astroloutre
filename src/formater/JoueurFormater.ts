import {PB_URL} from "../utils/constantes";

export function slugify(str: string | null | undefined): string {
    return (str || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s_-]/g, '')
        .trim()
        .replace(/\s+/g, '_');
}

// Un compte joueur appartient à Steam si sa plateforme (expand) s'appelle "Steam"
export function isSteamPlayer(player: { expand?: { platform?: { name?: string } } }): boolean {
    return player.expand?.platform?.name?.toLowerCase() === "steam";
}

// Un compte joueur appartient à Minecraft si sa plateforme (expand) s'appelle "Minecraft"
export function isMinecraftPlayer(player: { expand?: { platform?: { name?: string } } }): boolean {
    return player.expand?.platform?.name?.toLowerCase() === "minecraft";
}

// Lien vers la page joueur adaptée à la plateforme du compte
export function playerPageHref(player: { playername: string, expand?: { platform?: { name?: string } } }): string {
    return `/joueurs/${isSteamPlayer(player) ? "steam" : "minecraft"}/${slugify(player.playername)}`;
}

type PlayerImages = { id: string, collectionId?: string, playername: string, head?: string, skin?: string };

// URL d'un fichier PocketBase du joueur, ou null si le champ n'est pas encore rempli par l'API
function playerFileUrl(player: PlayerImages, file?: string): string | null {
    return file && player.collectionId ? `${PB_URL}/api/files/${player.collectionId}/${player.id}/${file}` : null;
}

// Tête du joueur générée par mc-heads
export function mcHeadsHeadUrl(playername: string, size: number): string {
    return `https://mc-heads.net/avatar/${encodeURIComponent(playername)}/${size}`;
}

// Corps du joueur généré par mc-heads
export function mcHeadsBodyUrl(playername: string, size: number): string {
    return `https://mc-heads.net/body/${encodeURIComponent(playername)}/${size}`;
}

// Tête du joueur stockée sur PocketBase (repli sur mc-heads tant que l'API ne l'a pas remplie)
export function playerHeadUrl(player: PlayerImages, size: number): string {
    return playerFileUrl(player, player.head) ?? mcHeadsHeadUrl(player.playername, size);
}

// Attribut onerror : quand l'API change un skin, PocketBase supprime l'ancien fichier encore référencé
// par le site statique jusqu'au prochain build, on bascule alors une seule fois sur mc-heads
export function fallbackOnError(url: string): string {
    return `this.onerror=null;this.src='${url}'`;
}
