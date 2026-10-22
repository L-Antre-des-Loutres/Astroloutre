// Réponse de GET /api/auth/site/me (cookie de session OAPI "auth_token")
export type OapiSessionType = {
    authenticated: boolean;
    username?: string;
    discord_id?: string;
    // null pour les sessions ouvertes avant l'ajout du profil : se reconnecter pour l'obtenir
    discord_tag?: string | null;
    avatar_url?: string | null;
    role?: "Admin" | "LoutreInvesti" | "Normal";
}
