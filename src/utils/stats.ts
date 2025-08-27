// utils/stats.ts
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
    playername: string;
    uuid: string;
    tmps_jeu: number;
    nb_mort: number;
    nb_kills: number;
    nb_playerkill: number;
    nb_blocs_detr: number;
    nb_blocs_pose: number;
    dist_total: number;
    dist_pieds: number;
    dist_elytres: number;
    dist_vol: number;
};

// --- Helpers ---
export const makeServersMap = (list: Server[]) =>
    Object.fromEntries(list.map(s => [s.id.toString(), { nom: s.nom, description: s.description }]));

export const aggregatePlayers = (raw: PlayerStats[]) => {
    const map = new Map<string, PlayerStats>();
    const numericKeys: (keyof PlayerStats)[] = [
        "tmps_jeu","nb_mort","nb_kills","nb_playerkill","nb_blocs_detr",
        "nb_blocs_pose","dist_total","dist_pieds","dist_elytres","dist_vol"
    ];

    raw.forEach(p => {
        const key = String(p.uuid ?? p.playername ?? "");
        const existing = map.get(key);

        if (!existing) {
            map.set(key, { ...p });
            return;
        }

        numericKeys.forEach(k => {
            existing[k] = Number(existing[k] ?? 0) + Number(p[k] ?? 0);
        });

        if (!existing.playername && p.playername) existing.playername = p.playername;
        if (!existing.uuid && p.uuid) existing.uuid = p.uuid;

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
