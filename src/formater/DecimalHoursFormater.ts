export function formatDecimalHoursToString(hours: number | null): string {
    if (hours === null || isNaN(hours)) {
        return "Aucun temps";
    }

    const wholeHours = Math.floor(hours);
    const decimalPart = hours - wholeHours;

    if (decimalPart === 0) {
        return wholeHours.toString();
    }

    // Convert decimal part to minutes
    const minutes = Math.round(decimalPart * 60);
    const totalMinutes = wholeHours * 60 + minutes;

    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;

    let hoursFormmat = ""
    if (resultHours > 1) {
        hoursFormmat = "heures"
    } else {
        hoursFormmat = "heure"
    }

    let minutesFormmat = ""
    if (resultMinutes > 1) {
        minutesFormmat = "minutes"
    } else {
        minutesFormmat = "minute"
    }

    return `${resultHours} ${hoursFormmat} ${resultMinutes.toString().padStart(2, '0')} ${minutesFormmat}`;
}

export async function formatDecimalHours(hours: number | null): Promise<number> {
    if (hours === null || isNaN(hours)) {
        return 0;
    }

    const wholeHours = Math.floor(hours);
    const decimalPart = hours - wholeHours;

    // Convert decimal part to minutes
    const minutes = Math.round(decimalPart * 60);
    const totalMinutes = wholeHours * 60 + minutes;

    // Convert back to hours rounded
    return Math.round(totalMinutes / 60);
}