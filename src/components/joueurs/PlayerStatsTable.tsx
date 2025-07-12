// PlayerStatsTable.tsx
import React from 'react';

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
    typeof ticks === "number" ? `${Math.floor(ticks / 72000)}` : "—";

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

            <table className="min-w-[900px] w-full text-left shadow-lg rounded-xl overflow-hidden bg-white">
                <thead
                    className="text-white text-sm"
                    style={{
                        background: "linear-gradient(to right, #333, #333, #5a1a00)",
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
                        <td className="px-4 py-3 flex items-center gap-2">
                            <img
                                src="https://cdn.discordapp.com/attachments/640874969227722752/1393385036539232378/Minecraft_Bedrock_2023.webp?ex=6872fa70&is=6871a8f0&hm=1405a15075f746c4972d5114b3491641ada99300c5092c352d8b58b16eb3732e&"
                                alt="Minecraft Bedrock"
                                className="w-6 h-6 object-contain"
                            />
                            {stat.nom}
                        </td>
                        <td className={`px-4 py-3 ${stat.tmps_jeux > standoutPlaytime ? 'color-shift' : ''}`}>
                            {formatHeures(stat.tmps_jeux)} heures
                        </td>
                        <td className="px-4 py-3">{stat.nb_mort} morts</td>
                        <td className="px-4 py-3">{stat.nb_kills} kills</td>
                        <td className="px-4 py-3">{stat.nb_playerkill} kills de joueurs</td>
                        <td className="px-4 py-3">{formatBlocs(stat.nb_blocs_detr)} blocs</td>
                        <td className="px-4 py-3">{formatBlocs(stat.nb_blocs_pose)} blocs</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_total)} blocs</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_pieds)} blocs</td>
                        <td className="px-4 py-3">{formatBlocs(stat.dist_elytres)} blocs</td>
                    </tr>
                ))}

                <tr
                    className="text-white text-sm"
                    style={{
                        background: "linear-gradient(to right, #333, #333, #333, #5a1a00)",
                    }}
                >
                    <td className="px-4 py-3">Total tous serveurs</td>
                    <td className="px-4 py-3">{formatHeures(total.tmps_jeux)} heures</td>
                    <td className="px-4 py-3">{total.nb_mort} morts</td>
                    <td className="px-4 py-3">{total.nb_kills} kills</td>
                    <td className="px-4 py-3">{total.nb_playerkill} kills de joueurs</td>
                    <td className="px-4 py-3">{formatBlocs(total.nb_blocs_detr)} blocs</td>
                    <td className="px-4 py-3">{formatBlocs(total.nb_blocs_pose)} blocs</td>
                    <td className="px-4 py-3">{formatBlocs(total.dist_total)} blocs</td>
                    <td className="px-4 py-3">{formatBlocs(total.dist_pieds)} blocs</td>
                    <td className="px-4 py-3">{formatBlocs(total.dist_elytres)} blocs</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlayerStatsTable;
