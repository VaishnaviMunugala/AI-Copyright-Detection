import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">©</span>
                            </div>
                            <span className="font-poppins font-bold text-xl text-white">
                                AI Copyright Detection
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Protect your intellectual property with AI-powered similarity detection
                            and ownership verification. Register your content and detect unauthorized use.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-poppins font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/detect" className="hover:text-primary transition-colors">
                                    Detect Content
                                </Link>
                            </li>
                            <li>
                                <Link to="/verify" className="hover:text-primary transition-colors">
                                    Verify Ownership
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-content" className="hover:text-primary transition-colors">
                                    My Content
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-poppins font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AI Copyright Detection System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
