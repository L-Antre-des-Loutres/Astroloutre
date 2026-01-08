// Type des données joueur
export type DiscordUserType = {
    id: number
    discord_id: string
    tag_discord: string
    pseudo_discord: string
    join_date_discord: string
    first_activity: string
    last_activity: string
    nb_message: number
    vocal_time: number
    avatar_url: string,
    roles: Roles[] | null;
    delete_date: string | null;
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
    id: number
    id_utilisateur: number
    nb_message: number
    vocal_time: number
    date_stats: string
    voice_channels: Channel[]
    text_channels: Channel[]
    vocal_with: DiscordUser[]
}

export type Channel = {
    id: string,
    name: string
}

export type DiscordUser = {
    id: string,
    username: string
}
