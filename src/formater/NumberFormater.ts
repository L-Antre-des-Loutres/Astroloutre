export function formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
}
