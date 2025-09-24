// utils/statsPalworld.ts
export type Server = {
    id: number;
    nom: string;
    jeu: string;
    description: string;
    actif: number;
    global: number;
    type?: string;
};

export type PlayerStats = {
    serveur_playername: string;
    compte_id: string;
    tmps_jeu: number;
    nb_mort: number;
    nb_kills: number;
    nb_pal_catch: number;
    nb_boss_kill: number;
    nb_tower_win: number;
};

// --- Helpers ---
export const makeServersMap = (list: Server[]) =>
    Object.fromEntries(list.map(s => [s.id.toString(), {nom: s.nom, description: s.description}]));

export const aggregatePlayers = (raw: PlayerStats[]) => {
    const map = new Map<string, PlayerStats>();
    const numericKeys: (keyof PlayerStats)[] = [
        "tmps_jeu", "nb_mort", "nb_kills", "nb_boss_kill", "nb_tower_win"
    ];

    raw.forEach(p => {
        const key = String(p.compte_id ?? p.serveur_playername ?? "");
        const existing = map.get(key);

        if (!existing) {
            map.set(key, {...p});
            return;
        }

        numericKeys.forEach(k => {
            existing[k] = Number(existing[k] ?? 0) + Number(p[k] ?? 0);
        });

        if (!existing.serveur_playername && p.serveur_playername) existing.serveur_playername = p.serveur_playername;
        if (!existing.compte_id && p.compte_id) existing.compte_id = p.compte_id;

        map.set(key, existing);
    });

    return Array.from(map.values());
};

export const pickStatsFor = (
    serversListMap: Record<string, { nom: string; description: string }>,
    groupedStats: Record<string, PlayerStats[]>
) => {
    const out: Record<string, PlayerStats[]> = {};
    Object.keys(serversListMap).forEach(id => {
        out[id] = groupedStats[id] || [];
    });
    return out;
};
