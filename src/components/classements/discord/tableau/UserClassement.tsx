import React, {useMemo, useState} from "react";
import {formatNumber} from "../../../../formater/NumberFormater.ts";
import {formatDecimalHoursToString} from "../../../../formater/DecimalHoursFormater.ts";
import {formatDateWithHours} from "../../../../formater/DateWithHoursFormater.ts";
import {slugify} from "../../../../formater/JoueurFormater.ts";
import {discordActivityScore} from "../../../../utils/discordActivityScore.ts";


/* Types */
type UserStats = Record<string, any>; // TODO : VIRER CE ANY

/* Props attendues */
type Props = {
    statsAllServer: UserStats[];
};

/* Colonnes et largeurs */
const userStats: Record<string, string> = {
    pseudo_discord: "Pseudo Discord",
    join_date_discord: "Date d'arrivée",
    first_activity: "Première activité",
    last_activity: "Dernière activité",
    nb_message: "Messages envoyés",
    vocal_time: "Temps en vocal",
    activity_score: "Score d'activité"
};

const columnWidths: Record<string, string> = {
    pseudo_discord: "200px",
    join_date_discord: "150px",
    first_activity: "150px",
    last_activity: "150px",
    nb_message: "150px",
    vocal_time: "150px",
    activity_score: "150px"
};

const UserClassement: React.FC<Props> = ({statsAllServer}) => {

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "activity_score",
        direction: "desc",
    });


    // tri des joueurs du serveur sélectionné 
    const sortedPlayers = useMemo(() => {
        const players = Array.isArray(statsAllServer) ? statsAllServer : [];

        // Calcul du score d'activité pour chaque joueur
        players.map(async (player) => {
            player.activity_score = await discordActivityScore(player.nb_message || 0, player.vocal_time || 0);
        });

        if (!sortConfig) return players;

        return [...players].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Dates
            if (["join_date_discord", "first_activity", "last_activity"].includes(sortConfig.key)) {
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
    }, [sortConfig, statsAllServer]);

    /* Front */
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0">
            {/* Tableau des joueurs */}
            <div className="ranking-table-container">
                <table className="ranking-table">
                    <thead className="ranking-thead">
                    <tr>
                        {Object.entries(userStats).map(([key, label]) => {
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
                                colSpan={Object.keys(userStats).length}
                                className="text-center px-6 py-8 ranking-td ranking-tr-even"
                            >
                                Pas de données discord.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(userStats).map((key) => (
                                    <td
                                        key={key}
                                        className="ranking-td"
                                        style={{minWidth: columnWidths[key]}}
                                    >
                                        {(() => {
                                            if (key === "pseudo_discord") {
                                                return (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={player.avatar_url}
                                                            alt={player.pseudo_discord}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-sm"
                                                        />
                                                        <a
                                                            href={`/profil/${slugify(player.tag_discord)}`}
                                                            className="ranking-link"
                                                        >
                                                            <span>{player[key] ?? "-"}</span>
                                                        </a>
                                                    </div>
                                                );
                                            } else if (key === "join_date_discord") {
                                                return <div>{formatDateWithHours(player[key]) === "01/01/1970 01:00" ? "Aucune activité récente" : formatDateWithHours(player[key])}</div>;
                                            } else if (key === "first_activity") {
                                                return <div>{formatDateWithHours(player[key]) === "01/01/1970 01:00" ? "Aucune activité récente" : formatDateWithHours(player[key])}</div>;
                                            } else if (key === "last_activity") {
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
