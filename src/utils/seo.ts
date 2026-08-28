// ──────────────────────────────────────────────
//  Métadonnées Open Graph (embeds Discord & SEO)
// ──────────────────────────────────────────────

/** Nom du site, affiché en petit au-dessus du titre dans l'embed Discord. */
export const SITE_NAME = "Antre des Loutres"

/** URL de production, utilisée en secours pour rendre les URLs absolues. */
export const SITE_URL = "https://antredesloutres.fr"

/** Couleur de la barre verticale à gauche de l'embed Discord. */
export const BRAND_COLOR = "#7a3716"

/**
 * Visuel utilisé quand une page ne fournit pas d'image.
 * Doit rester une image large (~1.91:1) servie depuis public/ :
 * un chemin stable, jamais une URL générée par le build.
 */
export const DEFAULT_OG_IMAGE = "/banner/minecraft/nos_serveurs.webp"

export const DEFAULT_OG_DESCRIPTION =
    "Bienvenue dans l'Antre des loutres 🦦 — un lieu de partage, d'amitié et de bonne humeur !"

/** Discord tronque les descriptions trop longues : on coupe proprement avant lui. */
const DESCRIPTION_MAX_LENGTH = 200

/**
 * Discord n'accepte que des URLs absolues pour og:image et og:url.
 * Les chemins relatifs sont résolus contre le domaine du site.
 */
export function absoluteUrl(url: string | undefined | null, site?: URL): string | undefined {
    if (!url) return undefined
    if (/^https?:\/\//i.test(url)) return url

    try {
        return new URL(url, site ?? SITE_URL).href
    } catch {
        return undefined
    }
}

/**
 * Nettoie une description venant de PocketBase (markdown, HTML, retours à la ligne)
 * et la tronque pour qu'elle tienne dans un embed.
 */
export function embedDescription(
    raw: string | undefined | null,
    fallback: string = DEFAULT_OG_DESCRIPTION
): string {
    const text = (raw ?? "")
        .replace(/<[^>]*>/g, " ")                   // balises HTML
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")  // liens et images markdown
        .replace(/[*_`#>]/g, "")                    // reste de la syntaxe markdown
        .replace(/\s+/g, " ")
        .trim()

    if (!text) return fallback
    if (text.length <= DESCRIPTION_MAX_LENGTH) return text

    const cut = text.slice(0, DESCRIPTION_MAX_LENGTH)
    const lastSpace = cut.lastIndexOf(" ")

    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…"
}
