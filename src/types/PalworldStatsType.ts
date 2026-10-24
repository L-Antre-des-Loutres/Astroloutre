// Compteur par espèce / boss, avec le nom français fourni par l'exporteur
export type PalworldCountType = {
    count: number;
    name_fr: string | null;
};

export type PalworldPalType = {
    species: string;
    species_name_fr: string;
    name_fr: string;
    nickname: string | null;
    level: number;
    rank: number;
    gender: string;
    is_alpha: boolean;
    is_lucky: boolean;
    awakened: boolean;
    passives_fr: string[];
    talent_hp: number;
    talent_attack: number;
    talent_defense: number;
    slot_index: number;
};

export type PalworldSummaryType = {
    total: number;
    unique_species: number;
    alpha: number;
    lucky: number;
    awakened: number;
    four_passives: number;
    perfect_talents: number;
    average_level: number;
    max_level: number;
    in_box: number;
    in_party: number;
};

export type PalworldStatsType = {
    id: string;
    player: string;
    server: string;
    player_id: string;
    playername: string;
    guild_name: string;
    level: number;
    nb_catch_pal: number;
    unlocked_technologies: number;
    completed_quests: number;
    species_captured: number;
    tower_boss_defeated: number;
    pal_butcher_total: number;
    dungeon_clear: number;
    oilrig_clear: number;
    fishing_total: number;
    craft_item_total: number;
    fast_travel_unlocked: number;
    game_cleared: number;
    pal_lucky: number;
    pal_team: PalworldPalType[] | null;
    capture_by_species: Record<string, PalworldCountType> | null;
    butcher_by_species: Record<string, PalworldCountType> | null;
    tower_boss_defeats: Record<string, PalworldCountType> | null;
    raid_boss_defeats: Record<string, PalworldCountType> | null;
    pal_summary: PalworldSummaryType | null;
    expand?: {
        server?: { id: string; name: string };
    };
};
