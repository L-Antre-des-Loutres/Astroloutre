import {useMemo, useState} from "react";
import {formatNumber} from "../../../../../formater/NumberFormater.ts";
import {formatSecondsToString} from "../../../../../formater/SecondsFormater.ts";
import {slugify} from "../../../../../formater/JoueurFormater.ts";
import type {DiscordUserType} from "../../../../../types/UtilisateurDiscordType.ts";
import type {PokeSilhouetteScoreType, PokeSilhouetteGameType} from "../../../../../types/PokeSilhouetteStatsType.ts";

/* Types */
type PlayerWithPokeSilhouetteStats = DiscordUserType & {
    games_found: number;
    games_won: number;
    avg_time: number;
    best_time: number;
    [key: string]: any;
};

/* Props attendues */
type Props = {
    users: DiscordUserType[];
    scores: PokeSilhouetteScoreType[];
    games: PokeSilhouetteGameType[];
};

/* Colonnes et largeurs */
const pokeSilhouetteStatsConfig: Record<string, string> = {
    username: "Joueur",
    games_found: "Parties trouvées",
    games_won: "Parties gagnées",
    avg_time: "Temps moyen",
    best_time: "Meilleur temps",
};

const columnWidths: Record<string, string> = {
    username: "220px",
    games_found: "150px",
    games_won: "150px",
    avg_time: "150px",
    best_time: "150px",
};

// Détermine l'année d'une partie à partir de la date de création (du jeu en priorité, sinon du score)
function getStatYear(score: PokeSilhouetteScoreType, gamesById: Map<string, PokeSilhouetteGameType>): string | null {
    const game = gamesById.get(score.game);
    const raw = game?.started_at || game?.created || score.created;
    if (!raw) return null;
    const year = new Date(raw).getFullYear();
    if (isNaN(year)) return null;
    return year.toString();
}

const PokeSilhouetteClassement: React.FC<Props> = ({users = [], scores: initialScores = [], games = []}) => {
    const scores = initialScores;
    const [selectedYear, setSelectedYear] = useState<string>("all");

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "games_found",
        direction: "desc",
    });

    const gamesById = useMemo(() => {
        const map = new Map<string, PokeSilhouetteGameType>();
        games.forEach(g => map.set(g.id, g));
        return map;
    }, [games]);

    // Années disponibles dans les données
    const years = useMemo(() => {
        const _years = new Set<string>();
        if (Array.isArray(scores)) {
            scores.forEach((s) => {
                const y = getStatYear(s, gamesById);
                if (y) _years.add(y);
            });
        }
        return Array.from(_years).sort((a, b) => b.localeCompare(a));
    }, [scores, gamesById]);

    // Agrégation des parties par joueur, puis tri
    const sortedPlayers = useMemo(() => {
        if (!Array.isArray(users) || !Array.isArray(scores)) return [];

        // Map id PocketBase -> utilisateur Discord
        const usersById = new Map<string, DiscordUserType>();
        users.forEach((u) => usersById.set(u.id, u));

        type Agg = {
            games_found: number;
            games_won: number;
            total_time: number;
            best_time: number;
        };
        const aggMap = new Map<string, Agg>();

        scores.forEach((score) => {
            if (!score.discord_user) return;

            // Filtre par année
            if (selectedYear !== "all") {
                const y = getStatYear(score, gamesById);
                if (y !== selectedYear) return;
            }

            const agg = aggMap.get(score.discord_user) || {
                games_found: 0,
                games_won: 0,
                total_time: 0,
                best_time: Infinity,
            };

            agg.games_found += 1;
            
            if (score.rank === 1) {
                agg.games_won += 1;
            }

            const time = Number(score.elapsed_ms) || 0;
            if (time > 0) {
                agg.total_time += time;
                if (time < agg.best_time) agg.best_time = time;
            }

            aggMap.set(score.discord_user, agg);
        });

        // Construction de la liste des joueurs
        const players: PlayerWithPokeSilhouetteStats[] = [];
        aggMap.forEach((agg, pbId) => {
            const user = usersById.get(pbId);
            if (!user || agg.games_found <= 0) return;

            const avg_time = agg.games_found > 0 ? agg.total_time / agg.games_found : 0;

            players.push({
                ...user,
                games_found: agg.games_found,
                games_won: agg.games_won,
                avg_time: avg_time,
                best_time: agg.best_time === Infinity ? 0 : agg.best_time,
            });
        });

        // Application du tri
        players.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Remplacer les valeurs nulles par Infinity pour les tris de temps ou rang si on tri croissant (pour les mettre en bas)
            if (sortConfig.key === "best_time" || sortConfig.key === "avg_time") {
                if (valA === 0) valA = Infinity;
                if (valB === 0) valB = Infinity;
            }

            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return players;
    }, [users, scores, gamesById, sortConfig, selectedYear]);

    // Changement du tri (au clic sur une colonne)
    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "desc";
        if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "asc";
        }
        // Pour les temps (best_time / avg_time) et le rang (avg_rank), on inverse la logique :
        // Un petit chiffre est meilleur, donc le 1er clic trie en croissant (asc).
        if (sortConfig.key !== key && (key === "best_time" || key === "avg_time")) {
            direction = "asc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0">

            {/* Filtre Année */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        key="all"
                        onClick={() => setSelectedYear("all")}
                        className={`ranking-filter-button ${selectedYear === "all" ? "active" : "inactive"}`}
                    >
                        Toutes les années
                    </button>
                    {years.map(y => (
                        <button
                            key={y}
                            onClick={() => setSelectedYear(y)}
                            className={`ranking-filter-button ${selectedYear === y ? "active" : "inactive"}`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tableau des joueurs */}
            <div className="ranking-table-container relative">
                <table className="ranking-table">
                    <thead className="ranking-thead">
                    <tr>
                        {Object.entries(pokeSilhouetteStatsConfig).map(([key, label]) => {
                            const isActive = sortConfig?.key === key;
                            return (
                                <th
                                    key={key}
                                    onClick={() => requestSort(key)}
                                    className="ranking-th"
                                    style={{minWidth: columnWidths[key] || "auto"}}
                                >
                                    {label} {isActive ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {!Array.isArray(sortedPlayers) || sortedPlayers.length === 0 ? (
                        <tr>
                            <td
                                colSpan={Object.keys(pokeSilhouetteStatsConfig).length}
                                className="text-center px-6 py-8 ranking-td ranking-tr-even"
                            >
                                Pas de données Poke-Silhouette.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={player.id} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(pokeSilhouetteStatsConfig).map((key) => (
                                    <td
                                        key={`${player.id}-${key}`}
                                        className="ranking-td"
                                        style={{minWidth: columnWidths[key] || "auto"}}
                                    >
                                        {(() => {
                                            if (key === "username") {
                                                return (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={player.avatar_url || ""}
                                                            alt={player.username || "Inconnu"}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-sm"
                                                        />
                                                        <a
                                                            href={`/profil/${slugify(player.discord_tag)}`}
                                                            className="ranking-link"
                                                        >
                                                            <span>{player.username ?? "-"}</span>
                                                        </a>
                                                    </div>
                                                );
                                            } else if (key === "games_found") {
                                                return <div>{`${formatNumber(player.games_found)}`}</div>;
                                            } else if (key === "games_won") {
                                                return <div>{`${formatNumber(player.games_won)}`}</div>;
                                            } else if (key === "avg_time" || key === "best_time") {
                                                return <div>{formatSecondsToString(player[key] / 1000)}</div>;
                                            } else {
                                                return player[key] ?? "-";
                                            }
                                        })()}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Infos */}
            <div className="hidden sm:block text-center ranking-info-text">
                <p className="mt-2 sm:mt-4">
                    Cliquez sur une colonne pour trier le classement.
                </p>
                <p className="mt-2">
                    Ces données sont mises à jour au chargement de la page.
                </p>
                <p className="mt-2">
                    Pour faire supprimer vos données, vous pouvez nous contacter sur Discord ou par e-mail à{" "}
                    <a href="mailto:arisoutre@gmail.com" className="ranking-link">
                        arisoutre@gmail.com
                    </a>
                    .
                </p>
                <p>
                    <a href="/donnees" className="ranking-link">
                        En savoir plus sur la suppression de mes données
                    </a>
                </p>
            </div>

            <div className="block sm:hidden text-center mt-4 mb-4 ranking-info-text">
                <p>
                    <a href="/donnees" className="ranking-link">
                        En savoir plus sur l'utilisation de mes données
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PokeSilhouetteClassement;
