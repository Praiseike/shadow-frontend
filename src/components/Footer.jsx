import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo & Intro */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                PostNexus
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              AI-powered social media automation for professionals who want to grow their online presence without the hassle.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 4 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} PostNexus. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Made for builders and creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;