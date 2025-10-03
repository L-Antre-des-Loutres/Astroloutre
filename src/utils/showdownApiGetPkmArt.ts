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
    return fetch(pokemonArt).then(res => {
        if (res.ok) {
            return pokemonArt
        } else {
            // On renvoie une image de clone
            return defaultPokemonArt
        }
    }).catch(() => {
        return defaultPokemonArt
    })
}