import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Landing = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="gradient-hero text-white py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fadeIn">
                        <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
                            Protect Your Intellectual Property with AI
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Detect unauthorized use, verify ownership, and secure your creative works
                            with our advanced AI-powered copyright detection system
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/detect">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                                    Start Detection
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                                    Register Content
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">
                        Powerful Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-poppins font-semibold mb-3">AI Similarity Detection</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Advanced algorithms analyze semantic, structural, and cryptographic similarities
                                to detect potential copyright infringement
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-poppins font-semibold mb-3">Ownership Certificates</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Generate timestamped certificates with cryptographic fingerprints
                                to prove authorship and establish creation dates
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-poppins font-semibold mb-3">Real-time Insights</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Get instant AI-powered recommendations, risk assessments,
                                and actionable insights for copyright protection
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">
                        How It Works
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-poppins font-semibold mb-2">Submit Your Content</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Paste or upload your text, code, article, or any written content for analysis
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-poppins font-semibold mb-2">AI Analysis</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our AI engine compares your content against millions of registered works using advanced similarity algorithms
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-poppins font-semibold mb-2">Get Results & Insights</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Receive detailed similarity scores, match levels, and AI-powered recommendations for next steps
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                                4
                            </div>
                            <div>
                                <h3 className="text-xl font-poppins font-semibold mb-2">Register & Protect</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Register your original content to generate ownership certificates and protect your intellectual property
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
                        Ready to Protect Your Content?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of creators who trust our AI-powered platform to safeguard their intellectual property
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                            Get Started Free
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
