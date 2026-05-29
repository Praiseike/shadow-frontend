import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SocialErrorPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRetry = () => {
    navigate('/user/social');
  };

  const handleGoHome = () => {
    navigate('/user/dashboard');
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full text-rose-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Connection Failed</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            We encountered an error while connecting your social media account.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-left text-xs rounded-xl space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-rose-500">Error Details</p>
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleRetry}
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialErrorPage;