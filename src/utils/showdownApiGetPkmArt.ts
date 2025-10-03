const apiUrl = "https://play.pokemonshowdown.com/sprites/home/"
const apiUrlShiny = "https://play.pokemonshowdown.com/sprites/home-shiny/"
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
        return pokemonArt = "/pokemon/rlm/flammiko.webp"
    }
    if (forme.toLowerCase() === "rlm") {
        return pokemonArt = "/pokemon/rlm/forme/" + pokemonName.toLowerCase() + ".webp"
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