import React, {useMemo, useState} from "react";
import {slugify} from "../../../../formater/JoueurFormater.ts";
import {formatNumber} from "../../../../formater/NumberFormater.ts";
import {formatMinecraftPlayTime} from "../../../../formater/MinecraftPlayTimeFormater.ts";

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
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0">
            {/* Total tous les serveurs */}
            <div className="mb-4">
                <button
                    key={"__all__"}
                    onClick={() => setSelectedServer("")}
                    className={`ranking-filter-button ${selectedServer === "" ? "active" : "inactive"
                    }`}
                >
                    Total de tous les serveurs
                </button>
            </div>

            <div
                className="mb-6 flex flex-col sm:flex-row gap-6 justify-center w-full max-w-full"
                style={{ marginTop: "12px" }}
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
                                    className={`ranking-filter-button ${selectedServer === id ? "active" : "inactive"
                                    }`}
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
                                    className={`ranking-filter-button ${selectedServer === id ? "active" : "inactive"
                                    }`}
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
                                    className={`ranking-filter-button ${selectedServer === id ? "active" : "inactive"
                                    }`}
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
            <div className="ranking-table-container">
                <table className="ranking-table">
                    <thead className="ranking-thead">
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
                    {sortedPlayers.length === 0 ? (
                        <tr>
                            <td
                                colSpan={Object.keys(playerStats).length}
                                className="text-center px-6 py-8 ranking-text-color bg-white"
                            >
                                Pas de données pour ce serveur.
                            </td>
                        </tr>
                    ) : (
                        sortedPlayers.map((player, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(playerStats).map((key) => (
                                    <td
                                        key={key}
                                        className="ranking-td"
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
                                                                    className="ranking-link"
                                                                >
                                                                    {player.playername}
                                                                </a>
                                                            </span>
                                                    </div>
                                                );
                                            } else if (key === "tmps_jeu") {
                                                const heures = formatMinecraftPlayTime((player[key] || 0));
                                                return <div>{formatNumber(heures)} heures</div>;
                                            } else if (
                                                key === "nb_blocs_pose" ||
                                                key === "nb_blocs_detr" ||
                                                key === "dist_total" ||
                                                key === "dist_pieds" ||
                                                key === "dist_elytres"
                                            ) {
                                                return <div>{formatNumber(player[key] || 0)} blocs</div>;
                                            } else if (key === "nb_kills") {
                                                return <div>{formatNumber(player.nb_kills || 0)}</div>;
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

export default PlayerClassement;
