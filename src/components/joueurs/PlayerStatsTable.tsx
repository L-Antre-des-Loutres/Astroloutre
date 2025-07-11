import React from 'react';

type PlayerStat = {
    playername: string;
    uuid: string;
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
    player: PlayerStat;
};

const formatHeures = (ticks?: number) =>
    typeof ticks === "number" ? `${Math.floor(ticks / 72000)} h` : "—";

const formatBlocs = (val?: number) =>
    typeof val === "number" ? val.toLocaleString("fr-FR") + " blocs" : "—";

const PlayerStatsReact: React.FC<Props> = ({ player }) => {
    console.log(player)
    return (player?.playername?.trim()) ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-start px-4 py-0 sm:py-8">
            <div className="w-full max-w-3xl overflow-x-auto shadow-lg rounded-xl bg-white">
                <table className="w-full text-base text-left overflow-hidden rounded-xl">
                    <thead
                        style={{
                            background: "linear-gradient(to right, #170F24, #101550)",
                        }}
                        className="text-white text-base"
                    >
                    <tr>
                        <th className="px-6 py-4 font-semibold">Statistique</th>
                        <th className="px-6 py-4 font-semibold">Valeur</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-[#101550]">Nom du joueur</td>
                        <td className="px-6 py-4">{player.playername}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#101550]">Temps de jeu</td>
                        <td className="px-6 py-4">{formatHeures(player.tmps_jeux)}</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-[#101550]">Morts</td>
                        <td className="px-6 py-4">{player.nb_mort}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#101550]">Kills (total)</td>
                        <td className="px-6 py-4">{player.nb_kills}</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-[#101550]">Kills joueurs</td>
                        <td className="px-6 py-4">{player.nb_playerkill}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#101550]">Blocs cassés</td>
                        <td className="px-6 py-4">{formatBlocs(player.nb_blocs_detr)}</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-[#101550]">Blocs posés</td>
                        <td className="px-6 py-4">{formatBlocs(player.nb_blocs_pose)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#101550]">Distance totale</td>
                        <td className="px-6 py-4">{formatBlocs(player.dist_total)}</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-[#101550]">Distance à pied</td>
                        <td className="px-6 py-4">{formatBlocs(player.dist_pieds)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#101550]">Distance en elytres</td>
                        <td className="px-6 py-4">{formatBlocs(player.dist_elytres)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <div style={{ padding: "5em" }}>Aucune donnée joueur disponible</div>
    );
};


export default PlayerStatsReact;
