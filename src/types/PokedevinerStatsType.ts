// Type d'une partie de Pokedeviner (collection PocketBase "pokedeviner_stats")
export type PokedevinerStatType = {
    id: string;
    discord_user: string; // relation vers discord_users (id PocketBase)
    start_at: string;     // date/heure de début de la partie
    success_at: string;   // date/heure de la bonne réponse (vide si non terminée)
    nb_try: number;       // nombre d'essais
    pokemon_name: string; // Pokémon à deviner
    pokemon_try_list: any; // liste JSON des essais
    expired?: boolean;    // true si la partie est expirée
    created: string;
    updated: string;
};
