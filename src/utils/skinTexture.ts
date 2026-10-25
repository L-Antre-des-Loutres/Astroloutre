import {PB_URL} from "./constantes.ts";

export const MAX_SKIN_BYTES = 65536;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export async function fetchSkinDataUrl(
    player: { id: string; collectionId?: string; skin?: string; playername?: string },
    fetcher: typeof fetch = fetch,
): Promise<string | null> {
    if (!player.skin || !player.collectionId) return null;

    const name = player.playername ?? player.id;
    const fail = (reason: string): null => {
        console.warn(`[skin3d] ${name}: ${reason}`);
        return null;
    };

    try {
        const url = `${PB_URL}/api/files/${player.collectionId}/${player.id}/${player.skin}`;
        const response = await fetcher(url, {signal: AbortSignal.timeout(10_000)});
        if (!response.ok) return fail(`HTTP ${response.status}`);

        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length > MAX_SKIN_BYTES) return fail(`fichier trop gros (${bytes.length} octets)`);
        if (bytes.length < 24 || !PNG_SIGNATURE.every((b, i) => bytes[i] === b)) {
            return fail("pas un PNG");
        }

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const width = view.getUint32(16);
        const height = view.getUint32(20);
        if (width !== 64 || (height !== 64 && height !== 32)) {
            return fail(`dimensions invalides (${width}x${height})`);
        }

        return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
    } catch (error) {
        return fail(`erreur de téléchargement (${error instanceof Error ? error.message : String(error)})`);
    }
}
