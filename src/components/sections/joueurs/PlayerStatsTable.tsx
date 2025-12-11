// PlayerStatsTable.tsx
import React from 'react';
import {formatNumber} from "../../../formater/NumberFormater.ts";
import {formatMinecraftPlayTime} from "../../../formater/MinecraftPlayTimeFormater.ts";

type PlayerStat = {
    playername: string;
    uuid: string;
    nom: string;
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
    typeof ticks === "number" ? `${formatMinecraftPlayTime(ticks)}` : "—";

const formatBlocs = (val?: number) =>
    typeof val === "number" ? val.toLocaleString("fr-FR") : "—";

const PlayerStatsTable: React.FC<Props> = ({ player }) => {
    if (!player?.length) return <div style={{ padding: "5em" }}>Aucune donnée joueur disponible</div>;

    const total = player.reduce((acc, stat) => ({
        tmps_jeux: acc.tmps_jeux + (stat.tmps_jeux || 0),
        nb_mort: acc.nb_mort + (stat.nb_mort || 0),
        nb_kills: acc.nb_kills + (stat.nb_kills || 0),
        nb_playerkill: acc.nb_playerkill + (stat.nb_playerkill || 0),
        nb_blocs_detr: acc.nb_blocs_detr + (stat.nb_blocs_detr || 0),
        nb_blocs_pose: acc.nb_blocs_pose + (stat.nb_blocs_pose || 0),
        dist_total: acc.dist_total + (stat.dist_total || 0),
        dist_pieds: acc.dist_pieds + (stat.dist_pieds || 0),
        dist_elytres: acc.dist_elytres + (stat.dist_elytres || 0),
    }), {
        tmps_jeux: 0,
        nb_mort: 0,
        nb_kills: 0,
        nb_playerkill: 0,
        nb_blocs_detr: 0,
        nb_blocs_pose: 0,
        dist_total: 0,
        dist_pieds: 0,
        dist_elytres: 0,
    });

    let standoutPlaytime: number = 250;
    standoutPlaytime = standoutPlaytime * 72000

    return (
        <div className="overflow-x-auto px-4 py-8">
            <style>
                {`
                    @keyframes colorShiftHours {
                        0%   { color: #FF8C00; }   /* orange foncé */
                        33%  { color: #FF6F00; }   /* orange vif */
                        66%  { color: #E65100; }   /* brun orangé */
                        100% { color: #FF8C00; }
                    }

                    .color-shift {
                        animation: colorShiftHours 3s ease-in-out infinite;
                        font-weight: bold;
                    }
                `}
            </style>

            <div className="ranking-table-container">
                <table className="ranking-table">
                    <thead className="ranking-thead">
                    <tr>
                        <th className="ranking-th">Nom du serveur</th>
                        <th className="ranking-th">Temps de jeu</th>
                        <th className="ranking-th">Morts</th>
                        <th className="ranking-th">Kills</th>
                        <th className="ranking-th">Kills joueurs</th>
                        <th className="ranking-th">Blocs cassés</th>
                        <th className="ranking-th">Blocs posés</th>
                        <th className="ranking-th">Distance totale</th>
                        <th className="ranking-th">À pied</th>
                        <th className="ranking-th">Elytres</th>
                    </tr>
                    </thead>
                    <tbody>
                    {player.map((stat, index) => (
                        <tr
                            key={stat.serveur_id}
                            className={index % 2 === 0 ? "ranking-tr-even" : "ranking-tr-odd"}
                        >
                            <td className="ranking-td flex items-center gap-2">
                                <img
                                    src="/icons/minecraft_icon.webp"
                                    alt="Minecraft Bedrock"
                                    className="w-6 h-6 object-contain"
                                />
                                {stat.nom}
                            </td>
                            <td className={`ranking-td ${stat.tmps_jeux > standoutPlaytime ? 'color-shift' : ''}`}>
                                {formatHeures(stat.tmps_jeux)} heures
                            </td>
                            <td className="ranking-td">{formatNumber(stat.nb_mort)} morts</td>
                            <td className="ranking-td">{formatNumber(stat.nb_kills)} kills</td>
                            <td className="ranking-td">{formatNumber(stat.nb_playerkill)} kills de joueurs</td>
                            <td className="ranking-td">{formatBlocs(stat.nb_blocs_detr)} blocs</td>
                            <td className="ranking-td">{formatBlocs(stat.nb_blocs_pose)} blocs</td>
                            <td className="ranking-td">{formatBlocs(stat.dist_total)} blocs</td>
                            <td className="ranking-td">{formatBlocs(stat.dist_pieds)} blocs</td>
                            <td className="ranking-td">{formatBlocs(stat.dist_elytres)} blocs</td>
                        </tr>
                    ))}

                    <tr className="ranking-thead">
                        <td className="ranking-td">Total tous serveurs</td>
                        <td className="ranking-td">{formatHeures(total.tmps_jeux)} heures</td>
                        <td className="ranking-td">{total.nb_mort} morts</td>
                        <td className="ranking-td">{total.nb_kills} kills</td>
                        <td className="ranking-td">{total.nb_playerkill} kills de joueurs</td>
                        <td className="ranking-td">{formatBlocs(total.nb_blocs_detr)} blocs</td>
                        <td className="ranking-td">{formatBlocs(total.nb_blocs_pose)} blocs</td>
                        <td className="ranking-td">{formatBlocs(total.dist_total)} blocs</td>
                        <td className="ranking-td">{formatBlocs(total.dist_pieds)} blocs</td>
                        <td className="ranking-td">{formatBlocs(total.dist_elytres)} blocs</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerStatsTable;
