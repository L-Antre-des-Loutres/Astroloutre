// Type d'une partie de Poke-Silhouette (collection PocketBase "pokesilhouette_games")
export type PokeSilhouetteGameType = {
    id: string;
    pokemon_name: string;
    pokemon_id: number;
    is_public: boolean;
    host: string; // relation vers discord_users
    channel_id: string;
    duration_ms: number;
    found: boolean;
    winners_count: number;
    started_at: string;
    created: string;
    updated: string;
};

// Type d'un score (collection PocketBase "pokesilhouette_scores")
export type PokeSilhouetteScoreType = {
    id: string;
    game: string; // relation vers pokesilhouette_games
    discord_user: string; // relation vers discord_users
    rank: number;
    elapsed_ms: number;
    created: string;
    updated: string;
};
