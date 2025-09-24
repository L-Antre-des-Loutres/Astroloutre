import React, {useMemo, useState} from "react";
import {slugify} from "../../../../formater/JoueurFormater.ts";
import {formatDecimalHoursToString} from "../../../../formater/DecimalHoursFormater.ts";

/* Types */
type PlayerStats = Record<string, any>;
type ServerInfo = { nom: string; description: string };

/* Props attendues */
type Props = {
    serversListActiveGlobal: Record<string, ServerInfo>;
    serversListInactiveGlobal: Record<string, ServerInfo>;
    serversListPartner: Record<string, ServerInfo>;

    statsAllServer: Record<string, PlayerStats[]>;
};

/* Colonnes et largeurs */
const playerStats: Record<string, string> = {
    serveur_playername: "Nom du joueur",
    tmps_jeu: "Heures de jeu",
    nb_mort: "Morts",
    nb_kills: "Kills total",
    nb_pal_catch: "Pal capturés",
    nb_boss_kill: "Boss kills",
    nb_tower_win: "Tower wins",
};

const columnWidths: Record<string, string> = {
    serveur_playername: "200px",
    tmps_jeu: "140px",
    nb_mort: "100px",
    nb_kills: "100px",
    nb_pal_catch: "140px",
    nb_boss_kill: "140px",
    nb_tower_win: "140px",
};

const PlayerClassement: React.FC<Props> = ({
                                               serversListActiveGlobal,
                                               serversListInactiveGlobal,
                                               serversListPartner,

                                               statsAllServer,
                                           }) => {
    // Listes par catégorie
    const activeServersEntries = Object.entries(serversListActiveGlobal);
    const inactiveServersEntries = Object.entries(serversListInactiveGlobal);
    const partnerServersEntries = Object.entries(serversListPartner);

    // Serveur sélectionné au chargement de la page. "" = tous les serveurs
    const firstServer = "";
    const [selectedServer, setSelectedServer] = useState<string>(firstServer);

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "tmps_jeu",
        direction: "desc",
    });

    // tri des joueurs du serveur sélectionné
    const sortedPlayers = useMemo(() => {
        const players = Array.isArray(statsAllServer[selectedServer])
            ? statsAllServer[selectedServer]
            : [];

        return [...players].sort((a, b) => {
            const aVal = a[sortConfig.key] ?? 0;
            const bVal = b[sortConfig.key] ?? 0;

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [selectedServer, sortConfig, statsAllServer]);

    /* Front */
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0 sm:py-8">
            {/* Total tous les serveurs */}
            <div className="mb-4">
                <button
                    key={"__all__"}
                    onClick={() => setSelectedServer("")}
                    className={`px-4 py-2 rounded-md font-medium shadow-md transition border-2 ${
                        selectedServer === "" ? "bg-white" : "text-white"
                    }`}
                    style={
                        selectedServer === ""
                            ? {color: "#081245", borderColor: "#101550"}
                            : {background: "#333", borderColor: "transparent"}
                    }
                >
                    Total de tous les serveurs
                </button>
            </div>

            <div
                className="mb-6 flex flex-col sm:flex-row gap-6 justify-center w-full max-w-full"
                style={{marginTop: "12px"}}
            >
                {/* Serveurs Actifs ADL */}
                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2">Serveurs actifs</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {activeServersEntries.length === 0 ? (
                            <div className="text-gray-500 px-4 py-2">Aucun serveur</div>
                        ) : (
                            activeServersEntries.map(([id, srv]) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedServer(id)}
                                    className={`px-4 py-2 rounded-md font-medium shadow-md transition border-2 ${
                                        selectedServer === id ? "bg-white" : "text-white"
                                    }`}
                                    style={
                                        selectedServer === id
                                            ? {color: "#081245", borderColor: "#101550"}
                                            : {background: "#333", borderColor: "transparent"}
                                    }
                                >
                                    {srv.nom}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Serveurs inactifs ADL */}
                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2">Serveurs désactivés</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {inactiveServersEntries.length === 0 ? (
                            <div className="text-gray-500 px-4 py-2">Aucun serveur</div>
                        ) : (
                            inactiveServersEntries.map(([id, srv]) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedServer(id)}
                                    className={`px-4 py-2 rounded-md font-medium shadow-md transition border-2 ${
                                        selectedServer === id ? "bg-white" : "text-white"
                                    }`}
                                    style={
                                        selectedServer === id
                                            ? {color: "#081245", borderColor: "#101550"}
                                            : {background: "#333", borderColor: "transparent"}
                                    }
                                >
                                    {srv.nom}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Serveurs partenaires */}
                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2">Serveurs partenaires</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {partnerServersEntries.length === 0 ? (
                            <div className="text-gray-500 px-4 py-2">Aucun partenaire</div>
                        ) : (
                            partnerServersEntries.map(([id, srv]) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedServer(id)}
                                    className={`px-4 py-2 rounded-md font-medium shadow-md transition border-2 ${
                                        selectedServer === id ? "bg-white" : "text-white"
                                    }`}
                                    style={
                                        selectedServer === id
                                            ? {color: "#081245", borderColor: "#101550"}
                                            : {background: "#333", borderColor: "transparent"}
                                    }
                                    title={srv.description}
                                >
                                    {srv.nom}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

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
                    {sortedPlayers.length === 0 ? (
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
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {Object.keys(playerStats).map((key) => (
                                    <td
                                        key={key}
                                        className="px-6 py-4 whitespace-nowrap"
                                        style={{minWidth: columnWidths[key]}}
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
                                                return <div>{formatDecimalHoursToString(player[key])}</div>;
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

export default PlayerClassement;
