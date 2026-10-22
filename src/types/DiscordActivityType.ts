// Types de la route OAPI GET /api/admin/discord/stats
// Les durées sont exprimées en heures décimales.

export type ActivityDay = {
    date: string;
    message_count: number;
    vocal_hours: number;
}

export type ChannelTotal = {
    id: string;
    name: string;
    message_count: number;
    vocal_hours: number;
}

export type VoiceCompanion = {
    id: string;
    username: string;
    records_together: number; // nombre d'enregistrements en vocal ensemble
}

export type DiscordActivityType = {
    total_messages: number;
    total_vocal_hours: number;
    undated_records: number;
    undated_messages: number;
    undated_vocal_hours: number;
    daily_complete: boolean;
    record_messages_day: ActivityDay | null;
    record_vocal_day: ActivityDay | null;
    favorite_text_channel: ChannelTotal | null;
    favorite_voice_channel: ChannelTotal | null;
    top_voice_companion: VoiceCompanion | null;
    channel_counters_complete: boolean;
    daily: ActivityDay[];
    fetched_at: string;
}

export type PlayerActivityType = {
    id: string; // ID PocketBase (ou référence stockée d'un compte supprimé)
    discord_id: string | null;
    username: string | null;
    stats: DiscordActivityType;
}

export type GlobalDiscordActivityType = DiscordActivityType & {
    players: PlayerActivityType[];
}
