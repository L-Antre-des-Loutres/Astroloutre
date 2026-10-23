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

// Lien vers la page joueur adaptée à la plateforme du compte
export function playerPageHref(player: { playername: string, expand?: { platform?: { name?: string } } }): string {
    return `/joueurs/${isSteamPlayer(player) ? "steam" : "minecraft"}/${slugify(player.playername)}`;
}
