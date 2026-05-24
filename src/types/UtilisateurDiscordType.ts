// Type des données joueur
export type DiscordUserType = {
    id: string;
    username: string;
    discord_id: string;
    discord_tag: string;
    avatar_url: string;
    roles: Roles[] | null;
    joined_at: string;
    first_active_at: string;
    last_active_at: string;
    delete_at: string;
}

export type Roles = {
    id: string
    name: string
    color: string
}

// Type des données des joueurs
export type LinkAccount = {
    id: number
    utilisateur_id: number
    jeu: string
    compte_id: string
    premiere_co: string
    derniere_co: string
    playername: string
}

export type DiscordUserStatsType = {
    id: string;
    discord_user: string;
    message_count: number;
    vocal_time: number;
    voice_channels: Channel[];
    text_channels: Channel[];
    vocal_with: DiscordUser[];
    date_stats: string;
}

export type Channel = {
    id: string,
    name: string
}

export type DiscordUser = {
    id: string,
    username: string
}
