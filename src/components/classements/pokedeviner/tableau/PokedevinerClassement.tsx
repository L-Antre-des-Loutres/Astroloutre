import {useEffect, useMemo, useState} from "react";
import PocketBase from 'pocketbase';
import {formatNumber} from "../../../../formater/NumberFormater.ts";
import {formatSecondsToString} from "../../../../formater/SecondsFormater.ts";
import {slugify} from "../../../../formater/JoueurFormater.ts";
import type {DiscordUserType} from "../../../../types/UtilisateurDiscordType.ts";
import type {PokedevinerStatType} from "../../../../types/PokedevinerStatsType.ts";
import {PB_URL, POKEDEVINER_STATS} from "../../../../utils/constantes.ts";


/* Types */
type PlayerWithPokedevinerStats = DiscordUserType & {
    games_played: number;
    games_won: number;
    avg_tries: number;
    best_try: number;
    avg_time: number;
    [key: string]: any;
};

/* Props attendues */
type Props = {
    users: DiscordUserType[];
    stats?: PokedevinerStatType[];
};

/* Colonnes et largeurs */
const pokedevinerStatsConfig: Record<string, string> = {
    username: "Joueur",
    games_won: "Parties gagnées",
    games_played: "Parties jouées",
    avg_tries: "Essais moyens",
    best_try: "Meilleur score",
    avg_time: "Temps moyen",
};

const columnWidths: Record<string, string> = {
    username: "220px",
    games_won: "150px",
    games_played: "150px",
    avg_tries: "150px",
    best_try: "150px",
    avg_time: "150px",
};

// Détermine l'année d'une partie à partir de start_at (fallback : created)
function getStatYear(stat: PokedevinerStatType): string | null {
    const raw = stat.start_at || stat.created;
    if (!raw) return null;
    const year = new Date(raw).getFullYear();
    if (isNaN(year)) return null;
    return year.toString();
}

const PokedevinerClassement: React.FC<Props> = ({users = [], stats: initialStats = []}) => {

    const [stats, setStats] = useState<PokedevinerStatType[]>(initialStats);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedYear, setSelectedYear] = useState<string>("all");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const pb = new PocketBase(PB_URL);
                const records = await pb.collection(POKEDEVINER_STATS).getFullList<PokedevinerStatType>({
                    fields: 'discord_user,start_at,success_at,nb_try,created',
                });
                setStats(records);
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "games_won",
        direction: "desc",
    });

    // Années disponibles dans les données
    const years = useMemo(() => {
        const _years = new Set<string>();
        if (Array.isArray(stats)) {
            stats.forEach((s) => {
                const y = getStatYear(s);
                if (y) _years.add(y);
            });
        }
        return Array.from(_years).sort((a, b) => b.localeCompare(a));
    }, [stats]);

    // Agrégation des parties par joueur, puis tri
    const sortedPlayers = useMemo(() => {
        if (!Array.isArray(users) || !Array.isArray(stats)) return [];

        // Map id PocketBase -> utilisateur Discord
        const usersById = new Map<string, DiscordUserType>();
        users.forEach((u) => usersById.set(u.id, u));

        type Agg = {
            games_played: number;
            games_won: number;
            total_tries: number;
            best_try: number;
            total_time: number;   // secondes cumulées (parties gagnées chronométrées)
            timed_games: number;  // nombre de parties chronométrées
        };
        const aggMap = new Map<string, Agg>();

        stats.forEach((stat) => {
            if (!stat.discord_user) return;

            // Filtre par année
            if (selectedYear !== "all") {
                const y = getStatYear(stat);
                if (y !== selectedYear) return;
            }

            const agg = aggMap.get(stat.discord_user) || {
                games_played: 0,
                games_won: 0,
                total_tries: 0,
                best_try: Infinity,
                total_time: 0,
                timed_games: 0,
            };

            agg.games_played += 1;

            // Une partie est gagnée (terminée) si elle a une date de succès
            const won = Boolean(stat.success_at);
            if (won) {
                agg.games_won += 1;

                const tries = Number(stat.nb_try) || 0;
                agg.total_tries += tries;
                if (tries > 0 && tries < agg.best_try) agg.best_try = tries;

                // Durée de résolution
                const start = stat.start_at ? new Date(stat.start_at).getTime() : NaN;
                const end = stat.success_at ? new Date(stat.success_at).getTime() : NaN;
                if (!isNaN(start) && !isNaN(end) && end > start) {
                    agg.total_time += (end - start) / 1000;
                    agg.timed_games += 1;
                }
            }

            aggMap.set(stat.discord_user, agg);
        });

        // Construction de la liste des joueurs
        const players: PlayerWithPokedevinerStats[] = [];
        aggMap.forEach((agg, pbId) => {
            const user = usersById.get(pbId);
            if (!user || agg.games_played <= 0) return;

            // Le temps moyen est calculé UNIQUEMENT sur les parties terminées et chronométrées.
            // Les parties non finies (timeout, sans date de succès) sont simplement ignorées :
            // elles ne doivent PAS masquer le temps moyen déjà acquis sur les parties gagnées.
            const avg_time = agg.timed_games > 0 ? agg.total_time / agg.timed_games : 0;

            players.push({
                ...user,
                games_played: agg.games_played,
                games_won: agg.games_won,
                avg_tries: agg.games_won > 0 ? agg.total_tries / agg.games_won : 0,
                best_try: agg.best_try === Infinity ? 0 : agg.best_try,
                avg_time,
            });
        });

        // Tri
        return [...players].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Nombres
            if (["games_played", "games_won", "avg_tries", "best_try", "avg_time"].includes(sortConfig.key)) {
                aVal = Number(aVal) || 0;
                bVal = Number(bVal) || 0;
            }
            // Chaînes
            else {
                aVal = aVal ? String(aVal).toLowerCase() : "";
                bVal = bVal ? String(bVal).toLowerCase() : "";
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [sortConfig, users, stats, selectedYear]);

    /* Front */
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
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent">
                        <div className="w-12 h-12 border-4 border-white/80 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
                        <span className="text-white font-semibold tracking-wider text-sm bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm shadow-lg">Chargement...</span>
                    </div>
                )}
                <table className={`ranking-table transition-all duration-300 ${isLoading ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
                    <thead className="ranking-thead">
                    <tr>
                        {Object.entries(pokedevinerStatsConfig).map(([key, label]) => {
                            const isActive = sortConfig?.key === key;
                            return (
                                <th
                                    key={key}
                                    onClick={() => {
                                        let direction: "asc" | "desc" = "desc";
                                        if (isActive && sortConfig?.direction === "desc") {
                                            direction = "asc";
                                        }
                                        setSortConfig({key, direction});
                                    }}
                                    className="ranking-th"
                                    style={{minWidth: columnWidths[key]}}
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
                                colSpan={Object.keys(pokedevinerStatsConfig).length}
                                className="text-center px-6 py-8 ranking-td ranking-tr-even"
                            >
                                Pas de données Pokedeviner.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(pokedevinerStatsConfig).map((key) => (
                                    <td
                                        key={key}
                                        className="ranking-td"
                                        style={{minWidth: columnWidths[key]}}
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
                                            } else if (key === "games_won") {
                                                return <div>{`${formatNumber(player.games_won)} ${player.games_won > 1 ? "parties" : "partie"}`}</div>;
                                            } else if (key === "games_played") {
                                                return <div>{`${formatNumber(player.games_played)} ${player.games_played > 1 ? "parties" : "partie"}`}</div>;
                                            } else if (key === "avg_tries") {
                                                const rounded = Math.round(player.avg_tries);
                                                return <div>{rounded > 0 ? `${rounded} ${rounded > 1 ? "essais" : "essai"}` : "—"}</div>;
                                            } else if (key === "best_try") {
                                                return <div>{player.best_try > 0 ? `${player.best_try} ${player.best_try > 1 ? "essais" : "essai"}` : "—"}</div>;
                                            } else if (key === "avg_time") {
                                                return <div>{formatSecondsToString(player.avg_time)}</div>;
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
                    Cliquez sur une colonne pour trier le classement. Le « meilleur score » correspond à la partie
                    gagnée avec le moins d'essais.
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

export default PokedevinerClassement;
