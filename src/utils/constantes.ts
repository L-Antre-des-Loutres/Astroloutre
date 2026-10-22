// ──────────────────────────────────────────────
//  API URL
// ──────────────────────────────────────────────
export const PB_URL = "https://pocketbase.antredesloutres.fr"
export const OAPI_URL = "https://oapi.antredesloutres.fr"
export const PAPI_SPRITE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"


// ──────────────────────────────────────────────
//  Collections names
// ──────────────────────────────────────────────
export const DISCORD_USERS = "discord_users"
export const DISCORD_USER_STATS = "discord_user_stats"
export const PLAYERS = "players"
export const PLAYERS_STATS = "players_stats"
export const SERVERS = "servers"
export const BADGES = "badges"
export const BADGES_EARNED = "badges_earned"
export const PLATEFORMS = "platforms"
export const PLAYER_SCREENSHOTS = "player_screenshots"
export const POKEMON_PLAYERS = "pokemon_players"
export const CAPTURED_POKEMONS = "captured_pokemons"
export const POKEDEVINER_STATS = "pokedeviner_stats"
export const POKE_SILHOUETTE_GAMES = "pokesilhouette_games"
export const POKE_SILHOUETTE_SCORES = "pokesilhouette_scores"
export const POCKETBASE_COLLECTION_PROJETS = "projects"


// ──────────────────────────────────────────────
//  OAPI routes
// ──────────────────────────────────────────────
export const OAPI_DISCORD_STATS_ROUTE = "/api/admin/discord/stats"
// Routes de connexion dédiées au site (retour sur antredesloutres.fr + CORS)
export const OAPI_AUTH_LOGIN_ROUTE = "/api/auth/site/login"
export const OAPI_AUTH_LOGOUT_ROUTE = "/api/auth/site/logout"
export const OAPI_AUTH_ME_ROUTE = "/api/auth/site/me"
// Recalcule les badges de l'utilisateur connecté (cookie de session OAPI)
export const OAPI_BADGES_REFRESH_ROUTE = "/api/badges/me/refresh"
