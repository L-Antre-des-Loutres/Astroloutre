export function formatUUID(uuid: string) {
    uuid = uuid.replace(/-/g, '');
    return uuid;
}