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

    if (forme.toLowerCase() !== "normal" && forme.toLowerCase() !== "rlm") {
        pokemonName = pokemonName + "-" + forme.toLowerCase()
    }

    // Gestion des exceptions
    if (pokemonName.toLowerCase() === "flammiko") {
        return pokemonArt = "/pokemon/rlm/sprites/normal/flammiko.webp"
    }
    if (pokemonName.toLowerCase() === "flammiko" && shiny) {
        return pokemonArt = "/pokemon/rlm/sprites/shiny/flammiko.webp"
    }
    if (forme.toLowerCase() === "rlm") {
        return pokemonArt = "/pokemon/rlm/sprites/normal/forme/" + pokemonName.toLowerCase() + ".webp"
    }

    if (forme.toLowerCase() === "rlm" && shiny) {
        return pokemonArt = "/pokemon/rlm/sprites/shiny/forme/" + pokemonName.toLowerCase() + ".webp"
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
