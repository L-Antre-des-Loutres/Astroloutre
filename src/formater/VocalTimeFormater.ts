export function vocalTimeFormater(time: number): string {
    if (time <= 0) return "0s";

    const totalSeconds = Math.floor(time * 3600); // converti heures décimales en secondes
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`); // afficher les secondes uniquement si moins d'une heure

    return parts.join(" ");
}
