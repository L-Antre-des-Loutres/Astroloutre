/**
 * Renvoie le nom du pokémon quand on envoie cobblemon:<nom du pokémon> ou pixelmon:<nom du pokémon>
 *
 * Ex: cobblemon:pikachu -> Pikachu
 *     pixelmon:charizard -> Dracaufeu
 *
 * @param name
 */
export function formatPokemonName(name: string): string {
    if (!name) return name;
    if (!name.startsWith("cobblemon:") && !name.startsWith("pixelmon:")) return name;

    const pokemonName = name.split(":")[1];
    if (!pokemonName) return name;
    return pokemonName;
}