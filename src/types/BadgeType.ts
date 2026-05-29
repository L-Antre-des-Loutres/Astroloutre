/**
 * Type badge
 */
export type BadgeType = {
    id: string;
    name: string;
    description: string;
    obtention_method: string;
    plateform: string;
    is_enabled: boolean;
    image: string;
}

export type BadgeEarnedType = {
    id: string;
    discord_user: string;
    player: string;
    badge: string;
    date_received: string;
    created: string;
    updated: string;
}