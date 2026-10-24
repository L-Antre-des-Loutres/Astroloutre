import React, {useMemo, useState} from "react";
import {formatNumber} from "../../../../formater/NumberFormater.ts";

/* Types */
export type PalworldRankingStats = {
    key: string;
    playername: string;
    avatar: string | null;
    // Lien vers le profil Steam de l'Antre des loutres, null si les stats ne sont liées à aucun compte
    profil: string | null;
    level: number;
    nb_catch_pal: number;
    species_captured: number;
    pals_possedes: number;
    tower_boss_defeated: number;
    dungeon_clear: number;
    completed_quests: number;
    unlocked_technologies: number;
    fishing_total: number;
    craft_item_total: number;
};
type ServerInfo = { nom: string; description: string };

/* Props attendues */
type Props = {
    serversListActiveGlobal: Record<string, ServerInfo>;
    serversListInactiveGlobal: Record<string, ServerInfo>;
    serversListPartner: Record<string, ServerInfo>;

    statsAllServer: Record<string, PalworldRankingStats[]>;
};

/* Colonnes et largeurs */
const playerStats: Partial<Record<keyof PalworldRankingStats, string>> = {
    playername: "Nom du joueur",
    level: "Niveau",
    nb_catch_pal: "Captures",
    species_captured: "Espèces",
    pals_possedes: "Pals possédés",
    tower_boss_defeated: "Boss de tour",
    dungeon_clear: "Donjons",
    completed_quests: "Quêtes",
    unlocked_technologies: "Technologies",
    fishing_total: "Pêche",
    craft_item_total: "Objets créés",
};

const columnWidths: Record<string, string> = {
    playername: "220px",
    level: "100px",
    nb_catch_pal: "110px",
    species_captured: "100px",
    pals_possedes: "140px",
    tower_boss_defeated: "130px",
    dungeon_clear: "110px",
    completed_quests: "100px",
    unlocked_technologies: "140px",
    fishing_total: "100px",
    craft_item_total: "130px",
};

const PalworldClassement: React.FC<Props> = ({
                                                 serversListActiveGlobal,
                                                 serversListInactiveGlobal,
                                                 serversListPartner,

                                                 statsAllServer,
                                             }) => {
    // Serveur sélectionné au chargement de la page. "" = tous les serveurs
    const [selectedServer, setSelectedServer] = useState<string>("");

    // Tri du tableau sélectionné au chargement de la page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "level",
        direction: "desc",
    });

    // tri des joueurs du serveur sélectionné
    const sortedPlayers = useMemo(() => {
        const players = Array.isArray(statsAllServer[selectedServer])
            ? statsAllServer[selectedServer]
            : [];

        return [...players].sort((a, b) => {
            const aVal = (a as any)[sortConfig.key] ?? 0;
            const bVal = (b as any)[sortConfig.key] ?? 0;

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [selectedServer, sortConfig, statsAllServer]);

    // Boutons de sélection d'une catégorie de serveurs
    const serverButtons = (servers: Record<string, ServerInfo>, emptyLabel: string) => {
        const entries = Object.entries(servers);
        if (entries.length === 0) return <div className="text-gray-500 px-4 py-2">{emptyLabel}</div>;
        return entries.map(([id, srv]) => (
            <button
                key={id}
                onClick={() => setSelectedServer(id)}
                className={`ranking-filter-button ${selectedServer === id ? "active" : "inactive"}`}
                title={srv.description}
            >
                {srv.nom}
            </button>
        ));
    };

    /* Front */
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0">
            {/* Total tous les serveurs */}
            <div className="mb-4">
                <button
                    key={"__all__"}
                    onClick={() => setSelectedServer("")}
                    className={`ranking-filter-button ${selectedServer === "" ? "active" : "inactive"}`}
                >
                    Total de tous les serveurs
                </button>
            </div>

            <div
                className="mb-6 flex flex-col sm:flex-row gap-6 justify-center w-full max-w-full"
                style={{ marginTop: "12px" }}
            >
                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2 ranking-section-title">Serveurs actifs</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {serverButtons(serversListActiveGlobal, "Aucun serveur")}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2 ranking-section-title">Serveurs
                        désactivés</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {serverButtons(serversListInactiveGlobal, "Aucun serveur")}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-center text-lg font-semibold mb-2 ranking-section-title">Serveurs
                        partenaires</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {serverButtons(serversListPartner, "Aucun partenaire")}
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
                            <tr key={player.key} className={idx % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}>
                                {Object.keys(playerStats).map((key) => (
                                    <td
                                        key={key}
                                        className="ranking-td"
                                        style={{minWidth: columnWidths[key]}}
                                    >
                                        {key === "playername" ? (
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={player.avatar || "/icons/logo_palworld_mini.jpg"}
                                                    alt={player.playername}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-sm"
                                                />
                                                {player.profil ? (
                                                    <a href={player.profil} className="ranking-link">
                                                        {player.playername}
                                                    </a>
                                                ) : (
                                                    <span title="Compte Steam non lié à l'Antre des loutres">
                                                        {player.playername}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div>{formatNumber((player as any)[key] || 0)}</div>
                                        )}
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
                    <a href="/donnees" className="ranking-link">
                        En savoir plus sur l'utilisation de mes données
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PalworldClassement;
