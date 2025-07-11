import React from 'react';

type PlayerStat = {
    playername: string;
    uuid: string;
    nom: string
    tmps_jeux: number;
    nb_mort: number;
    nb_kills: number;
    nb_playerkill: number;
    nb_blocs_detr: number;
    nb_blocs_pose: number;
    dist_total: number;
    dist_pieds: number;
    dist_elytres: number;
    dist_vol: number;
    serveur_id: number;
};

type Props = {
    player: PlayerStat[];
};

const formatHeures = (ticks?: number) =>
    typeof ticks === "number" ? `${Math.floor(ticks / 72000)} h` : "—";

const formatBlocs = (val?: number) =>
    typeof val === "number" ? val.toLocaleString("fr-FR") : "—";

const PlayerStatsTable: React.FC<Props> = ({ player }) => {
    if (!player?.length) return <div style={{ padding: "5em" }}>Aucune donnée joueur disponible</div>;

    return (
        <div className="overflow-x-auto px-4 py-8">
            <table className="min-w-[900px] w-full text-left shadow-lg rounded-xl overflow-hidden bg-white">
                <thead
                    className="text-white text-sm"
                    style={{
                        background: "linear-gradient(to right, #170F24, #101550)",
                    }}
                >
                <tr>
                    <th className="px-4 py-3">Nom du serveur</th>
                    <th className="px-4 py-3">Temps de jeu</th>
                    <th className="px-4 py-3">Morts</th>
                    <th className="px-4 py-3">Kills</th>
                    <th className="px-4 py-3">Kills joueurs</th>
                    <th className="px-4 py-3">Blocs cassés</th>
                    <th className="px-4 py-3">Blocs posés</th>
                    <th className="px-4 py-3">Distance totale</th>
                    <th className="px-4 py-3">À pied</th>
                    <th className="px-4 py-3">Elytres</th>
                </tr>
                </thead>
                <tbody className="text-sm text-[#101550]">
                {player.map((stat, index) => (
                    <tr
                        key={stat.serveur_id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                        <td className="px-4 py-3">{stat.nom}</td>
                        <td className="px-4 py-3">{formatHeures(stat.tmps_jeux)}</td>
                        <td className="px-4 py-3">{stat.nb_mort}</td>
                        <td className="px-4 py-3">{stat.nb_kills}</td>
                        <td className="px-4 py-3">{stat.nb_playerkill}</td>
                        <td className="px-4 py-3">{formatBlocs(stat.nb_blocs_detr)}</td>
                        <td className="px-4 py-3">{formatBlocs(stat.nb_blocs_pose)}</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_total)}</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_pieds)}</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_elytres)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerStatsTable;