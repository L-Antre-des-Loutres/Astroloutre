const apiUrl = "https://play.pokemonshowdown.com/sprites/gen5/"
const apiUrlShiny = "https://play.pokemonshowdown.com/sprites/gen5-shiny/"
const defaultPokemonArt = "https://play.pokemonshowdown.com/sprites/substitutes/gen5/substitute.png"

export async function showdownApiGetPkmArt(pokemonName: string, forme: string = "normal", shiny: boolean = false): Promise<string> {

    // Préparation de la variable pokemonArt
    let pokemonArt: string

    // Gestion des erreurs
    // Si pokemonName est vide
    if (!pokemonName) {
        return ""
    }

    // Normalisation
    const f = forme.toLowerCase();
    const p = pokemonName.toLowerCase();

    // Si forme spéciale → suffixe au nom
    const formesSpeciales = ["normal", "rlm", "ocean", "volcan", "ciel", "poison", "dragon"];
    if (!formesSpeciales.includes(f)) {
        pokemonName = `${p}-${f}`;
    }

    // Gestion des exceptions (fichiers locaux RLM)
    let localRelativeUrl = "";

    if (p == "rineshell" || p == "flammiko" || p == "galama" || p == "apheos" || p == "aphelis" || p == "tinywone" || p == "wamek" || p == "smowile") {
        return `/pokemon/rlm/sprites/normal/${p}.webp`
    }
    
    if (f === "rlm") {
        localRelativeUrl = `/pokemon/rlm/sprites/${shiny ? "shiny" : "normal"}/forme/${p}.webp`;
    } else if (["ocean", "volcan", "ciel", "poison", "dragon"].includes(f)) {
        localRelativeUrl = `/pokemon/rlm/alternative/${f}/sprites/${shiny ? "shiny" : "normal"}/${p}.webp`;
    } else {
        // Formes de base mais potentiellement custom (Apheos, Flammiko, Galama...)
        localRelativeUrl = `/pokemon/rlm/sprites/${shiny ? "shiny" : "normal"}/${p}.webp`;
    }

    // Si on a déterminé une potentielle URL locale, on vérifie si le fichier existe physiquement
    if (localRelativeUrl) {
        try {
            const fs = await import('fs');
            const path = await import('path');
            const absolutePath = path.join(process.cwd(), 'public', localRelativeUrl);
            if (fs.existsSync(absolutePath)) {
                return localRelativeUrl;
            }
        } catch (e) {
            // Ignorer si exécuté côté client ou autre erreur
            console.warn("Could not check local file system, fallback to Showdown API");
        }
    }

    // FIN de gestion des exceptions locales -> fallback sur Showdown
    if (shiny) {
        pokemonArt = `${apiUrlShiny}${pokemonName}.png`
    } else {
        pokemonArt = `${apiUrl}${pokemonName}.png`
    }

    // On vérifie que l'image existe
    // Test 1 : avec la forme
    return fetch(pokemonArt)
        .then(res => {
            if (res.ok) {
                return pokemonArt;
            }

            // Sinon on retire la forme (ex: pikachu-mega -> pikachu)
            const baseName = pokemonName.replace(/-.*/, "");
            const pokemonArtBase = `${apiUrl}${baseName}.png`;

            // Test 2 : sans la forme
            return fetch(pokemonArtBase).then(res2 => {
                if (res2.ok) {
                    return pokemonArtBase;
                }

                // Rien trouvé → fallback
                return defaultPokemonArt;
            });
        })
        .catch(() => {
            // En cas d'erreur réseau
            return defaultPokemonArt;
        });
}
