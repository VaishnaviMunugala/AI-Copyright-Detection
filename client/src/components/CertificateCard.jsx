import Card from './Card';
import Button from './Button';
import { formatDateTime, copyToClipboard, downloadTextFile } from '../utils/helpers';
import { useState } from 'react';

const CertificateCard = ({ certificate, onDownload }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(certificate.formatted_text);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        downloadTextFile(
            certificate.formatted_text,
            `certificate-${certificate.certificate_id}.txt`
        );
    };

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full mb-4">
                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-poppins font-bold mb-2">Ownership Certificate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Official proof of content registration
                </p>
            </div>

            <div className="space-y-4 mb-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Certificate ID</p>
                    <p className="font-mono font-semibold break-all">{certificate.certificate_id}</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</p>
                    <p className="font-semibold">{certificate.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner</p>
                        <p className="font-semibold">{certificate.owner?.name}</p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                        <p className="font-semibold">{certificate.category}</p>
                    </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Date</p>
                    <p className="font-semibold">{certificate.registration_date}</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fingerprint</p>
                    <p className="font-mono text-xs break-all">{certificate.fingerprint?.substring(0, 64)}...</p>
                </div>
            </div>

            <div className="flex space-x-3">
                <Button variant="primary" onClick={handleDownload} className="flex-1">
                    Download Certificate
                </Button>
                <Button variant="outline" onClick={handleCopy} className="flex-1">
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
            </div>

            {certificate.verification_url && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Verification URL:</strong>
                        <br />
                        <a href={certificate.verification_url} className="underline break-all">
                            {certificate.verification_url}
                        </a>
                    </p>
                </div>
            )}
        </Card>
    );
};

export default CertificateCard;
