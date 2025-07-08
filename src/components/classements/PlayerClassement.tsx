// Composant : ClassementGetDatas.tsx

import React, { useState } from "react";

type PlayerStats = Record<string, any>;
type Props = {
    serversList: Record<string, string>;
    allData: Record<string, PlayerStats[]>;
};

const playerStats: Record<string, string> = {
    playername: "Nom du joueur",
    uuid: "UUID du joueur",
    tmps_jeu: "Temps de jeu",
    nb_mort: "Nombre de morts",
    nb_kills: "Nombre de kills",
    nb_playerkill: "Kills de joueurs",
    nb_blocs_detr: "Blocs cassés",
    nb_blocs_pose: "Blocs posés",
    dist_total: "Distance totale",
    dist_pieds: "Distance à pied",
    dist_elytres: "Distance en elytres",
};

const PlayerClassement: React.FC<Props> = ({ serversList, allData }) => {
    const firstServer = Object.keys(serversList)[0] || null;
    const [selectedServer, setSelectedServer] = useState<string | null>(firstServer);

    const players = selectedServer ? allData[selectedServer] || [] : [];

    return (
        <div className="p-4">
            <div className="flex gap-2 mb-4">
                {Object.entries(serversList).map(([id, nom]) => (
                    <button
                        key={id}
                        onClick={() => setSelectedServer(id)}
                        className={`px-4 py-2 rounded ${
                            selectedServer === id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        {nom}
                    </button>
                ))}
            </div>

            <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                <tr>
                    {Object.values(playerStats).map((label) => (
                        <th key={label} className="border px-2 py-1">
                            {label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {players.length === 0 ? (
                    <tr>
                        <td colSpan={Object.keys(playerStats).length} className="text-center p-4">
                            Pas de données pour ce serveur.
                        </td>
                    </tr>
                ) : (
                    players.map((player, idx) => (
                        <tr key={idx} className="even:bg-gray-50">
                            {Object.keys(playerStats).map((key) => (
                                <td key={key} className="border px-2 py-1">
                                    {player[key]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerClassement;
