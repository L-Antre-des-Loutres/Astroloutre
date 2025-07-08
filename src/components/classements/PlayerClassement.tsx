import React, { useState } from "react";

type PlayerStats = Record<string, any>;
type Props = {
    serversList: Record<string, string>;
    allData: Record<string, PlayerStats[]>;
};

const playerStats: Record<string, string> = {
    playername: "Nom du joueur",
    uuid: "UUID",
    tmps_jeu: "Temps de jeu",
    nb_mort: "Morts",
    nb_kills: "Kills",
    nb_playerkill: "Kills joueurs",
    nb_blocs_detr: "Blocs cassés",
    nb_blocs_pose: "Blocs posés",
    dist_total: "Dist. totale",
    dist_pieds: "Dist. à pied",
    dist_elytres: "Dist. elytres",
};

const columnWidths: Record<string, string> = {
    playername: "220px",
    uuid: "180px",
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

const PlayerClassement: React.FC<Props> = ({ serversList, allData }) => {
    const firstServer = Object.keys(serversList)[0] || null;
    const [selectedServer, setSelectedServer] = useState<string | null>(firstServer);

    const players = selectedServer ? allData[selectedServer] || [] : [];

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
                        {Object.entries(playerStats).map(([key, label]) => (
                            <th
                                key={key}
                                className="px-6 py-4 font-semibold"
                                style={{ minWidth: columnWidths[key] }}
                            >
                                {label}
                            </th>
                        ))}
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
                        players.map((player, idx) => (
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
                                        {key === "playername" ? (
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
                                                      href={`/joueurs/${encodeURIComponent(player.playername)}`}
                                                      className="text-[#101550] underline hover:text-[#101550] transition"
                                                  >
                                                    {player.playername}
                                                  </a>
                                                </span>
                                            </div>
                                        ) : (
                                            player[key]
                                        )}
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
