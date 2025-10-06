const apiRegisterPlayerName = "https://sessionserver.mojang.com/session/minecraft/profile/"

/**
 * Converts a UUID to a pseudo (player name) by fetching data from a specific API.
 *
 * @param {string} uuid - The UUID of the user for which to retrieve the pseudo (player name).
 * @return {string} The pseudo (player name) associated with the given UUID, or "Unknown" if an error occurs or the name cannot be retrieved.
 */

export async function UUIDToPseudo(uuid: string): Promise<string> {
    try {
        // UUID sans les -
        uuid = uuid.replace(/-/g, '');

        const response = await fetch(apiRegisterPlayerName + uuid)
        if (!response.ok) {
            console.error(`Échec HTTP pour UUID ${uuid} - Status ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            console.error("Erreur dans la récupération du pseudo pour UUID")
        }
        const json = JSON.parse(text);
        const playername = json.name;
        if (!playername) {
            console.error(`Playername introuvable pour UUID ${uuid}`);
        }
        return playername;
    } catch (error) {
        return "Unknown";
    }
}