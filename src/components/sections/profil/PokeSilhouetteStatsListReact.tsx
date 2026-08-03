import type { PokeSilhouetteScoreType } from "../../../types/PokeSilhouetteStatsType.ts";
import { formatDate } from "../../../formater/DateFormater.ts";
import { formatSecondsToString } from "../../../formater/SecondsFormater.ts";

interface Props {
    scores: PokeSilhouetteScoreType[];
}

export default function PokeSilhouetteStatsListReact({ scores }: Props) {
    const hasScores = scores.length > 0;

    return (
        <div className="poke-stats-container relative min-h-[150px]">
            <div className="transition-all duration-300">
                {hasScores ? (
                    <div className="poke-stats-grid">
                        {scores.map((score, idx) => {
                            const game = score.expand?.game;
                            // Si rank === 1 on met un visuel "success" (or) sinon un visuel neutre/failed (silver/bronze/default)
                            const isTop1 = score.rank === 1;
                            const isTop3 = score.rank <= 3;
                            
                            return (
                                <div key={idx} className={`poke-card ${isTop1 ? 'success' : (isTop3 ? 'top3' : 'failed')}`}>
                                    <div className="poke-card-header">
                                        <div className="poke-icon overflow-hidden">
                                            {game && game.pokemon_id ? (
                                                // TODO: Mettre ça sur papi dans le futur (la il est 1h du mat j'ai pas le courage)
                                                <img
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${game.pokemon_id}.png`} 
                                                    alt={game.pokemon_name}
                                                    className="w-full h-full object-contain drop-shadow-md"
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <h3 className="pokemon-name">
                                            {game ? game.pokemon_name : "???"}
                                        </h3>
                                    </div>
                                    
                                    <div className="poke-card-body">
                                        <div className="stat-row">
                                            <span className="stat-label">Rang</span>
                                            <span className="stat-value highlight">#{score.rank}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span className="stat-label">Temps</span>
                                            <span className="stat-value">{formatSecondsToString(score.elapsed_ms / 1000)}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span className="stat-label">Date</span>
                                            <span className="stat-value">{game?.started_at ? formatDate(game.started_at) : (score.created ? formatDate(score.created) : "-")}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Aucune partie de Poke-Silhouette trouvée pour le moment !</p>
                    </div>
                )}
            </div>
        </div>
    );
}
