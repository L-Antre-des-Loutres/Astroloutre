/**
 * Calculates a Discord activity score based on the number of messages sent and the time spent in voice activity.
 *
 * 1 message = 0.75 point
 *
 * vocal calcul à revoir !
 *
 * @param {number} nbMessage - The number of messages sent by the user. If less than or equal to 0, it is treated as 0.
 * @param {number} tmpsVocal - The time spent in voice channels by the user. If less than or equal to 0, it is treated as 0.
 * @return {Promise<number>} A promise that resolves to the total activity score calculated by summing the points for messages and voice time.
 */

export async function discordActivityScore(nbMessage: number, tmpsVocal: number): Promise<number> {
    let saturationVoc = 0.1;
    let nbPoint = 0;

    if (!nbMessage) {
        nbMessage = 0;
    }

    if (!tmpsVocal) {
        tmpsVocal = 0;
    }

    // Formule de point pour les messages
    nbPoint = (nbMessage * 0.75) + (10 * (saturationVoc * tmpsVocal))

    return nbPoint;
}