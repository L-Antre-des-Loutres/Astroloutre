const fs = require('fs');
const path = require('path');

const DATAPACK_PATH = "C:\\Users\\perod\\AppData\\Roaming\\ModrinthApp\\profiles\\Cobblemon DEV\\saves\\DEV\\datapacks\\Cobblemon-RLM\\data\\cobblemon";
const OUTPUT_DIR = path.join(__dirname, "src", "data", "pokemon");

// Assure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function camelToHuman(str) {
    if (!str) return "Inconnu";
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

function getTypeTransl(typeStr) {
    if (!typeStr) return undefined;
    const types = {
        "normal": "Normal", "fire": "Feu", "water": "Eau", "electric": "Électrik", "grass": "Plante",
        "ice": "Glace", "fighting": "Combat", "poison": "Poison", "ground": "Sol", "flying": "Vol",
        "psychic": "Psy", "bug": "Insecte", "rock": "Roche", "ghost": "Spectre", "dragon": "Dragon",
        "dark": "Ténèbres", "steel": "Acier", "fairy": "Fée"
    };
    return types[typeStr.toLowerCase()] || camelToHuman(typeStr);
}

function processFolder(folderPath) {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
    const pokemons = [];

    for (const file of files) {
        const fullPath = path.join(folderPath, file);
        try {
            const rawData = fs.readFileSync(fullPath, 'utf8');
            const cobblemonData = JSON.parse(rawData);

            // Gérer "target" (pour species_additions) ou "name" (pour species/custom)
            const baseName = cobblemonData.name || (cobblemonData.target ? cobblemonData.target.replace('cobblemon:', '') : file.replace('.json', ''));
            const slug = baseName.toLowerCase();

            // Si c'est un addition, chercher la form RLM si elle existe
            let formData = cobblemonData;
            if (cobblemonData.forms && Array.isArray(cobblemonData.forms)) {
                const rlmForm = cobblemonData.forms.find(f => f.name === 'rlm' || f.name === 'apheos');
                if (rlmForm) formData = rlmForm;
            }

            const id = cobblemonData.nationalPokedexNumber ? cobblemonData.nationalPokedexNumber.toString().padStart(3, '0') : "000";

            // Types
            const types = [];
            if (formData.primaryType) types.push(getTypeTransl(formData.primaryType));
            if (formData.secondaryType) types.push(getTypeTransl(formData.secondaryType));

            // Default stats
            const stats = formData.baseStats || { hp: 0, attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0 };

            // Default moves
            const allRawMoves = formData.moves || [];

            // Apprises par niveau (ex: "1:tackle")
            const levelMovesRaw = allRawMoves.filter(m => m.includes(':') && !isNaN(parseInt(m.split(':')[0])));
            const formattedLevelMoves = levelMovesRaw.map(m => {
                const parts = m.split(':');
                return { name: camelToHuman(parts[1]), level: `N.${parts[0]}` };
            });

            // Apprises par CT / TM (ex: "tm:protect")
            const tmMovesRaw = allRawMoves.filter(m => m.startsWith('tm:'));
            const formattedTmMoves = tmMovesRaw.map(m => {
                const parts = m.split(':');
                return { name: camelToHuman(parts[1]), ct: "CT" }; // On ne connait pas le numéro exact de CT depuis Cobblemon
            });

            // Construction du modèle website
            const websiteModel = {
                id: id,
                slug: slug,
                name: camelToHuman(baseName) + (formData.name === 'rlm' ? ' RLM' : ''),
                category: "Pokémon Inconnu", // Placeholder
                pageColor: "#666666",
                bannerUrl: "https://champions.pokemon.com/_images/global/header/header-lg.jpg",
                types: types.length > 0 ? types : ["Normal"],
                abilities: (formData.abilities || []).map(a => camelToHuman(a.replace('h:', ''))),
                stats: {
                    hp: stats.hp || 0,
                    attack: stats.attack || 0,
                    defense: stats.defence || 0,
                    specialAttack: stats.special_attack || 0,
                    specialDefense: stats.special_defence || 0,
                    speed: stats.speed || 0
                },
                evolutions: [], // TODO: Parse evolutions from base if needed
                movesets: {
                    by_level: formattedLevelMoves.length > 0 ? formattedLevelMoves : [{ name: "Charge", level: "Départ" }],
                    by_tm: formattedTmMoves,
                    by_breeding: []
                },
                locations: [
                    { game: "Cobblemon RLM", location: "Biome à définir" }
                ],
                pokedex_entries: [
                    { game: "Cobblemon RLM", description: formData.pokedex ? formData.pokedex[0] : "Description manquante..." }
                ],
                about: "",
                images: []
            };

            pokemons.push(websiteModel);

        } catch (e) {
            console.error(`Erreur lecture ${file}:`, e.message);
        }
    }
    return pokemons;
}

// Lancer le calcul
console.log("Lecture des fichiers dans le datapack...");
let allPokemon = [];
allPokemon = allPokemon.concat(processFolder(path.join(DATAPACK_PATH, "species_additions")));
allPokemon = allPokemon.concat(processFolder(path.join(DATAPACK_PATH, "species", "custom")));

// Générer l'objet de navigation
console.log(`Génération des liens de navigation pour ${allPokemon.length} Pokémon...`);
allPokemon.sort((a, b) => a.name.localeCompare(b.name));

for (let i = 0; i < allPokemon.length; i++) {
    const current = allPokemon[i];
    const prev = allPokemon[i === 0 ? allPokemon.length - 1 : i - 1];
    const next = allPokemon[i === allPokemon.length - 1 ? 0 : i + 1];

    current.navigation = {
        previous: { name: prev.name, slug: prev.slug, image: "/pokeball.png" }, // Image placeholder car non fournie
        current: { name: current.name, slug: current.slug, image: "/pokeball.png" },
        next: { name: next.name, slug: next.slug, image: "/pokeball.png" }
    };

    // Ecrire le fichier JSON final
    const filePath = path.join(OUTPUT_DIR, `${current.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf8');
}

console.log(`${allPokemon.length} Pokémon crées et enregistrés avec succès dans src/data/pokemon/ !`);
