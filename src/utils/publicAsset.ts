import fs from "node:fs"
import path from "node:path"

/**
 * Vérifie au moment du build qu'un fichier existe bien dans public/.
 *
 * Sert à ne pas pointer un og:image vers une bannière absente : dans ce cas
 * Discord affiche l'embed sans aucune image, ce qui est pire qu'un visuel
 * générique. Renvoie le chemin s'il existe, sinon undefined.
 */
export function publicAsset(relativePath: string): string | undefined {
    try {
        return fs.existsSync(path.join(process.cwd(), "public", relativePath))
            ? relativePath
            : undefined
    } catch {
        return undefined
    }
}
