import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import topicsData from '../data/topics.json';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Guard: redirect to login if no auth token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  const [onboardingData, setOnboardingData] = useState({
    topics: [],
    bio: '',
    schedule: {
      time1: '09:00',
      time2: '15:00',
      platforms: ['linkedin'],
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  const topicCategories = topicsData.categories;

  // Filter categories and topics based on search term
  const filteredCategories = topicCategories.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.topics.length > 0
  );

  const steps = [
    {
      title: 'Choose Your Topics',
      subtitle: 'Select topics for your AI-generated posts',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Tell Us About Yourself',
      subtitle: 'Write a short bio for your profile',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'Set Your Schedule',
      subtitle: 'Choose when to post automatically',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const handleTopicToggle = (topic) => {
    setOnboardingData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Update profile with bio
      await apiService.updateProfile({
        bio: onboardingData.bio
      });

      // Update topics
      await apiService.updateTopics(onboardingData.topics);

      // Create schedule
      await apiService.createOrUpdateSchedule({
        time1: onboardingData.schedule.time1,
        time2: onboardingData.schedule.time2,
        platforms: onboardingData.schedule.platforms,
        startDate: onboardingData.schedule.startDate,
        active: true
      });

      // Refresh user data
      const profileData = await apiService.getProfile();
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));

      // Navigate to dashboard
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Topics</h3>
            <p className="text-sm text-slate-500 mb-6">Choose topics that interest you for personalized content.</p>

            {/* Search Input */}
            <div className="relative mb-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
              />
            </div>

            <div className="max-h-80 overflow-y-auto pr-1 space-y-6">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <div key={category.name} className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {category.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map(topic => {
                        const isSelected = onboardingData.topics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleTopicToggle(topic)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No topics found matching "{searchTerm}"</p>
                </div>
              )}
            </div>

            {onboardingData.topics.length > 0 && (
              <p className="text-xs font-semibold text-slate-400 mt-4">
                Selected: <span className="text-indigo-600 font-bold">{onboardingData.topics.length}</span> topics
              </p>
            )}
          </div>
        );

      case 1:
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Bio</h3>
            <p className="text-sm text-slate-500 mb-6">Tell us a bit about yourself and your expertise.</p>
            <textarea
              rows={4}
              placeholder="I'm a software engineer with 5 years of experience in full-stack development..."
              value={onboardingData.bio}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-none"
            />
          </div>
        );

      case 2:
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Posting Schedule</h3>
            <p className="text-sm text-slate-500 mb-6">Set two times per day and select a start date for automated posting.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">FIRST POST TIME</label>
                <input
                  type="time"
                  value={onboardingData.schedule.time1}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, time1: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">SECOND POST TIME</label>
                <input
                  type="time"
                  value={onboardingData.schedule.time2}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, time2: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">SCHEDULE START DATE</label>
              <input
                type="date"
                value={onboardingData.schedule.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, startDate: e.target.value }
                }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
              />
            </div>

            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Platforms
            </h4>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onboardingData.schedule.platforms.includes('linkedin')}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule,
                      platforms: e.target.checked
                        ? [...prev.schedule.platforms, 'linkedin']
                        : prev.schedule.platforms.filter(p => p !== 'linkedin')
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                <span className="ml-3 text-sm font-semibold text-slate-700">LinkedIn</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-10 relative">
        
        {/* Logo and Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-3">
            <svg className="w-6 h-6 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
            Welcome to PostNexus
          </h1>
          <p className="text-sm text-slate-500">
            Let's set up your profile in just a few steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-slate-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Active Step Details */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            {steps[currentStep].icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Step Form Content */}
        <div className="min-h-[16rem]">
          {renderStepContent()}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;