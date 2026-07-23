import type { PokedevinerStatType } from "../../../types/PokedevinerStatsType.ts";
import { formatDate } from "../../../formater/DateFormater.ts";

interface Props {
    stats: PokedevinerStatType[];
}

export default function PokedevinerStatsListReact({ stats }: Props) {
    const isSuccess = (stat: PokedevinerStatType) => stat.success_at && stat.success_at !== "";
    const isExpired = (stat: PokedevinerStatType) => stat.is_expired === true || stat.expired === true;
    const hasStats = stats.length > 0;

    return (
        <div className="poke-stats-container relative min-h-[150px]">
            <div className="transition-all duration-300">
                {hasStats ? (
                    <div className="poke-stats-grid">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`poke-card ${isSuccess(stat) ? 'success' : 'failed'}`}>
                                <div className="poke-card-header">
                                    <div className="poke-icon">
                                        {isSuccess(stat) ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-success w-6 h-6">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-failed w-6 h-6">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="pokemon-name">
                                        {(isExpired(stat) || isSuccess(stat)) ? stat.pokemon_name : "???"}
                                    </h3>
                                </div>
                                
                                <div className="poke-card-body">
                                    <div className="stat-row">
                                        <span className="stat-label">Essais</span>
                                        <span className="stat-value highlight">{stat.nb_try}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">Début</span>
                                        <span className="stat-value">{formatDate(stat.created)}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">Réussite</span>
                                        <span className="stat-value">{isSuccess(stat) ? formatDate(stat.success_at) : "-"}</span>
                                    </div>
                                    
                                    {stat.pokemon_try_list && Array.isArray(stat.pokemon_try_list) && stat.pokemon_try_list.length > 0 && (
                                        <details className="poke-tries-details group">
                                            <summary>Voir les essais ({stat.pokemon_try_list.length})</summary>
                                            <ul className="poke-tries-list">
                                                {stat.pokemon_try_list.map((tryName: string, index: number) => (
                                                    <li key={index}>
                                                        <span className="try-number">#{index + 1}</span>
                                                        <span className="try-name">{tryName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Aucune partie de Pokedeviner jouée pour le moment !</p>
                    </div>
                )}
            </div>
        </div>
    );
}
