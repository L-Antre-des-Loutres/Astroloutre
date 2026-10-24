export function formatDateWithHours(date: string | null | undefined, fallback = "Aucune activité récente") {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime()) || d.getTime() <= 0) return fallback;
    return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}