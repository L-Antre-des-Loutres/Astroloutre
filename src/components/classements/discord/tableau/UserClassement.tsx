import React, {useState} from "react";
import {formatNumber} from "../../../formater/NumberFormater.ts";
import {formatDecimalHours} from "../../../formater/DecimalHoursFormater.ts";


/* Types */
type UserStats = Record<string, any>;

/* Props attendues */
type Props = {
    statsAllServer: Record<string, UserStats[]>;
};

/* Colonnes et largeurs */
const userStats: Record<string, string> = {
    pseudo_discord: "Pseudo Discord",
    join_date_discord: "Date d'arrivée",
    first_activity: "Première activité",
    last_activity: "Dernière activité",
    nb_message: "Messages envoyés",
    vocal_time: "Temps en vocal",
};

const columnWidths: Record<string, string> = {
    pseudo_discord: "200px",
    join_date_discord: "150px",
    first_activity: "150px",
    last_activity: "150px",
    nb_message: "150px",
    vocal_time: "150px"
};

const UserClassement: React.FC<Props> = ({statsAllServer}) => {

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "nb_message",
        direction: "desc",
    });

    // tri des joueurs du serveur sélectionné
    const sortedPlayers = statsAllServer

    /* Front */
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0 sm:py-8">
            {/* Tableau des joueurs */}
            <div className="w-1/1 overflow-x-auto shadow-lg rounded-xl bg-white">
                <table className="w-full text-base text-left overflow-hidden rounded-xl">
                    <thead
                        style={{
                            background: "linear-gradient(to right, #333, #333, #5a1a00)",
                        }}
                        className="text-white text-base"
                    >
                    <tr>
                        {Object.entries(userStats).map(([key, label]) => {
                            const isActive = sortConfig?.key === key;
                            return (
                                <th
                                    key={key}
                                    onClick={() => {
                                        let direction: "asc" | "desc" = "asc";
                                        if (isActive && sortConfig?.direction === "asc") {
                                            direction = "desc";
                                        }
                                        setSortConfig({key, direction});
                                    }}
                                    className="px-6 py-4 font-semibold cursor-pointer select-none"
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
                                className="text-center px-6 py-8 text-gray-500 bg-white"
                            >
                                Pas de données pour ce serveur.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {Object.keys(userStats).map((key) => (
                                    <td
                                        key={key}
                                        className="px-6 py-4 whitespace-nowrap"
                                        style={{minWidth: columnWidths[key]}}
                                    >
                                        {(() => {
                                            if (key === "pseudo_discord") {
                                                return (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={player.avatar_url}
                                                            alt={player.pseudo_discord}
                                                            width={28}
                                                            height={28}
                                                            className="rounded-sm"
                                                        />
                                                        <span>{player[key] ?? "-"}</span>
                                                    </div>
                                                );
                                            } else if (key === "vocal_time") {
                                                return <div>{formatDecimalHours(player[key] || 0)} heures</div>;
                                            } else if (key === "nb_message") {
                                                return <div>{formatNumber(player[key] || 0)}</div>;
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
            <div className="hidden sm:block text-center">
                <p className="mt-2 sm:mt-4">
                    Ces données sont mises à jour quotidiennement et ne reflètent pas les changements en temps réel.
                </p>
                <p className="mt-2">
                    Pour faire supprimer vos données, vous pouvez nous contacter sur Discord ou par e-mail à{" "}
                    <a href="mailto:arisoutre@gmail.com" style={{textDecoration: "underline", color: "#101550"}}>
                        arisoutre@gmail.com
                    </a>
                    .
                </p>
                <p>
                    <a href="/donnees" style={{textDecoration: "underline", color: "#101550"}}>
                        En savoir plus sur la suppression de mes données
                    </a>
                </p>
            </div>

            <div className="block sm:hidden text-center mt-4 mb-4">
                <p>
                    <a href="https://perdu.com" style={{textDecoration: "underline", color: "#101550"}}>
                        En savoir plus sur l'utilisation de mes données
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UserClassement;
