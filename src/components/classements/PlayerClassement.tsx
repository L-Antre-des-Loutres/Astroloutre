import React, { useState } from "react";
import { slugify } from "../joueurs/joueurFormater";

/* Gestion des statistiques de joueur */
type PlayerStats = Record<string, any>;
type Props = {
    serversList: Record<string, string>;
    allData: Record<string, PlayerStats[]>;
};

const playerStats: Record<string, string> = {
    playername: "Nom du joueur",
    tmps_jeu: "Heures de jeu",
    nb_mort: "Morts",
    nb_kills: "Kills total",
    nb_playerkill: "Kills joueurs",
    nb_blocs_detr: "Blocs cassés",
    nb_blocs_pose: "Blocs posés",
    dist_total: "Distance totale",
    dist_pieds: "Distance à pied",
    dist_elytres: "Distance en elytres",
};

const columnWidths: Record<string, string> = {
    playername: "220px",
    tmps_jeu: "140px",
    nb_mort: "100px",
    nb_kills: "100px",
    nb_playerkill: "140px",
    nb_blocs_detr: "140px",
    nb_blocs_pose: "140px",
    dist_total: "120px",
    dist_pieds: "120px",
    dist_elytres: "120px",
};

/* Code pour le tableau */



/* Logique & html */
const PlayerClassement: React.FC<Props> = ({ serversList, allData }) => {
    const firstServer = Object.keys(serversList)[0] || null;
    const [selectedServer, setSelectedServer] = useState<string | null>(firstServer);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "tmps_jeu",
        direction: "desc",
    });

    const players = selectedServer ? allData[selectedServer] || [] : [];

    const sortedPlayers = [...players];
    if (sortConfig) {
        sortedPlayers.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }

    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0 sm:py-8">
            <div className="mb-6 flex flex-wrap gap-2 justify-center w-full max-w-full">
                {Object.entries(serversList).map(([id, nom]) => (
                    <button
                        key={id}
                        onClick={() => setSelectedServer(id)}
                        className={`px-4 py-2 rounded-md font-medium shadow-md transition border-2 ${
                            selectedServer === id
                                ? "bg-white"
                                : "text-white"
                        }`}
                        style={
                            selectedServer === id
                                ? {
                                    color: "#081245",
                                    borderColor: "#101550",
                                }
                                : {
                                    background: "linear-gradient(to right, #081245, #101550)",
                                    borderColor: "transparent",
                                }
                        }
                    >
                        {nom}
                    </button>
                ))}
            </div>

            <div className="w-1/1 overflow-x-auto shadow-lg rounded-xl bg-white">
                <table className="w-full text-base text-left overflow-hidden rounded-xl">
                    <thead
                        style={{
                            background: "linear-gradient(to right, #170F24, #101550)",
                        }}
                        className="text-white text-base"
                    >
                    <tr>
                        {Object.entries(playerStats).map(([key, label]) => {
                            const isActive = sortConfig?.key === key;
                            return (
                                <th
                                    key={key}
                                    onClick={() => {
                                        let direction: "asc" | "desc" = "asc";
                                        if (isActive && sortConfig?.direction === "asc") {
                                            direction = "desc";
                                        }
                                        setSortConfig({ key, direction });
                                    }}
                                    className="px-6 py-4 font-semibold cursor-pointer select-none"
                                    style={{ minWidth: columnWidths[key] }}
                                >
                                    {label} {isActive ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {players.length === 0 ? (
                        <tr>
                            <td
                                colSpan={Object.keys(playerStats).length}
                                className="text-center px-6 py-8 text-gray-500 bg-white"
                            >
                                Pas de données pour ce serveur.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr
                                key={idx}
                                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                {Object.keys(playerStats).map((key) => (
                                    <td
                                        key={key}
                                        className="px-6 py-4 whitespace-nowrap"
                                        style={{ minWidth: columnWidths[key] }}
                                    >
                                        {(() => {
                                            if (key === "playername") {
                                                return (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://mc-heads.net/avatar/${player.uuid}/28`}
                                                            alt={player.playername}
                                                            width={28}
                                                            height={28}
                                                            className="rounded-sm"
                                                        />
                                                        <span>
                                                            <a
                                                                href={`/joueurs/minecraft/${slugify(player.playername)}`}
                                                                className="text-[#101550] underline hover:text-[#101550] transition"
                                                            >
                                                              {player.playername}
                                                            </a>
                                                        </span>
                                                    </div>
                                                );
                                            } else if (key === "tmps_jeu") {
                                                const heures = Math.floor(player[key] / 72000);
                                                return <div>{heures} heures</div>;
                                            } else if (key === "nb_blocs_pose" || key === "nb_blocs_detr" || key === "dist_total" || key === "dist_pieds" || key === "dist_elytres") {
                                                return <div>{player[key]} blocs</div>;
                                            } else if (key === "morts") {
                                                return <div>${player.mort} heures</div>;
                                            } else {
                                                return player[key];
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
            {/* Version pour desktop (sm et plus) */}
            <div className="hidden sm:block text-center">
                <p className="mt-2 sm:mt-4">
                    Ces données sont mises à jour quotidiennement et ne reflètent pas les changements en temps réel.
                </p>
                <p className="mt-2">
                    Pour faire supprimer vos données, vous pouvez nous contacter sur Discord ou par e-mail à{" "}
                    <a href="mailto:arisoutre@gmail.com" style={{ textDecoration: "underline", color: "#101550" }}>
                        arisoutre@gmail.com
                    </a>.
                </p>
                <p>
                    <a href="https://perdu.com" style={{ textDecoration: "underline", color: "#101550" }}>
                        En savoir plus sur la suppression de mes données
                    </a>
                </p>
            </div>

            {/* Version pour mobile uniquement */}
            <div className="block sm:hidden text-center mt-4 mb-4">
                <p>
                    <a href="https://perdu.com" style={{ textDecoration: "underline", color: "#101550" }}>
                        En savoir plus sur l'utilisation de mes données
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PlayerClassement;
