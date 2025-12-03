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
    const formesSpeciales = ["normal", "rlm", "ocean", "volcan", "ciel"];
    if (!formesSpeciales.includes(f)) {
        pokemonName = `${p}-${f}`;
    }

    // Gestion des exceptions
    // 1. Exception absolue : Flammiko
    if (p === "flammiko") {
        return pokemonArt = `/pokemon/rlm/sprites/${shiny ? "shiny" : "normal"}/flammiko.webp`;
    }

    // 2. Forme RLM
    if (f === "rlm") {
        return pokemonArt = `/pokemon/rlm/sprites/${shiny ? "shiny" : "normal"}/forme/${p}.webp`;
    }

    // 3. Formes alternatives (océan / volcan / ciel)
    const formesAlt = ["ocean", "volcan", "ciel"];
    if (formesAlt.includes(f)) {
        return pokemonArt = `/pokemon/rlm/alternative/${f}/sprites/${shiny ? "shiny" : "normal"}/${p}.png`;
    }

    // FIN de gestion des exceptions
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
