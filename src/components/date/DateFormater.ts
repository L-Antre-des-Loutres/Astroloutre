export function formatDate(date: string | null | Date): string {
    if (
        !date ||
        date === "2000-01-01T00:00:00.000" ||
        date === "2000-01-01T00:00:00.000Z"
    ) {
        return "Cette date a été oubliée !";
    }

    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
