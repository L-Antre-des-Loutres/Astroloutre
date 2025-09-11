export function formatDecimalHours(hours: number | null): string {
    if (hours === null || isNaN(hours)) {
        return "0";
    }

    const wholeHours = Math.floor(hours);
    const decimalPart = hours - wholeHours;

    if (decimalPart === 0) {
        return wholeHours.toString();
    }

    // Convert decimal part to minutes
    const minutes = Math.round(decimalPart * 60);
    const totalMinutes = wholeHours * 60 + minutes;

    return (totalMinutes / 60).toFixed(2);
}