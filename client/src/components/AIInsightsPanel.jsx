import Card from './Card';
import { getRiskLevelColor } from '../utils/helpers';

const AIInsightsPanel = ({ insights, risk }) => {
    if (!insights) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Summary */}
            <Card>
                <h3 className="text-xl font-poppins font-semibold mb-3">AI Analysis Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {insights.summary}
                </p>
            </Card>

            {/* Risk Assessment */}
            {risk && (
                <Card>
                    <h3 className="text-xl font-poppins font-semibold mb-3">Copyright Risk Assessment</h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium">Risk Level:</span>
                        <span className={`text-2xl font-bold ${getRiskLevelColor(risk.level)}`}>
                            {risk.level}
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Risk Score</span>
                            <span className="font-medium">{risk.score?.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${risk.score >= 70 ? 'bg-red-500' : risk.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${risk.score}%` }}
                            ></div>
                        </div>
                    </div>

                    {risk.factors && risk.factors.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Risk Factors:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {risk.factors.map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {risk.mitigation && risk.mitigation.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Recommended Actions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {risk.mitigation.map((action, index) => (
                                    <li key={index}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            )}

            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
                <Card>
                    <h3 className="text-xl font-poppins font-semibold mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                        {insights.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Detailed Explanation */}
            {insights.explanation && (
                <Card>
                    <h3 className="text-xl font-poppins font-semibold mb-3">Detailed Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {insights.explanation}
                    </p>
                </Card>
            )}

            {/* Source Analysis */}
            {insights.source_analysis && insights.source_analysis.length > 0 && (
                <Card>
                    <h3 className="text-xl font-poppins font-semibold mb-4">Source Analysis</h3>
                    <div className="space-y-4">
                        {insights.source_analysis.map((source) => (
                            <div key={source.rank} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold">#{source.rank} {source.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            by {source.owner} • Cert: {source.certificate_id}
                                        </p>
                                    </div>
                                    <span className="text-lg font-bold text-primary">{source.similarity}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Semantic:</span>
                                        <span className="ml-1 font-medium">{source.breakdown.semantic}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Structural:</span>
                                        <span className="ml-1 font-medium">{source.breakdown.structural}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Hash:</span>
                                        <span className="ml-1 font-medium">{source.breakdown.hash}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                    {source.analysis}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AIInsightsPanel;
