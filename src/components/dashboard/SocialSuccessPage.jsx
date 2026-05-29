import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SocialSuccessPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('message');
    if (successMessage) {
      setMessage(decodeURIComponent(successMessage));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleContinue = () => {
    navigate('/user/social');
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full text-emerald-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Connection Successful!</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {message || 'Your social media account has been connected successfully.'}
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
        >
          Continue to Social Accounts
        </button>
      </div>
    </div>
  );
};

export default SocialSuccessPage;