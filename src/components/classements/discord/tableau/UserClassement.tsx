import React, {useMemo, useState} from "react";
import {formatNumber} from "../../../../formater/NumberFormater.ts";
import {formatDecimalHoursToString} from "../../../../formater/DecimalHoursFormater.ts";
import {formatDateWithHours} from "../../../../formater/DateWithHoursFormater.ts";
import {slugify} from "../../../../formater/JoueurFormater.ts";
import type {DiscordUserStatsType, DiscordUserType} from "../../../../types/UtilisateurDiscordType.ts";
import {discordActivityScore} from "../../../../utils/discordActivityScore.ts";


/* Types */
type UserWithStats = DiscordUserType & {
    nb_message: number;
    vocal_time: number;
    activity_score?: number;
    [key: string]: any;
};

/* Props attendues */
type Props = {
    users: DiscordUserType[];
    stats: DiscordUserStatsType[];
    jeu?: string;
};

/* Colonnes et largeurs */
const userStatsConfig: Record<string, string> = {
    username: "Pseudo Discord",
    joined_at: "Date d'arrivée",
    first_active_at: "Première activité",
    last_active_at: "Dernière activité",
    nb_message: "Messages envoyés",
    vocal_time: "Temps en vocal",
    activity_score: "Score d'activité"
};

const columnWidths: Record<string, string> = {
    username: "200px",
    joined_at: "150px",
    first_active_at: "150px",
    last_active_at: "150px",
    nb_message: "150px",
    vocal_time: "150px",
    activity_score: "150px"
};

const UserClassement: React.FC<Props> = ({users, stats}) => {

    const [selectedYear, setSelectedYear] = useState<string>("all");

    // Extract unique years from stats
    /**
     * Valid year = ##/##/####
     */
    const years = useMemo(() => {
        const _years = new Set<string>();
        if (Array.isArray(stats)) {
            stats.forEach(s => {
                if (s.date_stats) {
                    // Parse DD/MM/YYYY format
                    const parts = s.date_stats.split('/');
                    if (parts.length === 3) {
                        const year = parts[2]; // Year is the third part
                        // Validate year (4 digits)
                        if (year && year.length === 4 && !isNaN(Number(year))) {
                            _years.add(year);
                        }
                    }
                }
            });
        }

        // Always add 2025 if we have any stats, to count all stats for the entire year
        if (stats && stats.length > 0) {
            _years.add("2025");
        }

        return Array.from(_years).sort((a, b) => b.localeCompare(a));
    }, [stats]);
    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "activity_score",
        direction: "desc",
    });


    // tri des joueurs du serveur sélectionné
    const sortedPlayers = useMemo(() => {
        if (!Array.isArray(users) || !Array.isArray(stats)) return [];

        // 1. Aggregate stats based on selectedYear
        const statsMap = new Map<number, { nb_message: number; vocal_time: number }>();

        stats.forEach((stat) => {
            // Parse DD/MM/YYYY format correctly
            let statYear: string;
            if (stat.date_stats) {
                const parts = stat.date_stats.split('/');
                if (parts.length === 3) {
                    statYear = parts[2]; // Year is the third part
                } else {
                    // Fallback to trying Date constructor if format is different
                    statYear = new Date(stat.date_stats).getFullYear().toString();
                }
            } else {
                return; // Skip this stat if no date
            }

            if (selectedYear === "all" || statYear === selectedYear) {
                const current = statsMap.get(stat.id_utilisateur) || {nb_message: 0, vocal_time: 0};
                statsMap.set(stat.id_utilisateur, {
                    nb_message: current.nb_message + (Number(stat.nb_message) || 0),
                    vocal_time: current.vocal_time + (Number(stat.vocal_time) || 0),
                });
            }
        });

        // 2. Merge with users and calculate scores
        const players: UserWithStats[] = users.map((user) => {
            const userStats = statsMap.get(user.id) || {nb_message: 0, vocal_time: 0};
            return {
                ...user,
                nb_message: userStats.nb_message,
                vocal_time: userStats.vocal_time,
            };
        }).filter(p => p.nb_message > 0 || p.vocal_time > 0);

        // Calcul du score d'activité pour chaque joueur
        // Recalcul manuel du score pour éviter les promesses dans le sort/useMemo
        const calculateScore = (msg: number, vocal: number) => {
            return discordActivityScore(msg, vocal);
        };

        players.forEach(p => {
            p.activity_score = calculateScore(p.nb_message, p.vocal_time);
        });


        if (!sortConfig) return players;

        return [...players].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Dates
            if (["joined_at", "first_active_at", "last_active_at"].includes(sortConfig.key)) {
                aVal = aVal ? new Date(aVal).getTime() : 0;
                bVal = bVal ? new Date(bVal).getTime() : 0;
            }
            // Nombres
            else if (["nb_message", "vocal_time", "activity_score"].includes(sortConfig.key)) {
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
            <div className="ranking-table-container">
                <table className="ranking-table">
                    <thead className="ranking-thead">
                    <tr>
                        {Object.entries(userStatsConfig).map(([key, label]) => {
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
                                colSpan={Object.keys(userStatsConfig).length}
                                className="text-center px-6 py-8 ranking-td ranking-tr-even"
                            >
                                Pas de données discord.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(userStatsConfig).map((key) => (
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
                                                            src={player.avatar_url}
                                                            alt={player.username}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-sm"
                                                        />
                                                        <a
                                                            href={`/profil/${slugify(player.discord_tag)}`}
                                                            className="ranking-link"
                                                        >
                                                            <span>{player[key] ?? "-"}</span>
                                                        </a>
                                                    </div>
                                                );
                                            } else if (key === "joined_at") {
                                                return <div>{formatDateWithHours(player[key]) === "01/01/1970 01:00" ? "Aucune activité récente" : formatDateWithHours(player[key])}</div>;
                                            } else if (key === "first_active_at") {
                                                return <div>{formatDateWithHours(player[key]) === "01/01/1970 01:00" ? "Aucune activité récente" : formatDateWithHours(player[key])}</div>;
                                            } else if (key === "last_active_at") {
                                                return <div>{formatDateWithHours(player[key]) === "01/01/1970 01:00" ? "Aucune activité récente" : formatDateWithHours(player[key])}</div>;
                                            } else if (key === "vocal_time") {
                                                return <div>{!player[key] ? "Aucun temps" : formatDecimalHoursToString(player[key])}</div>;
                                            } else if (key === "nb_message") {
                                                return <div>{!player[key] ? "Aucun message" : `${formatNumber(player[key])} ${player[key] > 1 ? "messages" : "message"}`}</div>;
                                            } else if (key === "activity_score") {
                                                return <div>{!player[key] ? "Aucun score d'activité" : `${formatNumber(player[key])} ${player[key] > 1 ? "points" : "point"}`}</div>
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
                    Ces données sont mises à jour quotidiennement et ne reflètent pas les changements en temps réel.
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
                    <a href="https://perdu.com" className="ranking-link">
                        En savoir plus sur l'utilisation de mes données
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UserClassement;
