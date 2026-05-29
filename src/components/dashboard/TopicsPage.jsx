import { useState, useEffect } from 'react';
import apiService from '../../services/api';

const TopicsPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [topicDialog, setTopicDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [selectedTopics, setSelectedTopics] = useState(currentUser?.topics?.map(t => t.topic) || []);
  const [customTopic, setCustomTopic] = useState('');

  const predefinedTopics = [
    'clean code practices',
    'debugging techniques',
    'code review tips',
    'performance optimization',
    'software architecture',
    'testing strategies',
    'developer productivity',
    'refactoring patterns',
    'API design',
    'database optimization',
    'git workflows',
    'CI/CD best practices',
    'microservices vs monoliths',
    'technical debt management',
    'security best practices'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

        if (profileData.user.topics?.length > 0) {
          setSelectedTopics(profileData.user.topics.map(t => t.topic));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        const saved = localStorage.getItem('currentUser');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim() && !selectedTopics.includes(customTopic.trim())) {
      setSelectedTopics(prev => [...prev, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const handleTopicsSave = async () => {
    try {
      await apiService.updateTopics({ topics: selectedTopics });

      const profileData = await apiService.getProfile();
      setCurrentUser(profileData.user);
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      setTopicDialog(false);
      showSnackbar('Topics updated successfully');
    } catch (error) {
      console.error('Failed to save topics:', error);
      showSnackbar('Failed to update topics', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Topics</h1>
        <p className="text-sm text-slate-500 mt-1">Configure post generation content themes.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-2xl">
        <h2 className="text-base font-bold text-slate-900 mb-1">Content Topics</h2>
        <p className="text-sm text-slate-400 mb-6">Choose topics for your AI-generated posts</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Topics</h3>
            {selectedTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topic => (
                  <span key={topic} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-700">
                    {topic}
                    <button onClick={() => handleTopicToggle(topic)} className="hover:text-indigo-900">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400 italic">No topics selected yet.</p>
            )}
          </div>

          <button
            onClick={() => setTopicDialog(true)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Manage Topics
          </button>
        </div>
      </div>

      {/* Topics Dialog Modal */}
      {topicDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Choose Content Topics</h3>
              <button onClick={() => setTopicDialog(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <p className="text-xs text-slate-500 mb-4">Select topics for your AI-generated posts</p>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Predefined Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {predefinedTopics.map(topic => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => handleTopicToggle(topic)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add Custom Topic</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom topic"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs"
                  />
                  <button
                    onClick={handleAddCustomTopic}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              {selectedTopics.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Topics ({selectedTopics.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map(topic => (
                      <span key={topic} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold">
                        {topic}
                        <button onClick={() => handleTopicToggle(topic)} className="hover:text-indigo-900">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setTopicDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopicsSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Save Topics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Alert */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 ${
            snackbar.severity === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span>{snackbar.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsPage;
