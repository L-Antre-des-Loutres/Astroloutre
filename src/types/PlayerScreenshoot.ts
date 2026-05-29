/**
 * Type pour les screenshots des joueurs
 */
export type PlayerScreenshotType = {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    screenshot: string;
    is_in_carousel: boolean;
    platform: string;
    server: string;
    discord_users: string;
    player: string;
    expand?: {
        platform?: {
            name: string;
        };
        server?: {
            name: string;
            expand?: {
                platform?: {
                    name: string;
                }
            }
        };
        discord_users?: {
            username: string;
        };
        player?: {
            playername: string;
        };
    };
    created_at: string;
    updated_at: string;
}
