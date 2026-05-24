// Type des données joueur
export type PlayerType = {
    id: string;
    discord_user: string | null;
    discord_tag: string | null;
    platform: string;
    account_id: string;
    first_connected_at: string;
    last_connected_at: string;
    playername: string;
};

export type PlayerStatsType = {
    id: string;
    server: string;
    account_id: string;
    playtime: number;
    deaths: number;
    mob_kills: number;
    player_kills: number;
    blocks_mined: number;
    blocks_placed: number;
    total_distance: number;
    distance_walked: number;
    distance_elytra: number;
    distance_fligth: number;
    mobs_killed: Record<string, number>;
    items_crafted: Record<string, number>;
    items_broken: Record<string, number>;
    achievements: Record<string, boolean>;
}