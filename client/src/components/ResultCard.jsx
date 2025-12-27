import Card from './Card';
import { getMatchLevelColor, getMatchLevelBg, formatScore } from '../utils/helpers';

import Speedometer from './Speedometer';

const ResultCard = ({ result }) => {
    const { similarity_score, match_level, matched_sources } = result;

    return (
        <Card className="animate-fadeIn">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-poppins font-bold mb-2">Detection Result</h2>

                {/* Speedometer Display */}
                <div className="my-6">
                    <Speedometer score={similarity_score} />
                    <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-gray-100">
                        {formatScore(similarity_score)}
                    </p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mt-1">Similarity</p>
                </div>

                <div className={`inline-block px-6 py-3 rounded-full ${getMatchLevelBg(match_level)}`}>
                    <span className={`text-xl font-bold ${getMatchLevelColor(match_level)}`}>
                        {match_level} Match Level
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Matches Found</p>
                    <p className="text-3xl font-bold text-secondary">{matched_sources?.length || 0}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Assessment</p>
                    <p className={`text-xl font-bold ${getMatchLevelColor(match_level)}`}>
                        {match_level === 'High Match' ? 'Critical' : match_level === 'Partial Match' ? 'Moderate' : 'Low'}
                    </p>
                </div>
            </div>

            {matched_sources && matched_sources.length > 0 && (
                <div>
                    <h3 className="text-xl font-poppins font-semibold mb-4">Top Matches</h3>
                    <div className="space-y-3">
                        {matched_sources.slice(0, 5).map((source, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{source.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        by {source.owner?.name || 'Unknown'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary">
                                        {formatScore(source.similarity_score)}
                                    </p>
                                    <p className="text-xs text-gray-500">similarity</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ResultCard;
