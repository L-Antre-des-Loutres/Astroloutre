import type {ServeurScreenType} from "./ServeurType.ts";

export type PokemonStats = {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
};

export type PokemonMove = {
    name: string;
    level: string;
};

export type PokemonMovesets = {
    by_level: PokemonMove[];
    by_tm: PokemonMove[];
    by_breeding: PokemonMove[];
};

export type PokemonLocation = {
    game: string;
    location: string;
};

export type PokemonPokedexEntry = {
    game: string;
    description: string;
};

export type PokemonType = {
    id: string;
    slug: string;
    name: string;
    form: string;
    baseSpecies: string;
    category: string;
    types: string[];
    abilities: string[];
    stats: PokemonStats;
    evolutions: string[];
    movesets: PokemonMovesets;
    locations: PokemonLocation[];
    pokedex_entries: PokemonPokedexEntry[];
    about: string;
    images: ServeurScreenType[];
    pageColor?: string;
    bannerUrl?: string;
};
