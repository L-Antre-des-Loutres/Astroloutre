/**
 * Calculates a Discord activity score based on the number of messages sent and the time spent in voice activity.
 *
 * 1 message = 1 point
 *
 * 1 minute de vocal = 1 point
 *
 * @param {number} nbMessage - The number of messages sent by the user. If less than or equal to 0, it is treated as 0.
 * @param {number} tmpsVocal - The time spent in voice channels by the user. If less than or equal to 0, it is treated as 0.
 * @return {Promise<number>} A promise that resolves to the total activity score calculated by summing the points for messages and voice time.
 */


export async function discordActivityScore(nbMessage: number, tmpsVocal: number): Promise<number> {
    let nbPoint = 0;

    // Formule de point pour les messages
    if (nbMessage > 0) {
        nbPoint += nbMessage;
    }

    // Formule de point pour les temps vocaux
    if (tmpsVocal > 0) {
        // Convertit les minutes en points
        nbPoint += Math.floor(tmpsVocal / 60);
    }

    return nbPoint;
}