import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    return dayjs(date).format('MMMM D, YYYY');
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
    return dayjs(date).format('MMMM D, YYYY [at] h:mm A');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    return dayjs(date).fromNow();
};

/**
 * Format similarity score to percentage
 */
export const formatScore = (score) => {
    // Handle potential mixed scales (0-1 vs 0-100)
    let val = parseFloat(score);
    if (!isNaN(val) && val > 1) {
        // Assume it's already a percentage, cap at 100
        return `${Math.min(val, 100).toFixed(1)}%`;
    }
    // Assume it's 0-1, convert to percentage
    return `${Math.min(val * 100, 100).toFixed(1)}%`;
};

/**
 * Get match level color
 */
export const getMatchLevelColor = (matchLevel) => {
    switch (matchLevel) {
        case 'High Match':
            return 'text-red-600 dark:text-red-400';
        case 'Partial Match':
            return 'text-yellow-600 dark:text-yellow-400';
        case 'Original':
            return 'text-green-600 dark:text-green-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
    }
};

/**
 * Get match level background color
 */
export const getMatchLevelBg = (matchLevel) => {
    switch (matchLevel) {
        case 'High Match':
            return 'bg-red-100 dark:bg-red-900/30';
        case 'Partial Match':
            return 'bg-yellow-100 dark:bg-yellow-900/30';
        case 'Original':
            return 'bg-green-100 dark:bg-green-900/30';
        default:
            return 'bg-gray-100 dark:bg-gray-900/30';
    }
};

/**
 * Get risk level color
 */
export const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
        case 'Critical':
        case 'High':
            return 'text-red-600 dark:text-red-400';
        case 'Moderate':
        case 'Medium':
            return 'text-yellow-600 dark:text-yellow-400';
        case 'Low':
            return 'text-green-600 dark:text-green-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
    }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
};

/**
 * Download text as file
 */
export const downloadTextFile = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatScore,
    getMatchLevelColor,
    getMatchLevelBg,
    getRiskLevelColor,
    truncateText,
    copyToClipboard,
    downloadTextFile,
};
