// Formate une durée en secondes en une chaîne lisible (ex: "1min 23s", "2h 5min")
export function formatSecondsToString(totalSeconds: number | null): string {
    if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
        return "—";
    }

    const total = Math.floor(totalSeconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    // On n'affiche les secondes que si la durée est inférieure à une heure
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);

    return parts.join(" ") || "0s";
}
